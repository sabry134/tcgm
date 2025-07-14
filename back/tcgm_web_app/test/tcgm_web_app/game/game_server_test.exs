defmodule TcgmWebApp.Game.GameServerTest do
  use TcgmWebAppWeb.ConnCase
  use ExUnit.Case, async: false

  alias TcgmWebApp.Game.GameServer
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Boards.Board
  alias TcgmWebApp.BoardZones.BoardZone
  alias TcgmWebApp.GameRules.GameRule
  alias TcgmWebApp.PlayerProperties.PlayerProperty
  alias TcgmWebApp.CardCollections.CardCollection
  alias TcgmWebApp.CardCollectionCards.CardCollectionCard
  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.Repo

  setup do
    room_id = "test_room"

    user = %User{}
    |> User.changeset(%{ username: "test_user", email: "test@test.com", password: "password" })
    |> Repo.insert!()

    user2 = %User{}
    |> User.changeset(%{ username: "test_user2", email: "test2@test.com", password: "password" })
    |> Repo.insert!()

    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    board = %Board{}
    |> Board.changeset(%{ background_image: "test", game_id: game.id })
    |> Repo.insert!()

    hand = %BoardZone{}
    |> BoardZone.changeset(%{ name: "hand", width: 100, height: 100, x: 0, y: 0, border_radius: 10, background_image: "hand.png", board_id: board.id })
    |> Repo.insert!()

    field = %BoardZone{}
    |> BoardZone.changeset(%{ name: "field", width: 200, height: 200, x: 100, y: 100, border_radius: 20, background_image: "field.png", board_id: board.id })
    |> Repo.insert!()

    deck = %BoardZone{}
    |> BoardZone.changeset(%{ name: "deck", width: 150, height: 150, x: 200, y: 200, border_radius: 15, background_image: "deck.png", board_id: board.id })
    |> Repo.insert!()

    discard = %BoardZone{}
    |> BoardZone.changeset(%{ name: "discard", width: 120, height: 120, x: 300, y: 300, border_radius: 12, background_image: "discard.png", board_id: board.id })
    |> Repo.insert!()

    caster = %BoardZone{}
    |> BoardZone.changeset(%{ name: "caster", width: 180, height: 180, x: 400, y: 400, border_radius: 18, background_image: "caster.png", board_id: board.id })
    |> Repo.insert!()

    game_rules = %GameRule{}
    |> GameRule.changeset(%{
      game_id: game.id,
      starting_hand_size: 1,
      min_deck_size: 1,
      max_deck_size: 10,
      max_hand_size: 7,
      draw_per_turn: 1
    })
    |> Repo.insert!()

    player_properties = %PlayerProperty{}
    |> PlayerProperty.changeset(%{
      property_name: "health",
      value: 20,
      game_rule_id: game_rules.id
    })
    |> Repo.insert!()

    action = %Action{}
    |> Action.changeset(%{ name: "Test action", description: "Test description", game_id: game.id })
    |> Repo.insert!()

    effect = %Effect{}
    |> Effect.changeset(%{ description: "Test description", action_ids: [action.id], game_id: game.id })
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
    |> Repo.insert!()

    cardType2 = %CardType{}
    |> CardType.changeset(%{ name: "caster", game_id: game.id })
    |> Repo.insert!()

    card = %Card{}
    |> Card.changeset(%{ name: "Test card", text: "Test text", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card2 = %Card{}
    |> Card.changeset(%{ name: "Test card 2", text: "Test text 2", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card3 = %Card{}
    |> Card.changeset(%{ name: "Test card 3", text: "Test text 3", image: "image", game_id: game.id, card_type_id: cardType2.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card_collection = %CardCollection{}
    |> CardCollection.changeset(%{ name: "test", quantity: 10, game_id: game.id, user_id: user.id, type: "deck", public_template: true })
    |> Repo.insert!()

    card_collection_card = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card.id, quantity: 5, group: "deck" })
    |> Repo.insert!()

    card_collection_card2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card2.id, quantity: 5, group: "deck" })
    |> Repo.insert!()

    card_collection_card3 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card3.id, quantity: 1, group: "caster" })
    |> Repo.insert!()

    card_collection_p2 = %CardCollection{}
    |> CardCollection.changeset(%{ name: "testp2", quantity: 10, game_id: game.id, user_id: user2.id, type: "deck", public_template: true })
    |> Repo.insert!()

    card_collection_card_p2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection_p2.id, card_id: card.id, quantity: 5, group: "deck" })
    |> Repo.insert!()

    card_collection_card2_p2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection_p2.id, card_id: card2.id, quantity: 5, group: "deck" })
    |> Repo.insert!()

    card_collection_card3_p2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection_p2.id, card_id: card3.id, quantity: 1, group: "caster" })
    |> Repo.insert!()

    {:ok, _pid} = GameServer.start_link(room_id)
    {:ok, room_id: room_id, game: game, user: user, user2: user2}
  end

  test "players can join a room", %{room_id: room_id, game: game, user: user} do
    {:ok, state} = GameServer.join_room(room_id, user.username, game.id)

    #state = GameServer.get_state(room_id)
    assert Map.has_key?(state.players, user.username)
    assert state.players[user.username]["hand"] == []
    assert state.players[user.username]["field"] == []
    assert state.players[user.username]["deck"] == []
    assert state.players[user.username]["discard"] == []
    assert state.players[user.username]["caster"] == []
  end

  test "card can be inserted to location", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    initial_state = GameServer.get_state(room_id)
    assert length(initial_state.players[user.username]["hand"]) == 0

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    :ok = GameServer.insert_card(room_id, user.username, card, "hand")

    updated_state = GameServer.get_state(room_id)
    assert length(updated_state.players[user.username]["hand"]) == 1
  end

  test "players can play a card", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players[user.username]["field"]) == 0

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    :ok = GameServer.insert_card(room_id, user.username, card, "hand")
    :ok = GameServer.play_card(room_id, user.username, card)

    updated_state = GameServer.get_state(room_id)

    assert length(updated_state.players[user.username]["field"]) == 1
    assert Enum.any?(updated_state.players[user.username]["field"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "players can set their deck", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players[user.username]["deck"]) == 0

    card = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    :ok = GameServer.set_deck(room_id, user.username, card)

    updated_state = GameServer.get_state(room_id)
    assert length(updated_state.players[user.username]["deck"]) == 1
    assert Enum.any?(updated_state.players[user.username]["deck"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "players can draw a card", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    card = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    :ok = GameServer.set_deck(room_id, user.username, card)

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players[user.username]["hand"]) == 0

    :ok = GameServer.draw_card(room_id, user.username)

    updated_state = GameServer.get_state(room_id)

    assert length(updated_state.players[user.username]["hand"]) == 1
    assert Enum.any?(updated_state.players[user.username]["hand"], fn card -> Map.has_key?(card, "Card X") end) == true

    assert length(updated_state.players[user.username]["deck"]) == 0
  end

  test "players can move a card", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    tmp_card = %{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}

    deck = [tmp_card]
    source = "hand"
    dest = "field"

    :ok = GameServer.set_deck(room_id, user.username, deck)

    initial_state = GameServer.get_state(room_id)

    assert length(initial_state.players[user.username][dest]) == 0

    :ok = GameServer.draw_card(room_id, user.username)
    :ok = GameServer.move_card(room_id, user.username, source, dest, tmp_card)
    updated_state = GameServer.get_state(room_id)

    assert length(updated_state.players[user.username][dest]) == 1
    assert Enum.any?(updated_state.players[user.username][dest], fn card -> Map.has_key?(card, "Card Y") end) == true

    assert length(updated_state.players[user.username][source]) == 0
  end

  test "players can update a card", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    card = [%{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}]
    location = "hand"

    :ok = GameServer.set_deck(room_id, user.username, card)

    :ok = GameServer.draw_card(room_id, user.username)
    draw_state = GameServer.get_state(room_id)
    c = Enum.find(draw_state.players[user.username][location], fn c -> Map.has_key?(c, "Card Y") end)
    assert c["Card Y"]["properties"]["attack"] == 9
    :ok = GameServer.update_card(room_id, user.username, location, "Card Y", "attack", 20)
    updated_state = GameServer.get_state(room_id)

    c = Enum.find(updated_state.players[user.username][location], fn c -> Map.has_key?(c, "Card Y") end)
    assert c["Card Y"]["properties"]["attack"] == 20
  end

  test "set_turn set the turn state", %{room_id: room_id, game: game, user: user, user2: user2} do
    GameServer.join_room(room_id, user.username, game.id)
    player = user2.username

    :ok = GameServer.set_turn(room_id, player)

    updated_state = GameServer.get_state(room_id)
    assert updated_state.turn == user2.username
  end

  test "pass_turn pass the turn to another player", %{room_id: room_id, game: game, user: user, user2: user2} do
    GameServer.join_room(room_id, user.username, game.id)

    player = user2.username

    :ok = GameServer.set_turn(room_id, user.username)
    :ok = GameServer.pass_turn(room_id, player)

    updated_state = GameServer.get_state(room_id)

    assert updated_state.turn == user2.username
    assert updated_state.turnCount == 1
  end

  test "game start", %{room_id: room_id, game: game, user: user, user2: user2} do
    GameServer.join_room(room_id, user.username, game.id)
    GameServer.join_room(room_id, user2.username, game.id)

    :ok = GameServer.start_game(room_id, game.id)

    state = GameServer.get_state(room_id)

    assert length(state.players[user.username]["deck"]) == 9
    assert length(state.players[user2.username]["deck"]) == 9
    assert length(state.players[user.username]["hand"]) == 1
    assert length(state.players[user2.username]["hand"]) == 1
    assert length(state.players[user.username]["field"]) == 0
    assert length(state.players[user2.username]["field"]) == 0
    assert length(state.players[user.username]["discard"]) == 0
    assert length(state.players[user2.username]["discard"]) == 0
    assert length(state.players[user.username]["caster"]) == 1
    assert length(state.players[user2.username]["caster"]) == 1
  end

  test "shuffle card in deck location", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    initial_state = GameServer.get_state(room_id)
    assert length(initial_state.players[user.username]["deck"]) == 0

    card1 = %{"Card A" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card B" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    :ok = GameServer.insert_card(room_id, user.username, card1, "deck")
    :ok = GameServer.insert_card(room_id, user.username, card2, "deck")
    :ok = GameServer.insert_card(room_id, user.username, card3, "deck")
    :ok = GameServer.insert_card(room_id, user.username, card4, "deck")

    updated_state = GameServer.get_state(room_id)
    new_deck = updated_state.players[user.username]["deck"]
    changed =
      Enum.any?(1..10, fn _ ->
        :ok = GameServer.shuffle_card(room_id, user.username, "deck")
        shuffled_state = GameServer.get_state(room_id)
        shuffled_deck = shuffled_state.players[user.username]["deck"]
        shuffled_deck != new_deck
      end)

    assert changed
  end

  test "shuffle card in field location", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    initial_state = GameServer.get_state(room_id)
    assert length(initial_state.players[user.username]["field"]) == 0

    card1 = %{"Card A" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card B" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    :ok = GameServer.insert_card(room_id, user.username, card3, "field")
    :ok = GameServer.insert_card(room_id, user.username, card2, "field")
    :ok = GameServer.insert_card(room_id, user.username, card1, "field")
    :ok = GameServer.insert_card(room_id, user.username, card4, "field")

    updated_state = GameServer.get_state(room_id)
    new_field = updated_state.players[user.username]["field"]
    changed =
      Enum.any?(1..10, fn _ ->
        :ok = GameServer.shuffle_card(room_id, user.username, "field")
        shuffled_state = GameServer.get_state(room_id)
        shuffled_field = shuffled_state.players[user.username]["field"]
        shuffled_field != new_field
      end)

    assert changed
  end

  test "send chat message", %{room_id: room_id, game: game, user: user, user2: user2} do
    GameServer.join_room(room_id, user.username, game.id)
    GameServer.join_room(room_id, user2.username, game.id)

    initial_state = GameServer.get_state(room_id)
    assert length(initial_state.chat) == 0

    :ok = GameServer.add_chat_message(room_id, user.username, "Hello, world!")
    :ok = GameServer.add_chat_message(room_id, user2.username, "Hi there!")

    new_state = GameServer.get_state(room_id)
    assert length(new_state.chat) == 2
    assert Enum.any?(new_state.chat, fn msg -> msg[:player_id] == user.username and msg[:message] == "Hello, world!" and Map.has_key?(msg, :timestamp) end)
    assert Enum.any?(new_state.chat, fn msg -> msg[:player_id] == user2.username and msg[:message] == "Hi there!" and Map.has_key?(msg, :timestamp) end)

    chat = GameServer.get_chat(room_id)

    assert length(chat) == 2
    assert Enum.any?(chat, fn msg -> msg[:player_id] == user.username and msg[:message] == "Hello, world!" and Map.has_key?(msg, :timestamp) end)
    assert Enum.any?(chat, fn msg -> msg[:player_id] == user2.username and msg[:message] == "Hi there!" and Map.has_key?(msg, :timestamp) end)
  end
end
