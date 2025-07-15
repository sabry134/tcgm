defmodule TcgmWebAppWeb.CardCollectionGroupControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.CardCollectionGroups.CardCollectionGroup
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
    |> Repo.insert!()

    cardCollectionGroup = %CardCollectionGroup{}
    |> CardCollectionGroup.changeset(%{ name: "Test group", game_id: game.id, max_cards: 10, min_cards: 1, max_copies: 4, share_max_copies: true, allowed_card_types: [cardType.id], collection_type: "deck" })
    |> Repo.insert!()

    {:ok, game: game, cardType: cardType, cardCollectionGroup: cardCollectionGroup}
  end

  test "GET /api/card_collection_groups returns all card collection groups", %{conn: conn} do
    conn = get(conn, "/api/card_collection_groups")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn g -> g["name"] == "Test group" end)
  end

  test "GET /api/card_collection_groups/:id returns a specific card collection group", %{conn: conn, cardCollectionGroup: cardCollectionGroup} do
    conn = get(conn, "/api/card_collection_groups/#{cardCollectionGroup.id}")
    response = json_response(conn, 200)

    assert response["id"] == cardCollectionGroup.id
    assert response["name"] == "Test group"
    assert response["game_id"] == cardCollectionGroup.game_id
  end

  test "POST /api/card_collection_groups creates a new card collection group", %{conn: conn, game: game, cardType: cardType} do
    attrs = %{ name: "Test group 2", game_id: game.id, max_cards: 10, min_cards: 1, max_copies: 4, share_max_copies: true, allowed_card_types: [cardType.id], collection_type: "deck" }
    conn = post(conn, "/api/card_collection_groups", group: attrs)
    response = json_response(conn, 201)

    assert response["id"]
    assert response["name"] == "Test group 2"
    assert response["game_id"] == game.id
    assert response["max_cards"] == 10
    assert response["min_cards"] == 1
    assert response["max_copies"] == 4
    assert response["share_max_copies"] == true
    assert response["allowed_card_types"] == [cardType.id]
    assert response["collection_type"] == "deck"
  end

  test "PUT /api/card_collection_groups/:id updates a card collection group", %{conn: conn, cardCollectionGroup: cardCollectionGroup} do
    updated_attrs = %{ name: "Updated group", max_cards: 20 }
    conn = put(conn, "/api/card_collection_groups/#{cardCollectionGroup.id}", group: updated_attrs)
    response = json_response(conn, 200)

    assert response["id"] == cardCollectionGroup.id
    assert response["name"] == "Updated group"
    assert response["max_cards"] == 20
  end

  test "DELETE /api/card_collection_groups/:id deletes a card collection group", %{conn: conn, cardCollectionGroup: cardCollectionGroup} do
    conn = delete(conn, "/api/card_collection_groups/delete/#{cardCollectionGroup.id}")
    assert response(conn, 204) == ""

    assert Repo.get(CardCollectionGroup, cardCollectionGroup.id) == nil
  end

  test "GET /api/card_collection_groups/game/:game_id returns card collection groups by game ID", %{conn: conn, game: game} do
    conn = get(conn, "/api/card_collection_groups/game/#{game.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn g -> g["game_id"] == game.id end)
  end

  test "GET /api/card_collection_rgoups/game/:game_id/type/:collection_type returns card collection group by game ID and collection type", %{conn: conn, game: game} do
    conn = get(conn, "/api/card_collection_groups/game/#{game.id}/type/deck")
    response = json_response(conn, 200)

    Enum.each(response, fn group ->
      assert group["game_id"] == game.id
      assert group["collection_type"] == "deck"
    end)
  end

  test "GET /api/card_collection_groups/card_collection_types returns all card collection types", %{conn: conn} do
    conn = get(conn, "/api/card_collection_groups/card_collection_types")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn type -> type["name"] == "deck" end)
    assert Enum.any?(response, fn type -> type["name"] == "set" end)
    assert Enum.any?(response, fn type -> type["name"] == "collection" end)
  end
end
