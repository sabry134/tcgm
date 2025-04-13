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

  def casters(state, player_id, active_deck) do
    cards = active_deck["casters"]
    {:ok, card_list} = load_json_card()
    Enum.reduce(cards, state, fn {card_name, active}, acc_state ->
      case Map.has_key?(card_list["cards"], card_name) do
        false -> state
        true ->
          card = %{card_name => card_list["cards"][card_name]}
          if active == true do
            #IO.inspect(card)
            put_in(acc_state, [:players, player_id, "caster", "active"], card)
          else
            #IO.inspect(card)
            put_in(acc_state, [:players, player_id, "caster", "inactive"], card)
          end
      end
    end)
  end

  def decks(state, player_id, active_deck) do
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
        put_in(inner_state, [:players, player_id, "deck", key], card_list["cards"][card_name])
      end)
    end)
  end

  def load_deck(state, player_id, active_deck) do
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
