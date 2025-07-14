defmodule TcgmWebAppWeb.RoomControllerTest do
  use TcgmWebAppWeb.ConnCase

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
    user = %User{}
    |> User.changeset(%{ username: "test_user", email: "test@test.com", password: "password" })
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

    room_id = UUID.uuid4()
    TcgmWebApp.Game.RoomSupervisor.start_room(room_id)
    TcgmWebApp.Game.GameServer.join_room(room_id, user.username, game.id)
    {:ok, room_id: room_id, game: game, user: user }
  end

  test "POST /api/rooms creates a room", %{conn: conn} do
    conn = post(conn, "/api/rooms")
    assert json_response(conn, 200)["room_id"]
  end

  test "GET /api/rooms/:room_id returns state", %{conn: conn} do
    conn = post(conn, "/api/rooms")
    %{"room_id" => room_id} = json_response(conn, 200)

    conn = get(conn, "/api/rooms/#{room_id}")
    assert json_response(conn, 200)["players"] == %{}
  end

  test "POST /api/rooms/:room_id/join adds a player to the room", %{conn: conn, game: game, user: user} do
    conn = post(conn, "/api/rooms")
    %{"room_id" => room_id} = json_response(conn, 200)

    conn = post(conn, "/api/rooms/#{room_id}/join", player_id: user.username, game_id: game.id)
    assert json_response(conn, 200)["players"] == %{
      user.username => %{
        "caster" => [],
        "deck" => [],
        "discard" => [],
        "field" => [],
        "hand" => [],
        "health" => 20,
        "id" => user.username
      }
    }
  end
end
