defmodule TcgmWebAppWeb.GameChannelTest do
  use TcgmWebAppWeb.ChannelCase

  alias TcgmWebAppWeb.GameChannel
  alias TcgmWebApp.Game.GameServer

  setup do
    room_id = "test_room"
    {:ok, _pid} = GameServer.start_link(room_id)
    {:ok, socket} = connect(TcgmWebAppWeb.UserSocket, %{})
    {:ok, socket2} = connect(TcgmWebAppWeb.UserSocket, %{})

    {:ok, socket: socket, socket2: socket2, room_id: room_id}
  end

  test "players can join room channel", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    assert socket.assigns.room_id == room_id

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})

    assert Map.has_key?(state.players, "player1")
  end

  test "multiple players can join room channel", %{socket: socket, socket2: socket2, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    assert socket.assigns.room_id == room_id

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    {:ok, _, socket2} = subscribe_and_join(socket2, GameChannel, "room:" <> room_id, %{})
    push(socket2, "join_room", %{"player_id" => "player2"})
    assert_broadcast("game_update", %{state: updated_state})
    assert Map.has_key?(updated_state.players, "player2")
  end

  test "multiple players receive broadcasts", %{socket: socket1, socket2: socket2, room_id: room_id} do
    {:ok, _, socket1} = subscribe_and_join(socket1, GameChannel, "room:" <> room_id, %{})
    push(socket1, "join_room", %{"player_id" => "player1"})

    assert_broadcast("game_update", %{state: state1})
    assert Map.has_key?(state1.players, "player1")

    # Now join the second socket
    {:ok, _, socket2} = subscribe_and_join(socket2, GameChannel, "room:" <> room_id, %{})
    push(socket2, "join_room", %{"player_id" => "player2"})

    assert_broadcast("game_update", %{state: state2})
    assert Map.has_key?(state2.players, "player2")

    # Ensure both players are in the final broadcasted state
    assert Map.has_key?(state2.players, "player1")
    assert Map.has_key?(state2.players, "player2")
  end

  test "inserting a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "playing a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card, "location" => "hand"})
    assert_broadcast("game_update", %{state: _updated_state})
    push(socket, "play_card", %{"player_id" => "player1", "card" => card})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"]["field"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "setting a deck updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    deck = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "drawing a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    deck = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "draw_card", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "moving a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")
    tmp_card = %{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}
    deck = [tmp_card]
    source = "hand"
    dest = "field"
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "draw_card", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "move_card", %{"player_id" => "player1", "source" => source, "dest" => dest, "card" => tmp_card})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"][dest], fn card -> Map.has_key?(card, "Card Y") end) == true
  end

  test "updating a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    deck = [%{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}]
    location = "hand"
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "draw_card", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "update_card", %{"player_id" => "player1", "location" => location, "card" => "Card Y", "key" => "attack", "value" => 20})
    assert_broadcast("game_update", %{state: updated_state})

    c = Enum.find(updated_state.players["player1"][location], fn c -> Map.has_key?(c, "Card Y") end)
    assert c["Card Y"]["properties"]["attack"] == 20
  end

  test "setting the turn state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    push(socket, "set_turn", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: updated_state})

    assert updated_state.turn == "player1"
  end

  test "passing the turn to another player", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    push(socket, "set_turn", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "pass_turn", %{"player_id" => "player2"})
    assert_broadcast("game_update", %{state: updated_state})

    assert updated_state.turn == "player2"
    assert updated_state.turnCount == 1
  end
end
