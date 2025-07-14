defmodule TcgmWebApp.Game.GameServer do
  use GenServer

  alias TcgmWebApp.Game.GameLogic
  alias TcgmWebApp.Game.GameConfig

  alias TcgmWebApp.CardCollectionCards.CardCollectionCards
  alias TcgmWebApp.CardTypeProperties.CardTypeProperties
  alias TcgmWebApp.CardProperties.CardProperties
  alias TcgmWebApp.Cards.Cards
  alias TcgmWebApp.BoardZones.BoardZones
  alias TcgmWebApp.Boards.Boards
  alias TcgmWebApp.GameRules.GameRules
  alias TcgmWebApp.PlayerProperties.PlayerProperties

  @moduledoc """
    This module is responsible for handling game servers.
  """

  @doc """
    Starts a game server with the given room id.
  """
  def start_link(room_id) do
    GenServer.start_link(__MODULE__, room_id, name: via_tuple(room_id))
  end

  def via_tuple(room_id), do: {:via, Registry, {TcgmWebApp.RoomRegistry, room_id, nil}}

  def init(room_id) do
    state = %{
      id: room_id,
      players: %{},
      turn: "",
      turnCount: 0,
      phase: :waiting,
      chat: [],
    }
    {:ok, state}
  end

  # Public API functions

  def get_state(room_id) do
    GenServer.call(via_tuple(room_id), :get_state)
  end

  def join_room(room_id, player_id, game_id) do
    GenServer.call(via_tuple(room_id), {:join, player_id, game_id})
  end

  def set_deck(room_id, player_id, deck) do
    GenServer.cast(via_tuple(room_id), {:set_deck, player_id, deck})
  end

  def set_deck_by_id(room_id, player_id, deck_id) do
    GenServer.cast(via_tuple(room_id), {:set_deck_by_id, player_id, deck_id})
  end

  def play_card(room_id, player_id, card) do
    GenServer.cast(via_tuple(room_id), {:play_card, player_id, card})
  end

  def draw_card(room_id, player_id) do
    GenServer.cast(via_tuple(room_id), {:draw_card, player_id})
  end

  def insert_card(room_id, player_id, card, location) do
    GenServer.cast(via_tuple(room_id), {:insert_card, player_id, card, location})
  end

  def move_card(room_id, player_id, source, dest, card) do
    GenServer.cast(via_tuple(room_id), {:move_card, player_id, source, dest, card})
  end

  def update_card(room_id, player_id, location, card, key, value) do
    GenServer.cast(via_tuple(room_id), {:update_card, player_id, location, card, key, value})
  end

  def start_game(room_id, game_id) do
    GenServer.cast(via_tuple(room_id), {:start_game, game_id})
  end

  def set_turn(room_id, player_id) do
    GenServer.cast(via_tuple(room_id), {:set_turn, player_id})
  end

  def pass_turn(room_id, player_id) do
    GenServer.cast(via_tuple(room_id), {:pass_turn, player_id})
  end

  def shuffle_card(room_id, player_id, location) do
    GenServer.cast(via_tuple(room_id), {:shuffle_card, player_id, location})
  end

  # server chat functions

  def get_chat(room_id) do
    GenServer.call(via_tuple(room_id), :get_chat)
  end

  def add_chat_message(room_id, player_id, message) do
    GenServer.cast(via_tuple(room_id), {:add_chat_message, player_id, message})
  end

  # Server interaction functions

  def leave_room(room_id, player_id) do
    GenServer.call(via_tuple(room_id), {:leave, player_id})
  end

  defp create_player(game_id, player_properties) do
    board = Boards.get_board_by_game_id(game_id)
    zones = BoardZones.get_board_zones_by_board_id(board.id)
    containers = Enum.reduce(zones, %{}, fn zone, acc ->
      Map.put(acc, zone.name, [])
    end)

    Map.merge(containers, player_properties)
  end

  # GenServer callbacks

  @doc """
    Handles game server calls.

    ## Variants:
    - `:get_state` - Retrieves the game state.
    - `{:join, player_id}` - Has player with player_id join the game.
  """
  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:join, player_id, game_id}, _from, state) do
    case GameRules.get_game_rule_by_game_id(game_id) do
      nil ->
        {:reply, {:error, :game_not_found}, state}

      game_rules ->
        player_properties = PlayerProperties.get_player_properties_by_game_rule_id(game_rules.id)
        player_data = Enum.reduce(player_properties, %{"id" => player_id}, fn property, acc ->
          Map.put(acc, property.property_name, property.value)
        end)
        player_data = create_player(game_id, player_data)
        new_players = Map.put(state.players, player_id, player_data)
        new_state = %{state | players: new_players, turn: player_id}

        {:reply, {:ok, new_state}, new_state}
    end
  end

  def handle_call(:get_chat, _from, state) do
    {:reply, state.chat, state}
  end

  def handle_call({:leave, player_id}, _from, state) do
    if Map.has_key?(state.players, player_id) do
      new_players = Map.delete(state.players, player_id)
      new_state = %{state | players: new_players}
      {:reply, :ok, new_state}
    else
      {:reply, {:error, :not_found}, state}
    end
  end

  @doc """
    Handles game server casts.

    ## Variants:
    - `{:set_deck, player_id, deck}` - Sets the deck of the player with player_id.
    - `{:play_card, player_id, card}` - Plays the card for the player with player_id.
    - `{:draw_card, player_id}` - Draws a card for the player with player_id.
    - `{:insert_card, player_id, card, location}` - Inserts the card for the player with player_id.
    - `{:start_game}` - Starts the game with initial game state.
  """
  def setCardProperty(card_type_property, property) do
    property_value =
      case card_type_property.type do
        "text" -> property.value_string
        "number" -> property.value_number
        "boolean" -> property.value_boolean
        _ -> nil
      end
    property_value
  end

  def handle_cast({:set_deck, player_id, deck}, state) do

    new_state = %{state | players: Map.update!(state.players, player_id, fn player -> %{player | "deck" => deck} end)}
    {:noreply, new_state}
  end

  def handle_cast({:add_chat_message, player_id, message}, state) do
    timestamp = DateTime.utc_now() |> DateTime.to_iso8601()
    message = %{timestamp: timestamp, player_id: player_id, message: message}
    new_chat = [message | state.chat]
    new_state = %{state | chat: new_chat}
    {:noreply, new_state}
  end

  def handle_cast({:set_deck_by_id, player_id, deck_id}, state) do
    card_collection_cards = CardCollectionCards.get_card_collection_cards_by_card_collection_id(deck_id)
    grouped_cards = Enum.group_by(card_collection_cards, & &1.group, fn card ->
      %{
        id: card.card_id,
        quantity: card.quantity
      }
    end)

    enriched_groups = Enum.map(grouped_cards, fn {group, cards} ->
      enriched_cards = Enum.map(cards, fn card ->
        base_card = Cards.get_card!(card.id)
        card_properties = CardProperties.get_card_properties_by_card_id(card.id)

        enriched_properties = Enum.reduce(card_properties, %{}, fn property, prop_acc ->
          card_type_property = CardTypeProperties.get_card_type_property(property.cardtype_property_id)
          Map.put(prop_acc, card_type_property.property_name, setCardProperty(card_type_property, property))
        end)

        enriched_card = %{
          "name" => base_card.name,
          "text" => base_card.text,
          "image" => base_card.image,
          "properties" => enriched_properties
        }
        c = %{"#{card.id}" => enriched_card}
        c
      end)

      {group, enriched_cards}
    end)

    new_state = Enum.reduce(enriched_groups, state, fn {group, cards}, acc_state ->
      update_in(acc_state, [:players, player_id, group], fn _existing_cards ->
        cards
      end)
    end)

    {:noreply, new_state}
  end

  def handle_cast({:play_card, player_id, card}, state) do
    new_state = GameLogic.play_card_logic(state, player_id, %{"card" => card})
    {:noreply, new_state}
  end

  def handle_cast({:draw_card, player_id}, state) do
    new_state = GameLogic.draw_card(state, player_id, %{"amount" => 1})
    {:noreply, new_state}
  end

  def handle_cast({:insert_card, player_id, card, location}, state) do
    new_state = GameLogic.insert_card(state, player_id, %{"card" => card, "location" => location})
    {:noreply, new_state}
  end

  def handle_cast({:move_card, player_id, source, dest, card}, state) do
    new_state = GameLogic.move_card_logic(state, player_id, %{"source" => source, "dest" => dest, "card" => card})
    {:noreply, new_state}
  end

  def handle_cast({:update_card, player_id, location, card, key, value}, state) do
    new_state = GameLogic.update_values_logic(state, player_id, %{"location" => location, "card" => card, "key" => key, "value" => value})
    {:noreply, new_state}
  end

  def handle_cast({:set_turn, player_id}, state) do
    new_state = GameLogic.set_turn(state, player_id, %{})
    {:noreply, new_state}
  end

  def handle_cast({:pass_turn, player_id}, state) do
    new_state = GameLogic.pass_turn_logic(state, player_id, %{})
    {:noreply, new_state}
  end

  def handle_cast({:shuffle_card, player_id, location}, state) do
    new_state = GameLogic.shuffle_card_location(state, player_id, %{"location" => location})
    {:noreply, new_state}
  end

  def handle_cast({:start_game, game_id}, state) do
    case GameRules.get_game_rule_by_game_id(game_id) do
      nil ->
        {:noreply, state}

      game_rules ->
        new_state = Enum.reduce(state.players, state, fn {player_id, _player_data}, acc_state ->
          update_state = GameConfig.load_deck_config(acc_state, game_id, player_id)
          GameLogic.draw_card(update_state, player_id, %{"amount" => game_rules.starting_hand_size})
        end)

        {:noreply, new_state}
    end
  end

end
