defmodule TcgmWebAppWeb.CardTypePropertyControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.CardTypeProperties.CardTypeProperty
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
    |> Repo.insert!()

    cardTypeProperty = %CardTypeProperty{}
    |> CardTypeProperty.changeset(%{ property_name: "property1", cardtype_id: cardType.id, type: "text", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, width: 1, height: 50, z_axis: 0, background_color: "black" })
    |> Repo.insert!()

    {:ok, cardTypeProperty: cardTypeProperty, cardType: cardType}
  end

  test "GET /api/cardTypeProperties returns a list of cardTypeProperties", %{conn: conn, cardTypeProperty: cardTypeProperty} do
    conn = get(conn, "/api/cardTypeProperties")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["property_name"] == cardTypeProperty.property_name end)
    assert Enum.any?(response, fn c -> c["cardtype_id"] == cardTypeProperty.cardtype_id end)
    assert Enum.any?(response, fn c -> c["type"] == cardTypeProperty.type end)
    assert Enum.any?(response, fn c -> c["font"] == cardTypeProperty.font end)
    assert Enum.any?(response, fn c -> c["font_size"] == cardTypeProperty.font_size end)
    assert Enum.any?(response, fn c -> c["font_color"] == cardTypeProperty.font_color end)
    assert Enum.any?(response, fn c -> c["position_x"] == cardTypeProperty.position_x end)
    assert Enum.any?(response, fn c -> c["position_y"] == cardTypeProperty.position_y end)
    assert Enum.any?(response, fn c -> c["rotation"] == cardTypeProperty.rotation end)
    assert Enum.any?(response, fn c -> c["scale_x"] == cardTypeProperty.scale_x end)
    assert Enum.any?(response, fn c -> c["scale_y"] == cardTypeProperty.scale_y end)
    assert Enum.any?(response, fn c -> c["width"] == cardTypeProperty.width end)
    assert Enum.any?(response, fn c -> c["height"] == cardTypeProperty.height end)
    assert Enum.any?(response, fn c -> c["z_axis"] == cardTypeProperty.z_axis end)
    assert Enum.any?(response, fn c -> c["background_color"] == cardTypeProperty.background_color end)
  end

  test "GET /api/cardTypeProperties/:id returns a single cardTypeProperty", %{conn: conn, cardTypeProperty: cardTypeProperty} do
    conn = get(conn, "/api/cardTypeProperties/#{cardTypeProperty.id}")
    response = json_response(conn, 200)

    assert response["id"] == cardTypeProperty.id
    assert response["property_name"] == cardTypeProperty.property_name
    assert response["cardtype_id"] == cardTypeProperty.cardtype_id
    assert response["type"] == cardTypeProperty.type
    assert response["font"] == cardTypeProperty.font
    assert response["font_size"] == cardTypeProperty.font_size
    assert response["font_color"] == cardTypeProperty.font_color
    assert response["position_x"] == cardTypeProperty.position_x
    assert response["position_y"] == cardTypeProperty.position_y
    assert response["rotation"] == cardTypeProperty.rotation
    assert response["scale_x"] == cardTypeProperty.scale_x
    assert response["scale_y"] == cardTypeProperty.scale_y
    assert response["height"] == cardTypeProperty.height
    assert response["width"] == cardTypeProperty.width
    assert response["background_color"] == cardTypeProperty.background_color
    assert response["z_axis"] == cardTypeProperty.z_axis

  end

  test "GET /api/cardTypeProperties/cardType/:cardType_id returns a list of cardTypeProperties by cardType_id", %{conn: conn, cardTypeProperty: cardTypeProperty, cardType: cardType} do
    conn = get(conn, "/api/cardTypeProperties/cardType/#{cardType.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["property_name"] == cardTypeProperty.property_name end)
    assert Enum.any?(response, fn c -> c["cardtype_id"] == cardTypeProperty.cardtype_id end)
    assert Enum.any?(response, fn c -> c["type"] == cardTypeProperty.type end)
    assert Enum.any?(response, fn c -> c["font"] == cardTypeProperty.font end)
    assert Enum.any?(response, fn c -> c["font_size"] == cardTypeProperty.font_size end)
    assert Enum.any?(response, fn c -> c["font_color"] == cardTypeProperty.font_color end)
    assert Enum.any?(response, fn c -> c["position_x"] == cardTypeProperty.position_x end)
    assert Enum.any?(response, fn c -> c["position_y"] == cardTypeProperty.position_y end)
    assert Enum.any?(response, fn c -> c["rotation"] == cardTypeProperty.rotation end)
    assert Enum.any?(response, fn c -> c["scale_x"] == cardTypeProperty.scale_x end)
    assert Enum.any?(response, fn c -> c["scale_y"] == cardTypeProperty.scale_y end)
    assert Enum.any?(response, fn c -> c["width"] == cardTypeProperty.width end)
    assert Enum.any?(response, fn c -> c["height"] == cardTypeProperty.height end)
    assert Enum.any?(response, fn c -> c["z_axis"] == cardTypeProperty.z_axis end)
    assert Enum.any?(response, fn c -> c["background_color"] == cardTypeProperty.background_color end)
  end

  test "GET /api/cardTypeProperties/cardType/:cardType_id/property/:property_name returns a list of cardTypeProperties by cardType_id and property_name", %{conn: conn, cardTypeProperty: cardTypeProperty, cardType: cardType} do
    conn = get(conn, "/api/cardTypeProperties/cardType/#{cardType.id}/property/#{cardTypeProperty.property_name}")
    response = json_response(conn, 200)

    assert length(response) > 0
   assert Enum.any?(response, fn c -> c["property_name"] == cardTypeProperty.property_name end)
    assert Enum.any?(response, fn c -> c["cardtype_id"] == cardTypeProperty.cardtype_id end)
    assert Enum.any?(response, fn c -> c["type"] == cardTypeProperty.type end)
    assert Enum.any?(response, fn c -> c["font"] == cardTypeProperty.font end)
    assert Enum.any?(response, fn c -> c["font_size"] == cardTypeProperty.font_size end)
    assert Enum.any?(response, fn c -> c["font_color"] == cardTypeProperty.font_color end)
    assert Enum.any?(response, fn c -> c["position_x"] == cardTypeProperty.position_x end)
    assert Enum.any?(response, fn c -> c["position_y"] == cardTypeProperty.position_y end)
    assert Enum.any?(response, fn c -> c["rotation"] == cardTypeProperty.rotation end)
    assert Enum.any?(response, fn c -> c["scale_x"] == cardTypeProperty.scale_x end)
    assert Enum.any?(response, fn c -> c["scale_y"] == cardTypeProperty.scale_y end)
    assert Enum.any?(response, fn c -> c["width"] == cardTypeProperty.width end)
    assert Enum.any?(response, fn c -> c["height"] == cardTypeProperty.height end)
    assert Enum.any?(response, fn c -> c["z_axis"] == cardTypeProperty.z_axis end)
    assert Enum.any?(response, fn c -> c["background_color"] == cardTypeProperty.background_color end)
  end

  test "POST /api/cardTypeProperties creates a new cardTypeProperty", %{conn: conn, cardType: cardType} do
    attrs = %{property_name: "property2", cardtype_id: cardType.id, type: "text", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, width: 1, height: 50, z_axis: 0, background_color: "black"  }
    conn = post(conn, "/api/cardTypeProperties", cardTypeProperty: attrs)
    response = json_response(conn, 201)

    assert response["id"]
    assert response["property_name"] == "property2"
    assert response["cardtype_id"] == cardType.id
    assert response["type"] == "text"
    assert response["font"] == "Arial"
    assert response["font_size"] == 12
    assert response["font_color"] == "black"
    assert response["position_x"] == 0
    assert response["position_y"] == 0
    assert response["rotation"] == 0
    assert response["scale_x"] == 1
    assert response["scale_y"] == 1
    assert response["z_axis"] == 0
    assert response["background_color"] == "black"
    assert response["width"] == 1
    assert response["height"] == 50

  end

  test "PUT /api/cardTypeProperties/:id updates a cardTypeProperty", %{conn: conn, cardTypeProperty: cardTypeProperty} do
    attrs = %{ property_name: "property2", cardtype_id: cardTypeProperty.cardtype_id, type: "text", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, width: 1, height: 50, z_axis: 0, background_color: "black"  }
    conn = put(conn, "/api/cardTypeProperties/#{cardTypeProperty.id}", cardTypeProperty: attrs)
    response = json_response(conn, 200)

    assert response["id"] == cardTypeProperty.id
    assert response["property_name"] == "property2"
    assert response["cardtype_id"] == cardTypeProperty.cardtype_id
    assert response["type"] == "text"
    assert response["font"] == "Arial"
    assert response["font_size"] == 12
    assert response["font_color"] == "black"
    assert response["position_x"] == 0
    assert response["position_y"] == 0
    assert response["rotation"] == 0
    assert response["scale_x"] == 1
    assert response["scale_y"] == 1
  end

  test "DELETE /api/cardTypeProperties/:id deletes a cardTypeProperty", %{conn: conn, cardTypeProperty: cardTypeProperty} do
    conn = delete(conn, "/api/cardTypeProperties/delete/#{cardTypeProperty.id}")
    assert response(conn, 204) == ""

    assert Repo.get(CardTypeProperty, cardTypeProperty.id) == nil
  end
end
