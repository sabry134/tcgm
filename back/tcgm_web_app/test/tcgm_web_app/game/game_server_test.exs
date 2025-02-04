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
end
