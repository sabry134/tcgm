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
    # Ensure state contains `players`
    assert Map.has_key?(state.players, "player1")
  end

  test "players can play a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    initial_state = GameServer.get_state(room_id)

    # Ensure player1 starts with an empty field
    assert length(initial_state.players["player1"].field) == 0

    :ok = GameServer.play_card(room_id, "player1", "Test Card")

    updated_state = GameServer.get_state(room_id)

    # Ensure card is now in the field
    assert length(updated_state.players["player1"].field) == 1
    assert "Test Card" in updated_state.players["player1"].field
  end

  test "players can set their deck", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")

    initial_state = GameServer.get_state(room_id)

    # Ensure player1 starts with an empty deck
    assert length(initial_state.players["player1"].deck) == 0

    :ok = GameServer.set_deck(room_id, "player1", ["Test Card"])

    updated_state = GameServer.get_state(room_id)

    # Ensure player1 now has a deck with the card
    assert length(updated_state.players["player1"].deck) == 1
    assert "Test Card" in updated_state.players["player1"].deck
  end

  test "players can draw a card", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")
    GameServer.set_deck(room_id, "player1", ["Test Card"])

    initial_state = GameServer.get_state(room_id)

    :ok = GameServer.set_deck(room_id, "player1", ["Test Card"])
    # Ensure player1 starts with an empty hand
    assert length(initial_state.players["player1"].hand) == 0

    :ok = GameServer.draw_card(room_id, "player1")

    updated_state = GameServer.get_state(room_id)

    # Ensure player1 now has a hand with the card
    assert length(updated_state.players["player1"].hand) == 1
    assert "Test Card" in updated_state.players["player1"].hand

    # Ensure player1's deck is now empty
    assert length(updated_state.players["player1"].deck) == 0
  end
end
