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
    assert length(initial_state.players["player1"]["hand"]) == 0

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    :ok = GameServer.insert_card(room_id, "player1", card, "hand")

    updated_state = GameServer.get_state(room_id)
    assert length(updated_state.players["player1"]["hand"]) == 1
  end

  test "players can play a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players["player1"]["field"]) == 0

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    :ok = GameServer.insert_card(room_id, "player1", card, "hand")
    :ok = GameServer.play_card(room_id, "player1", card)

    updated_state = GameServer.get_state(room_id)

    assert length(updated_state.players["player1"]["field"]) == 1
    assert Enum.any?(updated_state.players["player1"]["field"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "players can set their deck", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players["player1"]["deck"]) == 0

    card = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    :ok = GameServer.set_deck(room_id, "player1", card)

    updated_state = GameServer.get_state(room_id)
    assert length(updated_state.players["player1"]["deck"]) == 1
    assert Enum.any?(updated_state.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "players can draw a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    card = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    :ok = GameServer.set_deck(room_id, "player1", card)

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players["player1"]["hand"]) == 0

    :ok = GameServer.draw_card(room_id, "player1")

    updated_state = GameServer.get_state(room_id)

    assert length(updated_state.players["player1"]["hand"]) == 1
    assert Enum.any?(updated_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card X") end) == true

    assert length(updated_state.players["player1"]["deck"]) == 0
  end

  test "players can move a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    tmp_card = %{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}

    deck = [tmp_card]
    source = "hand"
    dest = "field"

    :ok = GameServer.set_deck(room_id, "player1", deck)

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players["player1"][dest]) == 0

    :ok = GameServer.draw_card(room_id, "player1")
    :ok = GameServer.move_card(room_id, "player1", source, dest, tmp_card)
    updated_state = GameServer.get_state(room_id)

    assert length(updated_state.players["player1"][dest]) == 1
    assert Enum.any?(updated_state.players["player1"][dest], fn card -> Map.has_key?(card, "Card Y") end) == true

    assert length(updated_state.players["player1"][source]) == 0
  end

  test "players can update a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    card = [%{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}]
    location = "hand"

    :ok = GameServer.set_deck(room_id, "player1", card)

    :ok = GameServer.draw_card(room_id, "player1")
    draw_state = GameServer.get_state(room_id)
    c = Enum.find(draw_state.players["player1"][location], fn c -> Map.has_key?(c, "Card Y") end)
    assert c["Card Y"]["properties"]["attack"] == 9
    :ok = GameServer.update_card(room_id, "player1", location, "Card Y", "attack", 20)
    updated_state = GameServer.get_state(room_id)

    c = Enum.find(updated_state.players["player1"][location], fn c -> Map.has_key?(c, "Card Y") end)
    assert c["Card Y"]["properties"]["attack"] == 20
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

    assert length(state.players["player1"]["deck"]) == 0
    assert length(state.players["player2"]["deck"]) == 0
    assert length(state.players["player1"]["hand"]) == 5
    assert length(state.players["player2"]["hand"]) == 5
  end

  test "game start with casters", %{room_id: room_id} do
    GameServer.join_room(room_id, "player4")
    GameServer.join_room(room_id, "player2")

    :ok = GameServer.start_game(room_id)

    state = GameServer.get_state(room_id)

    assert Enum.any?(state.players["player4"]["caster"], fn card -> Map.has_key?(card, "active") end) == true
    assert Enum.any?(state.players["player4"]["caster"], fn card -> Map.has_key?(card, "inactive") end) == true
    active = Enum.find(state.players["player4"]["caster"], fn c -> Map.has_key?(c, "active") end)
    inactive = Enum.find(state.players["player4"]["caster"], fn c -> Map.has_key?(c, "inactive") end)
    assert map_size(active["active"]) == 1
    assert map_size(inactive["inactive"]) == 1
    assert Enum.any?(state.players["player2"]["caster"], fn card -> Map.has_key?(card, "active") end) == false
    assert Enum.any?(state.players["player2"]["caster"], fn card -> Map.has_key?(card, "inactive") end) == false
    assert length(state.players["player2"]["caster"]) == 0
    assert length(state.players["player4"]["hand"]) == 5
    assert length(state.players["player2"]["hand"]) == 5
  end

  test "game start with player 3", %{room_id: room_id} do
    GameServer.join_room(room_id, "player2")
    GameServer.join_room(room_id, "player3")

    :ok = GameServer.start_game(room_id)

    state = GameServer.get_state(room_id)

    assert length(state.players["player3"]["deck"]) == 0
    assert length(state.players["player2"]["deck"]) == 0
    assert length(state.players["player3"]["hand"]) == 5
    assert length(state.players["player2"]["hand"]) == 5
  end

end
