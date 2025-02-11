defmodule TcgmWebApp.Game.GameLogic do

  defp check_action_args(args, required_keys) do
    missing_keys = Enum.filter(required_keys, &(!Map.has_key?(args, &1)))

    if missing_keys != [] do
      {:error, "Missing required action arguments: #{Enum.join(missing_keys, ", ")}"}
    else
      :ok
    end
  end

  defp check_player_properties(players, player_id, required_keys) do
    case Map.has_key?(players, player_id) do
      false -> {:error, "Le player n'existe pas"}
      true -> player = players[player_id]

      missing_keys = Enum.filter(required_keys, &(!Map.has_key?(player, &1)))

      if missing_keys != [] do
        {:error, "Following player properties does not exist: #{Enum.join(missing_keys, ", ")}"}
      else
        :ok
      end
    end
  end

  defp check_valid_params(args, required_args, players, player_id, player_properties) do
    case check_action_args(args, required_args) do
      {:error, message} -> {:error, message}
      :ok -> case check_player_properties(players, player_id, player_properties) do
        {:error, message} -> {:error, message}
        :ok -> :ok
      end
    end
  end

  def draw_card(state, player_id, args) do
    case check_valid_params(args, ["amount"], state.players, player_id, ["deck", "hand"]) do
      {:error, message} ->
        {:error, message}
      :ok ->
        cond do
          map_size(state.players[player_id]["deck"]) <= 0 ->
            {:error, "Le deck est vide"}
          true ->
            amount = Map.get(args, "amount", 1)
            {drawn_cards, new_deck} = Enum.split(Map.to_list(state.players[player_id]["deck"]), amount)
            drawn_cards_map = Enum.into(drawn_cards, %{})
            new_deck_map = Enum.into(new_deck, %{})
            new_hand = Map.merge(state.players[player_id]["hand"], drawn_cards_map)

            updated_state =
              state
              |> put_in([:players, player_id, "deck"], new_deck_map)
              |> put_in([:players, player_id, "hand"], new_hand)

            updated_state
        end
    end
  end

  def play_card_logic(state, player_id, card) do
    expected_args = ["card"]
    case check_valid_params(card, expected_args, state.players, player_id, ["hand", "field"]) do
      {:error, message} -> {:error, message}
      :ok ->
        card = Map.get(card, "card")
        [card_id | _rest] = Map.keys(card)
        cond do
          map_size(state.players[player_id]["hand"]) <= 0 ->
            {:error, "La main est vide"}
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
  end

  def move_card_logic(state, player_id, args) do
    expected_args = ["source", "dest", "card"]
    case check_valid_params(args, expected_args, state.players, player_id, []) do
      {:error, message} ->
        {:error, message}
      :ok ->
        source = Map.get(args, "source")
        dest = Map.get(args, "dest")
        card = Map.get(args, "card")
        [card_id | _rest] = Map.keys(card)
        cond do
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
  end

  def insert_card(state, player_id, args) do
    expected_args = ["location", "card"]
    case check_valid_params(args, expected_args, state.players, player_id, []) do
      {:error, message} ->
        {:error, message}
      :ok ->
        card = Map.get(args, "card")
        location = Map.get(args, "location")
        [card_id | _rest] = Map.keys(card)
        cond do
          Map.has_key?(state.players[player_id], location) == false ->
            {:error, "la destination n'existe pas"}
          Map.has_key?(state.players[player_id][location], card_id) == true ->
            {:error, "la carte existe deja"}
          true ->
            put_in(state, [:players, player_id, location, card_id], card[card_id])
        end
      end
  end

  def update_card_values(key, value, card) do
    update_in(card, ["properties", key], fn _ -> value end)
  end

  def update_values_logic(state, player_id, args) do
    expected_args = ["location", "card", "key", "value"]
    case check_valid_params(args, expected_args, state.players, player_id, []) do
      {:error, message} ->
        {:error, message}
      :ok ->
        location = Map.get(args, "location")
        card = Map.get(args, "card")
        key = Map.get(args, "key")
        value = Map.get(args, "value")
        cond do
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
end
