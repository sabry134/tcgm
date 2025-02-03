defmodule TcgmWebApp.Rooms.RoomServerTest do
  use ExUnit.Case, async: true

  alias TcgmWebApp.Rooms.{RoomServer, RoomSupervisor, RoomRegistry}

  setup do
    :ok
  end

  test "creates a room process" do
    room_id = "room1"

    assert {:ok, _pid} = RoomSupervisor.create_room(room_id)

    # Ensure process exists
    assert [{_pid, _}] = Registry.lookup(TcgmWebApp.Rooms.RoomRegistry, room_id)
  end

  test "players can join a room" do
    room_id = "room2"
    RoomSupervisor.create_room(room_id)

    assert :ok = RoomServer.join_room(room_id, "player1")
    assert :ok = RoomServer.join_room(room_id, "player2")

    state = GenServer.call(RoomServer.via_tuple(room_id), :get_state)

    assert state.players == ["player1", "player2"]
  end

  #test "players can make a move" do
  #  room_id = "room3"
  #  RoomSupervisor.create_room(room_id)

  #  assert :ok = RoomServer.join_room(room_id, "player1")
  #  assert :ok = RoomServer.make_move(room_id, %{action: "attack"})

  #  state = GenServer.call(RoomServer.via_tuple(room_id), :get_state)

  #  assert state.turn == 2
  #end

  test "players can end their turn" do
    room_id = "room3"
    RoomSupervisor.create_room(room_id)

    assert :ok = RoomServer.join_room(room_id, "player1")
    assert :ok = RoomServer.end_turn(room_id)

    state = GenServer.call(RoomServer.via_tuple(room_id), :get_state)

    assert state.turn == 2
  end

  test "multiple rooms run concurrently" do
    RoomSupervisor.create_room("roomA")
    RoomSupervisor.create_room("roomB")

    RoomServer.join_room("roomA", "player1")
    RoomServer.join_room("roomB", "player2")

    RoomServer.end_turn("roomA")
    RoomServer.end_turn("roomB")

    stateA = GenServer.call(RoomServer.via_tuple("roomA"), :get_state)
    stateB = GenServer.call(RoomServer.via_tuple("roomB"), :get_state)

    assert stateA.players == ["player1"]
    assert stateB.players == ["player2"]

    assert stateA.turn == 2
    assert stateB.turn == 2
  end

  defp create_player do
    self_pid = self()

    Task.start(fn ->
      receive do
        {:move_played, move_message} -> send(self_pid, {:move_received, move_message})
      end
    end)

    self_pid
  end

  test "make_move sends move message to all players" do
    room_id = "room4"
    RoomSupervisor.create_room(room_id)

    player1_pid = create_player()
    player2_pid = create_player()

    # Join players to the room
    RoomServer.join_room(room_id, player1_pid)
    RoomServer.join_room(room_id, player2_pid)

    move = %{action: "attack"}

    # Make the move in the room
    GenServer.call(RoomServer.via_tuple(room_id), {:make_move, "player1", move})

    # Assert that both players received the move message
    assert_receive {:move_played, %{move: %{action: "attack"}, player: "player1"}}, 100
    assert_receive {:move_played, %{move: %{action: "attack"}, player: "player1"}}, 100
  end
end
