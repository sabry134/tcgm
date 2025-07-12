defmodule TcgmWebApp.Game.GameConfig do

  alias TcgmWebApp.CardCollections.CardCollections
  alias TcgmWebApp.CardCollectionCards.CardCollectionCards
  alias TcgmWebApp.Cards.Cards
  alias TcgmWebApp.Accounts

  defp get_deck_cards(deck_id) do
    case CardCollectionCards.get_card_collection_cards_by_card_collection_id(deck_id) do
      nil -> []
      cards -> Enum.map(cards, fn card -> {card.card_id, card.quantity, card.group} end)
    end
  end

  defp load_deck(state, player_id, active_deck) do
    cards = get_deck_cards(active_deck.id)

    Enum.reduce(cards, state, fn {card_id, quantity, group}, acc_state ->
      case Cards.get_card(card_id) do
        nil ->
          acc_state
        card ->
          updated_group =
            acc_state.players[player_id][group] ++
            Enum.map(1..quantity, fn _ -> card end)

          put_in(acc_state, [:players, player_id, group], updated_group)
      end
    end)
  end

  def load_deck_config(state, game_id, player_id) do
    case Accounts.get_user_by_username(player_id) do
      nil -> state
      user ->
        case CardCollections.get_card_collections_by_user_id_and_game_id_and_type(user.id, game_id, "deck") do
          nil -> state
          [] -> state # Handle empty list case
          [active_deck | _rest] -> # Pattern match to get the first element
            load_deck(state, player_id, active_deck)
        end
    end
  end

end
