defmodule TcgmWebApp.Game.GameLogic do
  def draw_card(state, player_id) do
    cond do
      Map.has_key?(state.players, player_id) == false ->
        {:error, "Le player n'existe pas"}
      map_size(state.players[player_id]["deck"]) <= 0 ->
        {:error, "Le deck est vide"}
      true ->
        [card | deck] = Map.to_list(state.players[player_id]["deck"])
        drawn_card = Map.new([card])
        new_deck = Enum.into(deck, %{})
        new_hand = Map.merge(state.players[player_id]["hand"], drawn_card)

        updated_state =
          state
          |> put_in([:players, player_id, "deck"], new_deck)
          |> put_in([:players, player_id, "hand"], new_hand)

          updated_state
    end
  end

  def play_card_logic(state, player_id, card) do
    [card_id | _rest] = Map.keys(card)
    cond do
      Map.has_key?(state.players, player_id) == false ->
        {:error, "Le player n'existe pas"}
      map_size(state.players[player_id]["hand"]) <= 0 ->
        {:error, "Le deck est vide"}
      Map.has_key?(state.players[player_id]["hand"], card_id) == false ->
        {:error, "la carte n'existe pas"}
      true ->
        new_hand = Map.delete(state.players[player_id]["hand"], card_id)
        new_field = Map.merge(state.players[player_id]["field"], card)

        updated_state =
          state
          |> put_in([:players, player_id, "hand"], new_hand)
          |> put_in([:players, player_id, "field"], new_field)

        updated_state
    end
  end

  def move_card_logic(state, player_id, source, dest, card) do
    [card_id | _rest] = Map.keys(card)
    cond do
      Map.has_key?(state.players, player_id) == false ->
        {:error, "Le player n'existe pas"}
      Map.has_key?(state.players[player_id], source) == false ->
        {:error, "la source n'existe pas"}
      map_size(state.players[player_id][source]) <= 0 ->
          {:error, "La source est vide"}
      Map.has_key?(state.players[player_id][source], card_id) == false ->
        {:error, "la carte n'existe pas"}
      Map.has_key?(state.players[player_id], dest) == false ->
        {:error, "la destination n'existe pas"}
      true ->
        new_source = Map.delete(state.players[player_id][source], card_id)
        new_dest = Map.merge(state.players[player_id][dest], card)

        updated_state =
          state
          |> put_in([:players, player_id, source], new_source)
          |> put_in([:players, player_id, dest], new_dest)

        updated_state
    end
  end

  def insert_card(state, player_id, location, card) do
    [card_id | _rest] = Map.keys(card)
    cond do
      Map.has_key?(state.players, player_id) == false ->
        {:error, "Le player n'existe pas"}
      Map.has_key?(state.players[player_id], location) == false ->
        {:error, "la destination n'existe pas"}
      Map.has_key?(state.players[player_id][location], card_id) == true ->
        {:error, "la carte existe deja"}
      true ->
        put_in(state, [:players, player_id, location, card_id], card[card_id])
    end
  end

  def update_card_values(key, value, card) do
    update_in(card, ["properties", key], fn _ -> value end)
  end

  def update_values_logic(state, player_id, location, key, value, card) do
    cond do
      Map.has_key?(state.players, player_id) == false ->
        {:error, "Le player n'existe pas"}
      Map.has_key?(state.players[player_id], location) == false ->
        {:error, "la location n'existe pas"}
      Map.has_key?(state.players[player_id][location], card) == false ->
        {:error, "la carte n'existe pas"}
      Map.has_key?(state.players[player_id][location][card]["properties"], key) == false ->
        {:error, "la propriete n'existe pas"}
      true ->
        new_card = update_card_values(key, value, state.players[player_id][location][card])

        update_state =
          state
          |> put_in([:players, player_id, location, card], new_card)

        update_state
    end
  end
end
