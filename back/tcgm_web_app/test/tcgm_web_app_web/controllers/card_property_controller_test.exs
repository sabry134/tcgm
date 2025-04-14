defmodule TcgmWebAppWeb.CardPropertyControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.CardProperties.CardProperty
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.CardTypeProperties.CardTypeProperty
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", properties: ["property1", "property2"], game_id: game.id })
    |> Repo.insert!()

    cardTypeProperty = %CardTypeProperty{}
    |> CardTypeProperty.changeset(%{ property_name: "property1", cardtype_id: cardType.id, type: "text", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, image: "image", image_width: 100, image_height: 100, image_position_x: 0, image_position_y: 0, image_rotation: 0, image_scale_x: 1, image_scale_y: 1, image_opacity: 100 })
    |> Repo.insert!()

    cardTypeProperty2 = %CardTypeProperty{}
    |> CardTypeProperty.changeset(%{ property_name: "property2", cardtype_id: cardType.id, type: "number", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, image: "image", image_width: 100, image_height: 100, image_position_x: 0, image_position_y: 0, image_rotation: 0, image_scale_x: 1, image_scale_y: 1, image_opacity: 100 })
    |> Repo.insert!()

    action = %Action{}
    |> Action.changeset(%{ name: "Test action", description: "Test description", game_id: game.id })
    |> Repo.insert!()

    effect = %Effect{}
    |> Effect.changeset(%{ description: "Test description", action_ids: [action.id], game_id: game.id })
    |> Repo.insert!()

    card = %Card{}
    |> Card.changeset(%{ name: "Test card", text: "Test text", properties: ["Test property"], game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card2 = %Card{}
    |> Card.changeset(%{ name: "Test card 2", text: "Test text 2", properties: ["Test property 2"], game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    cardProperty = %CardProperty{}
    |> CardProperty.changeset(%{ card_id: card.id, cardtype_property_id: cardTypeProperty.id, value_string: "test", value_number: 1, value_boolean: true })
    |> Repo.insert!()

    {:ok, cardProperty: cardProperty, cardTypeProperty: cardTypeProperty, cardTypeProperty2: cardTypeProperty2, cardType: cardType, game: game, card: card, card2: card2}
  end

  test "GET /api/cardProperties returns a list of card properties", %{conn: conn, cardProperty: cardProperty} do
    conn = get(conn, "/api/cardProperties")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn cp -> cp["id"] == cardProperty.id end)
    assert Enum.any?(response, fn cp -> cp["card_id"] == cardProperty.card_id end)
    assert Enum.any?(response, fn cp -> cp["cardtype_property_id"] == cardProperty.cardtype_property_id end)
    assert Enum.any?(response, fn cp -> cp["value_string"] == cardProperty.value_string end)
    assert Enum.any?(response, fn cp -> cp["value_number"] == cardProperty.value_number end)
    assert Enum.any?(response, fn cp -> cp["value_boolean"] == cardProperty.value_boolean end)
  end

  test "GET /api/cardProperties/:id returns a single card property", %{conn: conn, cardProperty: cardProperty} do
    conn = get(conn, "/api/cardProperties/#{cardProperty.id}")
    response = json_response(conn, 200)

    assert response["id"] == cardProperty.id
    assert response["card_id"] == cardProperty.card_id
    assert response["cardtype_property_id"] == cardProperty.cardtype_property_id
    assert response["value_string"] == cardProperty.value_string
    assert response["value_number"] == cardProperty.value_number
    assert response["value_boolean"] == cardProperty.value_boolean
  end

  test "POST /api/cardProperties creates a new card property", %{conn: conn, cardTypeProperty2: cardTypeProperty2, card2: card2} do
    conn = post(conn, "/api/cardProperties", %{
      "cardProperty" => %{
        "card_id" => card2.id,
        "cardtype_property_id" => cardTypeProperty2.id,
        "value_string" => "test",
        "value_number" => 1,
        "value_boolean" => true
      }
    })
    response = json_response(conn, 201)

    assert response["card_id"] == card2.id
    assert response["cardtype_property_id"] == cardTypeProperty2.id
    assert response["value_string"] == "test"
    assert response["value_number"] == 1
    assert response["value_boolean"] == true
  end

  test "PUT /api/cardProperties/:id updates a card property", %{conn: conn, cardProperty: cardProperty} do
    conn = put(conn, "/api/cardProperties/#{cardProperty.id}", %{
      "cardProperty" => %{
        "value_string" => "updated",
        "value_number" => 2,
        "value_boolean" => false
      }
    })
    response = json_response(conn, 200)

    assert response["id"] == cardProperty.id
    assert response["value_string"] == "updated"
    assert response["value_number"] == 2
    assert response["value_boolean"] == false
  end

  test "DELETE /api/cardProperties/delete/:id deletes a card property", %{conn: conn, cardProperty: cardProperty} do
    conn = delete(conn, "/api/cardProperties/delete/#{cardProperty.id}")
    assert response(conn, 204)

    assert_raise Ecto.NoResultsError, fn ->
      Repo.get!(CardProperty, cardProperty.id)
    end
  end

  test "GET /api/cardProperties/card/:card_id returns card properties by card ID", %{conn: conn, cardProperty: cardProperty} do
    conn = get(conn, "/api/cardProperties/card/#{cardProperty.card_id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn cp -> cp["id"] == cardProperty.id end)
    assert Enum.any?(response, fn cp -> cp["card_id"] == cardProperty.card_id end)
    assert Enum.any?(response, fn cp -> cp["cardtype_property_id"] == cardProperty.cardtype_property_id end)
    assert Enum.any?(response, fn cp -> cp["value_string"] == cardProperty.value_string end)
    assert Enum.any?(response, fn cp -> cp["value_number"] == cardProperty.value_number end)
    assert Enum.any?(response, fn cp -> cp["value_boolean"] == cardProperty.value_boolean end)
  end

  test "GET /api/cardProperties/card/:card_id/property/:cardtype_property_id returns card properties by card ID and card type property ID", %{conn: conn, cardProperty: cardProperty} do
    conn = get(conn, "/api/cardProperties/card/#{cardProperty.card_id}/property/#{cardProperty.cardtype_property_id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn cp -> cp["id"] == cardProperty.id end)
    assert Enum.any?(response, fn cp -> cp["card_id"] == cardProperty.card_id end)
    assert Enum.any?(response, fn cp -> cp["cardtype_property_id"] == cardProperty.cardtype_property_id end)
    assert Enum.any?(response, fn cp -> cp["value_string"] == cardProperty.value_string end)
    assert Enum.any?(response, fn cp -> cp["value_number"] == cardProperty.value_number end)
    assert Enum.any?(response, fn cp -> cp["value_boolean"] == cardProperty.value_boolean end)
  end

  test "GET /api/cardProperties/card/:card_id/property/:cardtype_property_id returns 404 if card property not found", %{conn: conn} do
    conn = get(conn, "/api/cardProperties/card/999999/property/999999")
    assert response(conn, 404)
  end
end
