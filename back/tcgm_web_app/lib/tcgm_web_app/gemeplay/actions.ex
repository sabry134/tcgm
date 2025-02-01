defmodule TcgWebApp.Gameplay.Actions do
  alias TcgWebApp.Gameplay.Player

  # Draw a card for a specific player
  def draw_card(players, player_id) do
    Enum.map(players, fn player ->
      if player.id == player_id do
        draw_from_deck(player)
      else
        player
      end
    end)
  end

  def play_card(players, player_id, card) do
    Enum.map(players, fn player ->
      if player.id == player_id do
        play_card_to_field(player, card)
      else
        player
      end
    end)
  end

  defp draw_from_deck(%Player{deck: [card | rest_deck], hand: hand} = player) do
    %{player | deck: rest_deck, hand: [card | hand]}
  end

  defp draw_from_deck(player), do: player # No cards left to draw

  defp play_card_to_field(%Player{hand: hand, field: field} = player, card) do
    new_hand = List.delete(hand, card)
    %{player | hand: new_hand, field: [card | field]}
  end
end
