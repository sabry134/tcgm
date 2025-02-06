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
    # Subscribe and join the room channel
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    assert socket.assigns.room_id == room_id

    # Now, explicitly call the join_room action to add a player to the game state
    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})

    # Ensure the player is in the state
    assert Map.has_key?(state.players, "player1")
  end

  test "playing a card updates game state", %{socket: socket, room_id: room_id} do
    # Subscribe and join the room channel
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    # Add the player after joining the channel
    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    # Now, play a card
    push(socket, "play_card", %{"player_id" => "player1", "card" => "Fireball"})
    assert_broadcast("game_update", %{state: updated_state})

    # Ensure the card is added to the player's field
    assert "Fireball" in updated_state.players["player1"].field
  end

  test "setting a deck updates game state", %{socket: socket, room_id: room_id} do
    # Subscribe and join the room channel
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    # Add the player after joining the channel
    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    # Now, set the player's deck
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => ["Fireball"]})
    assert_broadcast("game_update", %{state: updated_state})

    # Ensure the deck is set
    assert "Fireball" in updated_state.players["player1"].deck
  end

  test "drawing a card updates game state", %{socket: socket, room_id: room_id} do
    # Subscribe and join the room channel
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    # Add the player after joining the channel
    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    # Set the player's deck
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => ["Fireball"]})
    assert_broadcast("game_update", %{state: updated_state})

    # Now, draw a card
    push(socket, "draw_card", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: updated_state})

    # Ensure the card is drawn
    assert "Fireball" in updated_state.players["player1"].hand
  end
end
