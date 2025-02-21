defmodule TcgmWebAppWeb.CardCollectionControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.CardCollections.CardCollection
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
    |> CardType.changeset(%{ name: "Test cardType", properties: ["property1", "property2"], game_id: game.id }) # 🔥 Use game.id
    |> Repo.insert!()

    action = %Action{}
    |> Action.changeset(%{ name: "Test action", description: "Test description", game_id: game.id })
    |> Repo.insert!()

    effect = %Effect{}
    |> Effect.changeset(%{ description: "Test description", action_ids: [action.id], game_id: game.id })
    |> Repo.insert!()

    card = %Card{}
    |> Card.changeset(%{ name: "Test card", text: "Test text", image: "image", properties: ["Test property"], game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card_collection = %CardCollection{}
    |> CardCollection.changeset(%{ name: "test", quantity: 1, game_id: game.id, user_id: user.id, type: "Test_type" })
    |> Repo.insert!()

    on_exit(fn ->
      File.rm_rf("./data/card_collections/#{game.id}.json")
      File.rm_rf("./data/card_collections/#{game.id}_#{user.id}.json")
    end)

    {:ok, card_collection: card_collection, game: game, user: user, card: card}
  end

  test "GET /api/card_collections returns a list of card collections", %{conn: conn, card_collection: card_collection} do
    conn = get(conn, "/api/card_collections")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card_collection.name end)
    assert Enum.any?(response, fn c -> c["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn c -> c["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn c -> c["user_id"] == card_collection.user_id end)
    assert Enum.any?(response, fn c -> c["type"] == card_collection.type end)
  end

  test "GET /api/card_collections/:id returns a single card collection", %{conn: conn, card_collection: card_collection} do
    conn = get(conn, "/api/card_collections/#{card_collection.id}")
    response = json_response(conn, 200)

    assert response["id"] == card_collection.id
    assert response["name"] == card_collection.name
    assert response["quantity"] == card_collection.quantity
    assert response["game_id"] == card_collection.game_id
    assert response["user_id"] == card_collection.user_id
    assert response["type"] == card_collection.type
  end

  test "POST /api/card_collections creates a card collection", %{conn: conn, game: game} do
    attrs = %{ name: "test_aha", quantity: 1, game_id: game.id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)
    response = json_response(conn, 201)

    id = response["id"]

    assert response["name"] == "test_aha"
    assert response["quantity"] == 1
    assert response["game_id"] == game.id
    assert response["type"] == "Test_type"

    file_path = "./data/card_collections/#{game.id}.json"
    assert File.exists?(file_path)

    {:ok, content} = File.read(file_path)
    collections = Jason.decode!(content)
    assert Enum.any?(collections, fn c -> c["name"] == "test_aha" end)
    assert Enum.any?(collections, fn c -> c["quantity"] == 1 end)
    assert Enum.any?(collections, fn c -> c["id"] == id end)
    assert Enum.any?(collections, fn c -> c["type"] == "Test_type" end)
    assert Enum.any?(collections, fn c -> c["cards"] == %{} end)

    File.rm_rf(file_path)
  end

  test "POST /api/card_collections creates a card collection with user id", %{conn: conn, game: game, user: user} do
    attrs = %{ name: "test_aha", quantity: 1, game_id: game.id, user_id: user.id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)
    response = json_response(conn, 201)

    id = response["id"]

    assert response["name"] == "test_aha"
    assert response["quantity"] == 1
    assert response["game_id"] == game.id
    assert response["user_id"] == user.id
    assert response["type"] == "Test_type"

    file_path = "./data/card_collections/#{game.id}_#{user.id}.json"
    assert File.exists?(file_path)

    {:ok, content} = File.read(file_path)
    collections = Jason.decode!(content)
    assert Enum.any?(collections, fn c -> c["name"] == "test_aha" end)
    assert Enum.any?(collections, fn c -> c["quantity"] == 1 end)
    assert Enum.any?(collections, fn c -> c["id"] == id end)
    assert Enum.any?(collections, fn c -> c["type"] == "Test_type" end)
    assert Enum.any?(collections, fn c -> c["cards"] == %{} end)

    File.rm_rf(file_path)
  end

  test "POST /api/card_collections create multiple collections for the same game", %{conn: conn, game: game} do
    attrs = %{ name: "test_aha", quantity: 1, game_id: game.id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)
    response = json_response(conn, 201)

    id = response["id"]

    assert response["name"] == "test_aha"
    assert response["quantity"] == 1
    assert response["game_id"] == game.id
    assert response["type"] == "Test_type"

    attrs = %{ name: "test_aha2", quantity: 2, game_id: game.id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)
    response = json_response(conn, 201)

    id = response["id"]

    assert response["name"] == "test_aha2"
    assert response["quantity"] == 2
    assert response["game_id"] == game.id
    assert response["type"] == "Test_type"

    file_path = "./data/card_collections/#{game.id}.json"
    assert File.exists?(file_path)

    {:ok, content} = File.read(file_path)
    collections = Jason.decode!(content)
    assert Enum.any?(collections, fn c -> c["name"] == "test_aha2" end)
    assert Enum.any?(collections, fn c -> c["quantity"] == 2 end)
    assert Enum.any?(collections, fn c -> c["id"] == id end)
    assert Enum.any?(collections, fn c -> c["type"] == "Test_type" end)
    assert Enum.any?(collections, fn c -> c["cards"] == %{} end)

    File.rm_rf(file_path)
  end

  test "PUT /api/card_collections/:id updates a card collection", %{conn: conn, card_collection: card_collection, game: game, user: user} do
    attrs = %{ name: "test 2", quantity: 2, game_id: game.id, type: "Test_type2" }
    conn = put(conn, "/api/card_collections/#{card_collection.id}", card_collection: attrs)
    response = json_response(conn, 200)

    assert response["name"] == "test 2"
    assert response["quantity"] == 2
    assert response["game_id"] == game.id
    assert response["user_id"] == user.id
    assert response["type"] == "Test_type2"
  end

  test "DELETE /api/card_collections/:id deletes a card collection", %{conn: conn, card_collection: card_collection} do
    conn = delete(conn, "/api/card_collections/delete/#{card_collection.id}")
    assert response(conn, 204) == ""

    assert Repo.get(CardCollection, card_collection.id) == nil
  end

  test "GET /api/card_collections/game/:game_id returns a list of card collections by game_id", %{conn: conn, card_collection: card_collection, game: game} do
    conn = get(conn, "/api/card_collections/game/#{game.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card_collection.name end)
    assert Enum.any?(response, fn c -> c["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn c -> c["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn c -> c["user_id"] == card_collection.user_id end)
    assert Enum.any?(response, fn c -> c["type"] == card_collection.type end)
  end

  test "GET /api/card_collections/game/:game_id/type/:type returns a list of card collections by game_id and type", %{conn: conn, card_collection: card_collection, game: game} do
    conn = get(conn, "/api/card_collections/game/#{game.id}/type/Test_type")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card_collection.name end)
    assert Enum.any?(response, fn c -> c["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn c -> c["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn c -> c["user_id"] == card_collection.user_id end)
    assert Enum.any?(response, fn c -> c["type"] == card_collection.type end)
  end

  test "GET /api/card_collections/user/:user_id returns a list of card collections by user_id", %{conn: conn, card_collection: card_collection, user: user} do
    conn = get(conn, "/api/card_collections/user/#{user.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card_collection.name end)
    assert Enum.any?(response, fn c -> c["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn c -> c["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn c -> c["user_id"] == card_collection.user_id end)
    assert Enum.any?(response, fn c -> c["type"] == card_collection.type end)
  end

  test "GET /api/card_collections/user/:user_id/game/:game_id returns a list of card collections by user_id and game_id", %{conn: conn, card_collection: card_collection, user: user, game: game} do
    conn = get(conn, "/api/card_collections/user/#{user.id}/game/#{game.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card_collection.name end)
    assert Enum.any?(response, fn c -> c["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn c -> c["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn c -> c["user_id"] == card_collection.user_id end)
    assert Enum.any?(response, fn c -> c["type"] == card_collection.type end)
  end

  test "POST /api/card_collections/add_card/:card_collection_id/card/:card_id/quantity/:quantity adds a card to a collection", %{conn: conn, card_collection: card_collection, card: card} do
    attrs = %{ name: "test_aha", quantity: 1, game_id: card_collection.game_id, user_id: card_collection.user_id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)

    id = json_response(conn, 201)["id"]
    name = json_response(conn, 201)["name"]

    conn = post(conn, "/api/card_collections/add_card/#{id}/card/#{card.id}/quantity/1")
    response = json_response(conn, 200)

    assert response["message"] == "Card added to collection"

    file_path = "./data/card_collections/#{card_collection.game_id}_#{card_collection.user_id}.json"
    assert File.exists?(file_path)

    {:ok, content} = File.read(file_path)
    collections = Jason.decode!(content)
    assert Enum.any?(collections, fn c -> c["name"] == name end)
    cards = collections |> Enum.find(fn c -> c["name"] == name end) |> Map.get("cards")
    assert Map.has_key?(cards, card.name)
    assert cards[card.name] == 1

    quantity = collections |> Enum.find(fn c -> c["name"] == name end) |> Map.get("quantity")
    assert quantity == 2

    db_quantity = Repo.get(CardCollection, id).quantity
    assert db_quantity == 2
  end

  test "POST /api/card_collections/add_card/:card_collection_id/card/:card_id/quantity/:quantity adds a card to a collection with quantity", %{conn: conn, card_collection: card_collection, card: card} do
    attrs = %{ name: "test_aha", quantity: 1, game_id: card_collection.game_id, user_id: card_collection.user_id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)

    id = json_response(conn, 201)["id"]
    name = json_response(conn, 201)["name"]

    conn = post(conn, "/api/card_collections/add_card/#{id}/card/#{card.id}/quantity/2")
    response = json_response(conn, 200)

    assert response["message"] == "Card added to collection"

    file_path = "./data/card_collections/#{card_collection.game_id}_#{card_collection.user_id}.json"
    assert File.exists?(file_path)

    {:ok, content} = File.read(file_path)
    collections = Jason.decode!(content)
    assert Enum.any?(collections, fn c -> c["name"] == name end)
    cards = collections |> Enum.find(fn c -> c["name"] == name end) |> Map.get("cards")
    assert Map.has_key?(cards, card.name)
    assert cards[card.name] == 2

    quantity = collections |> Enum.find(fn c -> c["name"] == name end) |> Map.get("quantity")
    assert quantity == 3

    db_quantity = Repo.get(CardCollection, id).quantity
    assert db_quantity == 3
  end

  test "POST /api/card_collections/remove_card/:card_collection_id/card/:card_id/quantity/:quantity removes a card from a collection", %{conn: conn, card_collection: card_collection, card: card} do
    attrs = %{ name: "test_aha", quantity: 1, game_id: card_collection.game_id, user_id: card_collection.user_id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)

    id = json_response(conn, 201)["id"]
    name = json_response(conn, 201)["name"]

    conn = post(conn, "/api/card_collections/add_card/#{id}/card/#{card.id}/quantity/2")
    response = json_response(conn, 200)

    assert response["message"] == "Card added to collection"

    conn = post(conn, "/api/card_collections/remove_card/#{id}/card/#{card.id}/quantity/1")
    response = json_response(conn, 200)

    assert response["message"] == "Card removed from collection"

    file_path = "./data/card_collections/#{card_collection.game_id}_#{card_collection.user_id}.json"
    assert File.exists?(file_path)

    {:ok, content} = File.read(file_path)
    collections = Jason.decode!(content)
    assert Enum.any?(collections, fn c -> c["name"] == name end)
    cards = collections |> Enum.find(fn c -> c["name"] == name end) |> Map.get("cards")
    assert Map.has_key?(cards, card.name)
    assert cards[card.name] == 1

    quantity = collections |> Enum.find(fn c -> c["name"] == name end) |> Map.get("quantity")
    assert quantity == 2

    db_quantity = Repo.get(CardCollection, id).quantity
    assert db_quantity == 2
  end

  test "GET /api/card_collections/get_cards/:card_collection_id returns a list of cards in a collection", %{conn: conn, card_collection: card_collection, card: card} do
    attrs = %{ name: "test_aha", quantity: 1, game_id: card_collection.game_id, user_id: card_collection.user_id, type: "Test_type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)

    id = json_response(conn, 201)["id"]
    name = json_response(conn, 201)["name"]

    conn = post(conn, "/api/card_collections/add_card/#{id}/card/#{card.id}/quantity/2")
    response = json_response(conn, 200)

    assert response["message"] == "Card added to collection"

    conn = get(conn, "/api/card_collections/get_cards/#{id}")
    response = json_response(conn, 200)

    assert length(response) == 2
    assert Enum.all?(response, fn c -> c["name"] == card.name end)
    assert Enum.all?(response, fn c -> c["text"] == card.text end)
    assert Enum.all?(response, fn c -> c["image"] == card.image end)
    assert Enum.all?(response, fn c -> c["properties"] == card.properties end)
    assert Enum.all?(response, fn c -> c["game_id"] == card.game_id end)
    assert Enum.all?(response, fn c -> c["card_type_id"] == card.card_type_id end)
    assert Enum.all?(response, fn c -> c["effect_ids"] == card.effect_ids end)
  end
end
