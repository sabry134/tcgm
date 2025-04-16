defmodule TcgmWebAppWeb.CardCollectionControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.CardCollections.CardCollection
  alias TcgmWebApp.CardCollectionCards.CardCollectionCard
  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    user = %User{}
    |> User.changeset(%{ username: "username"})
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
    |> Repo.insert!()

    action = %Action{}
    |> Action.changeset(%{ name: "Test action", description: "Test description", game_id: game.id })
    |> Repo.insert!()

    effect = %Effect{}
    |> Effect.changeset(%{ description: "Test description", action_ids: [action.id], game_id: game.id })
    |> Repo.insert!()

    card = %Card{}
    |> Card.changeset(%{ name: "Test card", text: "Test text", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card2 = %Card{}
    |> Card.changeset(%{ name: "Test card 2", text: "Test text 2", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card_collection = %CardCollection{}
    |> CardCollection.changeset(%{ name: "test", quantity: 1, game_id: game.id, user_id: user.id, type: "Test_type" })
    |> Repo.insert!()

    card_collection_card = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card.id, quantity: 1, group: "deck" })
    |> Repo.insert!()

    card_collection_card2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card2.id, quantity: 1, group: "deck" })
    |> Repo.insert!()

    {:ok, card_collection: card_collection, game: game, user: user, card: card, card2: card2, card_collection_card: card_collection_card, card_collection_card2: card_collection_card2}
  end

  test "GET /api/card_collections returns a list of card collections", %{conn: conn, card_collection: card_collection} do
    conn = get(conn, "/api/card_collections")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn cc -> cc["name"] == card_collection.name end)
    assert Enum.any?(response, fn cc -> cc["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn cc -> cc["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn cc -> cc["user_id"] == card_collection.user_id end)
  end

  test "GET /api/card_collections/:id returns a single card collection", %{conn: conn, card_collection: card_collection} do
    conn = get(conn, "/api/card_collections/#{card_collection.id}")
    response = json_response(conn, 200)

    assert response["id"] == card_collection.id
    assert response["name"] == card_collection.name
    assert response["quantity"] == card_collection.quantity
    assert response["game_id"] == card_collection.game_id
    assert response["user_id"] == card_collection.user_id
  end

  test "GET /api/card_collections/user/:user_id returns a list of card collections by user_id", %{conn: conn, card_collection: card_collection, user: user} do
    conn = get(conn, "/api/card_collections/user/#{user.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn cc -> cc["name"] == card_collection.name end)
    assert Enum.any?(response, fn cc -> cc["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn cc -> cc["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn cc -> cc["user_id"] == card_collection.user_id end)
  end

  test "GET /api/card_collections/user/:user_id/game/:game_id returns a list of card collections by user_id and game_id", %{conn: conn, card_collection: card_collection, user: user, game: game} do
    conn = get(conn, "/api/card_collections/user/#{user.id}/game/#{game.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn cc -> cc["name"] == card_collection.name end)
    assert Enum.any?(response, fn cc -> cc["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn cc -> cc["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn cc -> cc["user_id"] == card_collection.user_id end)
  end

  test "POST /api/card_collections creates a new card collection", %{conn: conn, game: game, user: user} do
    attrs = %{ name: "Test card collection", quantity: 1, game_id: game.id, user_id: user.id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)
    response = json_response(conn, 201)

    assert response["id"]
    assert response["name"] == "Test card collection"
    assert response["quantity"] == 1
    assert response["game_id"] == game.id
    assert response["user_id"] == user.id
  end

  test "PUT /api/card_collections/:id updates a card collection", %{conn: conn, card_collection: card_collection} do
    attrs = %{ name: "Updated card collection", quantity: 2, game_id: card_collection.game_id, user_id: card_collection.user_id, type: "Updated_type" }
    conn = put(conn, "/api/card_collections/#{card_collection.id}", card_collection: attrs)
    response = json_response(conn, 200)

    assert response["id"] == card_collection.id
    assert response["name"] == "Updated card collection"
    assert response["quantity"] == 2
    assert response["game_id"] == card_collection.game_id
    assert response["user_id"] == card_collection.user_id
  end

  test "DELETE /api/card_collections/delete/:id deletes a card collection", %{conn: conn, card_collection: card_collection} do
    conn = delete(conn, "/api/card_collections/delete/#{card_collection.id}")
    assert response(conn, 204)

    assert_raise Ecto.NoResultsError, fn ->
      Repo.get!(CardCollection, card_collection.id)
    end
  end

  test "PUT /api/card_collections/:id/cards updates a card collection with cards", %{conn: conn, card_collection: card_collection, card: card} do
    payload = %{
      "card_ids" => [card.id],
      "cards" => [
        %{"card_id" => card.id, "quantity" => 2, "group" => "deck"}
      ]
    }

    conn = put(conn, "/api/card_collections/#{card_collection.id}/cards", payload)
    response = json_response(conn, 200)

    assert response["card_collection"]["id"] == card_collection.id
    assert response["cards"] |> Enum.any?(fn c -> c["card_id"] == card.id end)
  end

  test "PUT /api/card_collections/:id/cards updates a card collection with cards and deletes old cards", %{conn: conn, card_collection: card_collection, card_collection_card: card_collection_card, card: card, card2: card2} do
    payload = %{
      "card_ids" => [card.id],
      "cards" => [
        %{"card_id" => card2.id, "quantity" => 2, "group" => "deck"},
      ]
    }

    conn = put(conn, "/api/card_collections/#{card_collection.id}/cards", payload)
    response = json_response(conn, 200)

    assert response["card_collection"]["id"] == card_collection.id
    assert response["cards"] |> Enum.any?(fn c -> c["card_id"] == card2.id end)
    assert Repo.get(CardCollectionCard, card_collection_card.id) == nil
  end

  test "GET /api/card_collections/:id/cards returns a list of cards in a card collection", %{conn: conn, card_collection: card_collection, card: card} do
    conn = get(conn, "/api/card_collections/#{card_collection.id}/cards")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn cc -> cc["id"] == card.id end)
  end
end
