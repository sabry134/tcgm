defmodule TcgmWebApp.Game.GameServerTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameServer

  setup do
    room_id = "test_room"
    {:ok, _pid} = GameServer.start_link(room_id)
    {:ok, room_id: room_id}
  end

  test "players can join a room", %{room_id: room_id} do
    assert :ok = GameServer.join_room(room_id, "player1")

    state = GameServer.get_state(room_id)
    assert Map.has_key?(state.players, "player1")
  end

  test "card can be inserted to location", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    initial_state = GameServer.get_state(room_id)

    assert map_size(initial_state.players["player1"]["hand"]) == 0

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    :ok = GameServer.insert_card(room_id, "player1", card, "hand")

    updated_state = GameServer.get_state(room_id)
    assert map_size(updated_state.players["player1"]["hand"]) == 1
  end

  test "players can play a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    initial_state = GameServer.get_state(room_id)

    assert map_size(initial_state.players["player1"]["field"]) == 0

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    :ok = GameServer.insert_card(room_id, "player1", card, "hand")
    :ok = GameServer.play_card(room_id, "player1", card)

    updated_state = GameServer.get_state(room_id)

    assert map_size(updated_state.players["player1"]["field"]) == 1
    assert Map.has_key?(updated_state.players["player1"]["field"], "Card X") == true
  end

  test "players can set their deck", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    initial_state = GameServer.get_state(room_id)

    assert map_size(initial_state.players["player1"]["deck"]) == 0

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    :ok = GameServer.set_deck(room_id, "player1", card)

    updated_state = GameServer.get_state(room_id)

    assert map_size(updated_state.players["player1"]["deck"]) == 1
    assert Map.has_key?(updated_state.players["player1"]["deck"], "Card X") == true
  end

  test "players can draw a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    :ok = GameServer.set_deck(room_id, "player1", card)

    initial_state = GameServer.get_state(room_id)

    assert map_size(initial_state.players["player1"]["hand"]) == 0

    :ok = GameServer.draw_card(room_id, "player1")

    updated_state = GameServer.get_state(room_id)

    assert map_size(updated_state.players["player1"]["hand"]) == 1
    assert Map.has_key?(updated_state.players["player1"]["hand"], "Card X") == true

    assert map_size(updated_state.players["player1"]["deck"]) == 0
  end

  test "players can move a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    card = %{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}
    source = "hand"
    dest = "field"

    :ok = GameServer.set_deck(room_id, "player1", card)

    initial_state = GameServer.get_state(room_id)

    assert map_size(initial_state.players["player1"][dest]) == 0

    :ok = GameServer.draw_card(room_id, "player1")
    :ok = GameServer.move_card(room_id, "player1", source, dest, card)
    updated_state = GameServer.get_state(room_id)

    assert map_size(updated_state.players["player1"][dest]) == 1
    assert Map.has_key?(updated_state.players["player1"][dest], "Card Y") == true

    assert map_size(updated_state.players["player1"][source]) == 0
  end

  test "players can update a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    card = %{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}
    location = "hand"

    :ok = GameServer.set_deck(room_id, "player1", card)

    :ok = GameServer.draw_card(room_id, "player1")
    draw_state = GameServer.get_state(room_id)
    assert draw_state.players["player1"][location]["Card Y"]["properties"]["attack"] == 9
    :ok = GameServer.update_card(room_id, "player1", location, "Card Y", "attack", 20)
    updated_state = GameServer.get_state(room_id)

    assert updated_state.players["player1"][location]["Card Y"]["properties"]["attack"] == 20
  end

  test "set_turn set the turn state", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")
    player = "player2"

    :ok = GameServer.set_turn(room_id, player)

    updated_state = GameServer.get_state(room_id)
    assert updated_state.turn == "player2"
  end

  test "pass_turn pass the turn to another player", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    player = "player2"

    :ok = GameServer.set_turn(room_id, "player1")
    :ok = GameServer.pass_turn(room_id, player)

    updated_state = GameServer.get_state(room_id)

    assert updated_state.turn == "player2"
    assert updated_state.turnCount == 1
  end

  test "game start", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")
    GameServer.join_room(room_id, "player2")

    :ok = GameServer.start_game(room_id)

    state = GameServer.get_state(room_id)

    assert map_size(state.players["player1"]["deck"]) == 0
    assert map_size(state.players["player2"]["deck"]) == 0
    assert map_size(state.players["player1"]["hand"]) == 5
    assert map_size(state.players["player2"]["hand"]) == 5
  end

  test "game start with casters", %{room_id: room_id} do
    GameServer.join_room(room_id, "player4")
    GameServer.join_room(room_id, "player2")

    :ok = GameServer.start_game(room_id)

    state = GameServer.get_state(room_id)

    assert Map.has_key?(state.players["player4"]["caster"], "active") == true
    assert Map.has_key?(state.players["player4"]["caster"], "inactive") == true
    assert map_size(state.players["player4"]["caster"]["active"]) == 1
    assert map_size(state.players["player4"]["caster"]["inactive"]) == 1
    assert Map.has_key?(state.players["player2"]["caster"], "active") == false
    assert Map.has_key?(state.players["player2"]["caster"], "inactive") == false
    assert map_size(state.players["player2"]["caster"]) == 0
    assert map_size(state.players["player4"]["hand"]) == 5
    assert map_size(state.players["player2"]["hand"]) == 5
  end

  test "game start with player 3", %{room_id: room_id} do
    GameServer.join_room(room_id, "player2")
    GameServer.join_room(room_id, "player3")

    :ok = GameServer.start_game(room_id)

    state = GameServer.get_state(room_id)

    assert map_size(state.players["player3"]["deck"]) == 0
    assert map_size(state.players["player2"]["deck"]) == 0
    assert map_size(state.players["player3"]["hand"]) == 5
    assert map_size(state.players["player2"]["hand"]) == 5
  end


end
