defmodule TcgmWebAppWeb.CardCollectionControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.CardCollections.CardCollection
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    card_collection = %CardCollection{}
    |> CardCollection.changeset(%{ name: "test", quantity: 1, game_id: game.id, type: "Test type" })
    |> Repo.insert!()

    {:ok, card_collection: card_collection, game: game}
  end

  test "GET /api/card_collections returns a list of card collections", %{conn: conn, card_collection: card_collection} do
    conn = get(conn, "/api/card_collections")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card_collection.name end)
    assert Enum.any?(response, fn c -> c["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn c -> c["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn c -> c["type"] == card_collection.type end)
  end

  test "GET /api/card_collections/:id returns a single card collection", %{conn: conn, card_collection: card_collection} do
    conn = get(conn, "/api/card_collections/#{card_collection.id}")
    response = json_response(conn, 200)

    assert response["id"] == card_collection.id
    assert response["name"] == card_collection.name
    assert response["quantity"] == card_collection.quantity
    assert response["game_id"] == card_collection.game_id
    assert response["type"] == card_collection.type
  end

  test "POST /api/card_collections creates a card collection", %{conn: conn, game: game} do
    attrs = %{ name: "test aha", quantity: 1, game_id: game.id, type: "Test type" }
    conn = post(conn, "/api/card_collections", card_collection: attrs)
    response = json_response(conn, 201)

    assert response["name"] == "test aha"
    assert response["quantity"] == 1
    assert response["game_id"] == game.id
    assert response["type"] == "Test type"
  end

  test "PUT /api/card_collections/:id updates a card collection", %{conn: conn, card_collection: card_collection, game: game} do
    attrs = %{ name: "test 2", quantity: 2, game_id: game.id, type: "Test type 2" }
    conn = put(conn, "/api/card_collections/#{card_collection.id}", card_collection: attrs)
    response = json_response(conn, 200)

    assert response["name"] == "test 2"
    assert response["quantity"] == 2
    assert response["game_id"] == game.id
    assert response["type"] == "Test type 2"
  end

  test "DELETE /api/card_collections/:id deletes a card collection", %{conn: conn, card_collection: card_collection} do
    conn = delete(conn, "/api/card_collections/delete/#{card_collection.id}")
    assert response(conn, 204) == ""

    assert Repo.get(CardCollection, card_collection.id) == nil
  end

  test "GET /api/card_collections/game/:game_id returns a list of card collections by game_id", %{conn: conn, card_collection: card_collection} do
    conn = get(conn, "/api/card_collections/game/#{card_collection.game_id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card_collection.name end)
    assert Enum.any?(response, fn c -> c["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn c -> c["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn c -> c["type"] == card_collection.type end)
  end

  test "GET /api/card_collections/game/:game_id/type/:type returns a list of card collections by game_id and type", %{conn: conn, card_collection: card_collection} do
    conn = get(conn, "/api/card_collections/game/#{card_collection.game_id}/type/#{card_collection.type}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card_collection.name end)
    assert Enum.any?(response, fn c -> c["quantity"] == card_collection.quantity end)
    assert Enum.any?(response, fn c -> c["game_id"] == card_collection.game_id end)
    assert Enum.any?(response, fn c -> c["type"] == card_collection.type end)
  end
end
