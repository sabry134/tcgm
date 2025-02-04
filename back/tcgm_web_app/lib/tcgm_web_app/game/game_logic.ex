defmodule TcgmWebApp.Game.GameLogic do
  def draw_card(state, player_id) do
    [drawn_card | new_deck] = state.players[player_id].deck
    new_hand = [drawn_card | state.players[player_id].hand]

    updated_state =
      state
      |> put_in([:players, player_id, :deck], new_deck)
      |> put_in([:players, player_id, :hand], new_hand)

    updated_state
  end

  def play_card_logic(state, player_id, card) do
    new_hand = List.delete(state.players[player_id].hand, card)
    new_field = [card | state.players[player_id].field]

    updated_state =
      state
      |> put_in([:players, player_id, :hand], new_hand)
      |> put_in([:players, player_id, :field], new_field)

    updated_state
  end
end
