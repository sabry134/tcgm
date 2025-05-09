defmodule TcgmWebApp.Game.GameConfig do

  defp load_json_deck(game_id, player_id) do
    config_path = "assets/game_config/#{game_id}_#{player_id}.json"

    case File.read(config_path) do
      {:ok, content} ->
        case Jason.decode(content) do
          {:ok, config} -> {:ok, config}
          {:error, reason} -> {:error, {:invalid_json, reason}}
        end

      {:error, reason} -> {:error, {:file_not_found, reason}}
    end
  end

  defp load_json_card() do
    config_path = "assets/game_config/cards.json"

    case File.read(config_path) do
      {:ok, content} ->
        case Jason.decode(content) do
          {:ok, config} -> {:ok, config}
          {:error, reason} -> {:error, {:invalid_json, reason}}
        end
      {:error, reason} -> {:error, {:file_not_found, reason}}
    end
  end

  defp casters(state, player_id, active_deck) do
    cards = active_deck["casters"]
    {:ok, card_list} = load_json_card()
    Enum.reduce(cards, state, fn {card_name, active}, acc_state ->
      case Map.has_key?(card_list["cards"], card_name) do
        false -> acc_state
        true ->
          card = %{card_name => card_list["cards"][card_name]}
          c =
            if active == true do
              %{"active" => card}
            else
              %{"inactive" => card}
            end
          put_in(acc_state, [:players, player_id, "caster"], acc_state.players[player_id]["caster"] ++ [c])
      end
    end)
  end

  defp decks(state, player_id, active_deck) do
    cards = active_deck["cards"]
    {:ok, card_list} = load_json_card()
    Enum.reduce(cards, state, fn {card_name, quantity}, acc_state ->
      Enum.reduce(1..quantity, acc_state, fn i, inner_state ->
        key =
          if i > 1 do
            "#{card_name} ##{i}"
          else
            card_name
        end
        card = inner_state.players[player_id]["deck"] ++ [%{key => card_list["cards"][card_name]}]
        put_in(inner_state, [:players, player_id, "deck"], card)
      end)
    end)
  end

  defp load_deck(state, player_id, active_deck) do
    updated_state = decks(state, player_id, active_deck)
    casters(updated_state, player_id, active_deck)
  end

  def load_deck_config(state, game_id, player_id) do
    case load_json_deck(game_id, player_id) do
      {:ok, config} ->
        active_deck =
          Enum.find(config, fn config ->
            config["active"] == true and config["type"] == "deck"
          end)
        load_deck(state, player_id, active_deck)
    end
  end

end
