defmodule TcgmWebApp.Game.GameLogic do

  @moduledoc """
    This module is responsible for handling game logic.
  """

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

  @doc """
    Adds the top card of the player's deck to their hand.
    The required args are:
    - amount: the amount of cards to draw.
  """
  def draw_card(state, player_id, args) do
    case check_valid_params(args, ["amount"], state.players, player_id, ["deck", "hand"]) do
      {:error, message} ->
        {:error, message}
      :ok ->
        cond do
          length(state.players[player_id]["deck"]) <= 0 ->
            {:error, "Le deck est vide"}
          true ->
            amount = Map.get(args, "amount", 1)
            {drawn_cards, new_deck} = Enum.split(state.players[player_id]["deck"], amount)
            new_hand = state.players[player_id]["hand"] ++ drawn_cards

            updated_state =
              state
              |> put_in([:players, player_id, "deck"], new_deck)
              |> put_in([:players, player_id, "hand"], new_hand)

            updated_state
        end
    end
  end

  @doc """
    Plays a card from the player's hand to the field.
    The required args are:
    - card: the card to play.
  """
  def play_card_logic(state, player_id, card) do
    expected_args = ["card"]
    case check_valid_params(card, expected_args, state.players, player_id, ["hand", "field"]) do
      {:error, message} -> {:error, message}
      :ok ->
        card = Map.get(card, "card")
        [card_id | _rest] = Map.keys(card)
        cond do
          length(state.players[player_id]["hand"]) <= 0 ->
            {:error, "La main est vide"}
          Enum.any?(state.players[player_id]["hand"], fn card -> Map.has_key?(card, card_id) end) == false ->
            {:error, "la carte n'existe pas"}
          true ->
            new_hand = Enum.reject(state.players[player_id]["hand"], fn card -> Map.has_key?(card, card_id) end)
            new_field = state.players[player_id]["field"] ++ [card]

            updated_state =
              state
              |> put_in([:players, player_id, "hand"], new_hand)
              |> put_in([:players, player_id, "field"], new_field)

            updated_state
        end
    end
  end

  @doc """
    Moves a card from one location to another.
    The required args are:
    - source: the source location.
    - dest: the destination location.
    - card: the card to move.
  """
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
          length(state.players[player_id][source]) <= 0 ->
              {:error, "La source est vide"}
          Enum.any?(state.players[player_id][source], fn card -> Map.has_key?(card, card_id) end) == false ->
            {:error, "la carte n'existe pas"}
          Map.has_key?(state.players[player_id], dest) == false ->
            {:error, "la destination n'existe pas"}
          true ->
            new_source = Enum.reject(state.players[player_id][source], fn card -> Map.has_key?(card, card_id) end)
            new_dest = state.players[player_id][dest] ++ [card]

            updated_state =
              state
              |> put_in([:players, player_id, source], new_source)
              |> put_in([:players, player_id, dest], new_dest)

            updated_state
        end
    end
  end

  @doc """
    Inserts a card into a location.
    The required args are:
    - location: the location to insert the card.
    - card: the card to insert.
  """
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
          Enum.any?(state.players[player_id][location], fn card -> Map.has_key?(card, card_id) end) == true ->
            {:error, "la carte existe deja"}
          true ->
            put_in(state, [:players, player_id, location], state.players[player_id][location] ++ [card])
        end
      end
  end

  @doc false
  def update_card_values(location, key, value, card) do
    IO.inspect("bonjour")
    Enum.map(location, fn c ->
      if Map.has_key?(c, card) do
        card_data = c[card]
        updated_card_data = put_in(card_data["properties"][key], value)
        %{card => updated_card_data}
      else
        c
      end
    end)
  end

  @doc """
    Updates the values of a card.
    The required args are:
    - location: the location of the card.
    - card: the card to update.
    - key: the key of the property to update.
    - value: the new value of the property.
  """
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
        IO.inspect("test")
        IO.inspect(card)
        cond do
          Map.has_key?(state.players[player_id], location) == false ->
            {:error, "la location n'existe pas"}
          Enum.any?(state.players[player_id][location], fn c -> Map.has_key?(c, card) end) == false ->
            {:error, "la carte n'existe pas"}
          Enum.any?(state.players[player_id][location], fn c -> Map.has_key?(c[card]["properties"], key) end) == false ->
            {:error, "la propriete n'existe pas"}
          true ->
            new_card = update_card_values(state.players[player_id][location], key, value, card)

            update_state =
              state
              |> put_in([:players, player_id, location], new_card)

            update_state
        end
    end
  end

  def set_turn(state, player_id, _args) do
    update_state =
      state
      |> put_in([:turn], player_id)

    update_state
  end

  def pass_turn_logic(state, player_id, _args) do
    count = state.turnCount + 1

    update_state =
      state
      |> put_in([:turn], player_id)
      |> put_in([:turnCount], count)

    update_state
  end
end
