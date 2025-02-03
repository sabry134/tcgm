defmodule TcgmWebApp.Rooms.RoomServer do
  use GenServer

  def start_link(room_id) do
    GenServer.start_link(__MODULE__, room_id, name: via_tuple(room_id))
  end

  def via_tuple(room_id), do: {:via, Registry, {TcgmWebApp.Rooms.RoomRegistry, room_id}}

  def create_room(room_id) do
    DynamicSupervisor.start_child(TcgmWebApp.Rooms.RoomSupervisor, {__MODULE__, room_id})
  end

  def join_room(room_id, player) do
    GenServer.cast(via_tuple(room_id), {:join, player})
  end

  def make_move(room_id, move) do
    GenServer.call(via_tuple(room_id), {:make_move, move})
  end

  def end_turn(room_id) do
    GenServer.call(via_tuple(room_id), :end_turn)
  end

  def init(room_id) do
    state = %{
      room_id: room_id,
      players: [],
      turn: 1,
      game_state: :waiting_for_players
    }
    {:ok, state}
  end

  def handle_cast({:join, player}, state) do
    new_state = %{state | players: state.players ++ [player]}
    {:noreply, new_state}
  end

  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:make_move, player, move}, _from, state) do
    # Create a move notification message
    move_message = %{
      player: player,
      move: move
    }

    # Send move message to each player
    Enum.each(state.players, fn player_pid ->
      send(player_pid, {:move_played, move_message})
    end)

    # Return the state without ending the turn
    {:reply, :ok, state}
  end

  def handle_call(:end_turn, _from, state) do
    # Implement end turn logic here
    {:reply, :ok, %{state | turn: state.turn + 1}}
  end
end
