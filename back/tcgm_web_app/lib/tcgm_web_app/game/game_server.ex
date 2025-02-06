defmodule TcgmWebApp.Game.GameServer do
  use GenServer

  alias TcgmWebApp.Game.GameLogic

  def start_link(room_id) do
    GenServer.start_link(__MODULE__, room_id, name: via_tuple(room_id))
  end

  def via_tuple(room_id), do: {:via, Registry, {TcgmWebApp.RoomRegistry, room_id, nil}}

  def init(room_id) do
    state = %{
      id: room_id,
      players: %{},
      turn: nil,
      phase: :waiting
    }
    {:ok, state}
  end

  # Public API functions

  def get_state(room_id) do
    GenServer.call(via_tuple(room_id), :get_state)
  end

  def join_room(room_id, player_id) do
    GenServer.call(via_tuple(room_id), {:join, player_id})
  end

  def set_deck(room_id, player_id, deck) do
    GenServer.cast(via_tuple(room_id), {:set_deck, player_id, deck})
  end

  def play_card(room_id, player_id, card) do
    GenServer.cast(via_tuple(room_id), {:play_card, player_id, card})
  end

  def draw_card(room_id, player_id) do
    GenServer.cast(via_tuple(room_id), {:draw_card, player_id})
  end

  # Server interaction functions

  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:join, player_id}, _from, state) do
    new_state = %{state | players: Map.put(state.players, player_id, %{hand: [], deck: [], field: [], graveyard: []})}

    {:reply, :ok, new_state}
  end

  def handle_cast({:set_deck, player_id, deck}, state) do
    new_state = %{state | players: Map.update!(state.players, player_id, fn player -> %{player | deck: deck} end)}
    {:noreply, new_state}
  end

  def handle_cast({:play_card, player_id, card}, state) do
    new_state = GameLogic.play_card_logic(state, player_id, card)
    {:noreply, new_state}
  end

  def handle_cast({:draw_card, player_id}, state) do
    new_state = GameLogic.draw_card(state, player_id)
    {:noreply, new_state}
  end
end
