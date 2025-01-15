defmodule TcgmWebApp.Gameplay do
  use GenServer

  # Player struct
  defmodule Player do
    defstruct [:id, :hand, :deck, :field, :graveyard, :caster_zones]
  end

  # Gamestate struct used to hold overall gamestate data
  defstruct [:players, :turn, :game_over]

  # Public API to start GenServer
  def start_link(initial_state) do
    GenServer.start_link(__MODULE__, initial_state, name: :game_server)
  end

  # Gamestate initialization
  def init(initial_state) do
    {:ok, initial_state}
  end

  # Here are some example functions to interact in game, this will be switched to real functions later

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

  # GenServer callback functions to handle game logic

  def handle_cast({:draw_card, player_id}, state) do
    player = find_player(state.players, player_id)
    new_player = draw_card_logic(player)
    updated_state = update_player(state, player_id, new_player)
    {:noreply, updated_state}
  end

  def handle_cast({:play_card, player_id, card}, state) do
    player = find_player(state.players, player_id)
    new_player = play_card_logic(player, card)
    updated_state = update_player(state, player_id, new_player)
    {:noreply, updated_state}
  end

  def handle_cast(:end_turn, state) do
    next_turn = get_next_turn(state.players, state.turn)
    updated_state = %{state | turn: next_turn}
    {:noreply, updated_state}
  end

  def handle_call(:get_game_state, _from, state) do
    {:reply, state, state}
  end

  # Helper functions

  defp find_player(players, player_id) do
    Enum.find(players, fn player -> player.id == player_id end)
  end

  defp update_player(state, player_id, new_player) do
    players = Enum.map(state.players, fn player ->
      if player.id == player_id do
        new_player
      else
        player
      end
    end)

    %{state | players: players}
  end

  defp draw_card_logic(player) do
    [card | rest_deck] = player.deck
    new_hand = [card | player.hand]
    %{player | deck: rest_deck, hand: new_hand}
  end

  defp play_card_logic(player, card) do
    new_hand = List.delete(player.hand, card)
    new_field = [card | player.field]
    %{player | hand: new_hand, field: new_field}
  end

  defp get_next_turn(players, current_turn) do
    current_index = Enum.find_index(players, fn player -> player.id == current_turn end)
    next_index = rem(current_index + 1, length(players))
    Enum.at(players, next_index).id
  end

end
