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
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
    |> Repo.insert!()

    {:ok, cardType: cardType, game: game}
  end

  test "GET /api/cardTypes returns a list of cardTypes", %{conn: conn, cardType: cardType} do
    conn = get(conn, "/api/cardTypes")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == cardType.name end)
    assert Enum.any?(response, fn c -> c["game_id"] == cardType.game_id end)

  end

  test "GET /api/cardTypes/:id returns a single cardType", %{conn: conn, cardType: cardType} do
    conn = get(conn, "/api/cardTypes/#{cardType.id}")
    response = json_response(conn, 200)

    assert response["id"] == cardType.id
    assert response["name"] == cardType.name
    assert response["game_id"] == cardType.game_id
  end

  test "GET /api/cardTypes/game/:game_id returns a list of cardTypes by game_id", %{conn: conn, cardType: cardType, game: game} do

    conn = get(conn, "/api/cardTypes/game/#{game.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == cardType.name end)
    assert Enum.any?(response, fn c -> c["game_id"] == cardType.game_id end)
  end

  test "POST /api/cardTypes creates a new cardType", %{conn: conn, game: game} do
    attrs = %{ name: "Test cardType 2", game_id: game.id }
    conn = post(conn, "/api/cardTypes", cardType: attrs)
    response = json_response(conn, 201)

    assert response["name"] == attrs.name
    assert Repo.get_by(CardType, name: attrs[:name])
  end

  test "POST /api/cardTypes returns errors when data is invalid", %{conn: conn} do
    attrs = %{ name: "", properties: nil, game_id: 4 }
    conn = post(conn, "/api/cardTypes", cardType: attrs)
    assert json_response(conn, 422)["errors"]
  end

  test "PUT /api/cardTypes/:id updates an existing cardType", %{conn: conn, cardType: cardType, game: game} do
    attrs = %{ name: "Test cardType 2", game_id: game.id }
    conn = put(conn, "/api/cardTypes/#{cardType.id}", cardType: attrs)
    response = json_response(conn, 200)

    assert response["name"] == attrs.name
  end

  test "DELETE /api/cardTypes/:id deletes an existing cardType", %{conn: conn, cardType: cardType} do
    conn = delete(conn, "/api/cardTypes/delete/#{cardType.id}")
    assert response(conn, 204) == ""

    assert Repo.get(CardType, cardType.id) == nil
  end

  test "POST /api/cardTypes/with_properties creates a new cardType with properties", %{conn: conn, game: game} do
    cardtype_property = %{ property_name: "property1", type: "text", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, image: "image", image_width: 100, image_height: 100, image_position_x: 0, image_position_y: 0, image_rotation: 0, image_scale_x: 1, image_scale_y: 1, image_opacity: 100 }
    cardtype_property2 = %{ property_name: "property2", type: "number", value: "10", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, image: "image", image_width: 100, image_height: 100, image_position_x: 0, image_position_y: 0, image_rotation: 0, image_scale_x: 1, image_scale_y: 1, image_opacity: 100 }
    attrs = %{ name: "Test cardType 2", game_id: game.id }
    properties = [cardtype_property, cardtype_property2]
    conn = post(conn, "/api/cardTypes/with_properties", cardType: attrs, properties: properties)
    response = json_response(conn, 201)

    assert response["cardType"]["name"] == attrs.name
    assert response["cardType"]["game_id"] == game.id
    assert response["cardType_properties"] |> Enum.any?(fn p -> p["property_name"] == cardtype_property[:property_name] end)
    assert response["cardType_properties"] |> Enum.any?(fn p -> p["property_name"] == cardtype_property2[:property_name] end)

    assert Repo.get_by(CardType, name: attrs[:name])
  end

end
