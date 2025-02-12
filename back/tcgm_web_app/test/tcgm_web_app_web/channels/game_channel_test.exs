defmodule TcgmWebAppWeb.GameChannelTest do
  use TcgmWebAppWeb.ChannelCase

  alias TcgmWebAppWeb.GameChannel
  alias TcgmWebApp.Game.GameServer

  setup do
    room_id = "test_room"
    {:ok, _pid} = GameServer.start_link(room_id)
    {:ok, socket} = connect(TcgmWebAppWeb.UserSocket, %{})

    {:ok, socket: socket, room_id: room_id}
  end

  test "players can join room channel", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    assert socket.assigns.room_id == room_id

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})

    assert Map.has_key?(state.players, "player1")
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

    assert Map.has_key?(updated_state.players["player1"]["hand"], "Card X") == true
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

    assert Map.has_key?(updated_state.players["player1"]["field"], "Card X") == true
  end

  test "setting a deck updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    deck = %{"Card X" => card}
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: updated_state})

    assert Map.has_key?(updated_state.players["player1"]["deck"], "Card X") == true
  end

  test "drawing a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    deck = %{"Card X" => card}
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "draw_card", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: updated_state})

    assert Map.has_key?(updated_state.players["player1"]["hand"], "Card X") == true
  end
end
