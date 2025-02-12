defmodule TcgmWebAppWeb.CardTypeControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", properties: ["property1", "property2"], game_id: game.id }) # 🔥 Use game.id
    |> Repo.insert!()

    {:ok, cardType: cardType, game: game}
  end

  test "GET /api/cardTypes returns a list of cardTypes", %{conn: conn, cardType: cardType} do
    conn = get(conn, "/api/cardTypes")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == cardType.name end)
    assert Enum.any?(response, fn c -> c["properties"] == cardType.properties end)
    assert Enum.any?(response, fn c -> c["game_id"] == cardType.game_id end)

  end

  test "GET /api/cardTypes/:id returns a single cardType", %{conn: conn, cardType: cardType} do
    conn = get(conn, "/api/cardTypes/#{cardType.id}")
    response = json_response(conn, 200)

    assert response["id"] == cardType.id
    assert response["name"] == cardType.name
    assert response["properties"] == cardType.properties
    assert response["game_id"] == cardType.game_id
  end

  test "GET /api/cardTypes/game/:game_id returns a list of cardTypes by game_id", %{conn: conn, cardType: cardType, game: game} do

    conn = get(conn, "/api/cardTypes/game/#{game.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == cardType.name end)
    assert Enum.any?(response, fn c -> c["properties"] == cardType.properties end)
    assert Enum.any?(response, fn c -> c["game_id"] == cardType.game_id end)
  end

  test "POST /api/cardTypes creates a new cardType", %{conn: conn, game: game} do
    attrs = %{ name: "Test cardType 2", properties: ["property1", "property2"], game_id: game.id }
    conn = post(conn, "/api/cardTypes", cardType: attrs)
    response = json_response(conn, 201)

    assert response["name"] == attrs.name
    assert response["properties"] == attrs.properties
    assert Repo.get_by(CardType, name: attrs[:name])
  end

  test "POST /api/cardTypes returns errors when data is invalid", %{conn: conn} do
    attrs = %{ name: "", properties: nil, game_id: 4 }
    conn = post(conn, "/api/cardTypes", cardType: attrs)
    assert json_response(conn, 422)["errors"]
  end

  test "PUT /api/cardTypes/:id updates an existing cardType", %{conn: conn, cardType: cardType, game: game} do
    attrs = %{ name: "Test cardType 2", properties: ["property1", "property2"], game_id: game.id }
    conn = put(conn, "/api/cardTypes/#{cardType.id}", cardType: attrs)
    response = json_response(conn, 200)

    assert response["name"] == attrs.name
    assert response["properties"] == attrs.properties
  end

  test "DELETE /api/cardTypes/:id deletes an existing cardType", %{conn: conn, cardType: cardType} do
    conn = delete(conn, "/api/cardTypes/delete/#{cardType.id}")
    assert response(conn, 204) == ""

    assert Repo.get(CardType, cardType.id) == nil
  end

end
