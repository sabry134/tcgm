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

  def load_json_card() do
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

  def load_deck(state, player_id, active_deck) do
    cards = active_deck["cards"]
    {:ok, card_list} = load_json_card()
    updated_state =
      Enum.reduce(cards, state, fn {card_name, quantity}, acc_state ->
        put_in(acc_state, [:players, player_id, "deck", card_name], card_list["cards"][card_name])
      end)
  end

  def load_deck_config(state, game_id, player_id) do
    case load_json_deck(game_id, player_id) do
      {:ok, config} ->
        active_deck =
          Enum.find(config, fn config ->
            config["active"] == true and config["type"] == "deck"
          end)
        new_state = load_deck(state, player_id, active_deck)
    end
  end

end
