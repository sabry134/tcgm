defmodule TcgWebApp.Gameplay.GameState do
  use GenServer

  alias TcgWebApp.Gameplay.{Player, Actions, TurnManager}

  def start_link(initial_state) do
    GenServer.start_link(__MODULE__, initial_state, name: :game_server)
  end

  def init(initial_state) do
    {:ok, initial_state}
  end

  # Public API
  def draw_card(player_id) do
    GenServer.cast(:game_server, {:draw_card, player_id})
  end

  def play_card(player_id, card) do
    GenServer.cast(:game_server, {:play_card, player_id, card})
  end

  def end_turn do
    GenServer.cast(:game_server, :end_turn)
  end

  def get_game_state do
    GenServer.call(:game_server, :get_game_state)
  end

  # Callbacks

  def handle_cast({:draw_card, player_id}, state) do
    updated_players = Actions.draw_card(state.players, player_id)
    {:noreply, %{state | players: updated_players}}
  end

  def handle_cast({:play_card, player_id, card}, state) do
    updated_players = Actions.play_card(state.players, player_id, card)
    {:noreply, %{state | players: updated_players}}
  end

  def handle_cast(:end_turn, state) do
    updated_turn = TurnManager.next_turn(state.players, state.turn)
    {:noreply, %{state | turn: updated_turn}}
  end

  def handle_call(:get_game_state, _from, state) do
    {:reply, state, state}
  end
end
