defmodule TcgmWebAppWeb.CardControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.CardTypeProperties.CardTypeProperty
  alias TcgmWebApp.CardProperties.CardProperty
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
    |> Repo.insert!()

    cardTypeProperty = %CardTypeProperty{}
    |> CardTypeProperty.changeset(%{ property_name: "property1", cardtype_id: cardType.id, type: "text", value: "test", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, image: "image", image_width: 100, image_height: 100, image_position_x: 0, image_position_y: 0, image_rotation: 0, image_scale_x: 1, image_scale_y: 1, image_opacity: 100 })
    |> Repo.insert!()

    cardTypeProperty2 = %CardTypeProperty{}
    |> CardTypeProperty.changeset(%{ property_name: "property2", cardtype_id: cardType.id, type: "number", value: "42", variant: "test", mutable: true, font: "Arial", font_size: 12, font_color: "black", position_x: 0, position_y: 0, rotation: 0, scale_x: 1, scale_y: 1, border_width: 1, border_color: "red", border_radius: "130", opacity: 2, image: "image", image_width: 100, image_height: 100, image_position_x: 0, image_position_y: 0, image_rotation: 0, image_scale_x: 1, image_scale_y: 1, image_opacity: 100 })
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

    cardProperty = %CardProperty{}
    |> CardProperty.changeset(%{ value_string: "value1", cardtype_property_id: cardTypeProperty.id, card_id: card.id })
    |> Repo.insert!()

    cardProperty2 = %CardProperty{}
    |> CardProperty.changeset(%{ value_number: 43, cardtype_property_id: cardTypeProperty2.id, card_id: card.id })
    |> Repo.insert!()

    {:ok, card: card, game: game, cardType: cardType, action: action, effect: effect, cardTypeProperty: cardTypeProperty, cardTypeProperty2: cardTypeProperty2}
  end

  test "GET /api/cards returns a list of cards", %{conn: conn, card: card} do
    conn = get(conn, "/api/cards")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card.name end)
    assert Enum.any?(response, fn c -> c["text"] == card.text end)
    assert Enum.any?(response, fn c -> c["game_id"] == card.game_id end)
    assert Enum.any?(response, fn c -> c["card_type_id"] == card.card_type_id end)
    assert Enum.any?(response, fn c -> c["effect_ids"] == card.effect_ids end)
  end

  test "GET /api/cards/:id returns a single card", %{conn: conn, card: card} do
    conn = get(conn, "/api/cards/#{card.id}")
    response = json_response(conn, 200)

    assert response["id"] == card.id
    assert response["name"] == card.name
    assert response["text"] == card.text
    assert response["game_id"] == card.game_id
    assert response["card_type_id"] == card.card_type_id
    assert response["effect_ids"] == card.effect_ids
  end

  test "GET /api/cards/game/:game_id returns a list of cards by game_id", %{conn: conn, card: card, game: game} do
    conn = get(conn, "/api/cards/game/#{game.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card.name end)
    assert Enum.any?(response, fn c -> c["text"] == card.text end)
    assert Enum.any?(response, fn c -> c["game_id"] == card.game_id end)
    assert Enum.any?(response, fn c -> c["card_type_id"] == card.card_type_id end)
    assert Enum.any?(response, fn c -> c["effect_ids"] == card.effect_ids end)
  end

  test "POST /api/cards creates a new card", %{conn: conn, game: game, cardType: cardType, effect: effect} do
    attrs = %{ name: "Test card 2", text: "Test text 2", image: "image", properties: ["properties"], game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] }
    conn = post(conn, "/api/cards", card: attrs)
    response = json_response(conn, 201)

    assert response["id"]
    assert response["name"] == "Test card 2"
    assert response["text"] == "Test text 2"
    assert response["game_id"] == game.id
    assert response["card_type_id"] == cardType.id
    assert response["effect_ids"] == [effect.id]
  end

  test "PUT /api/cards/:id updates a card", %{conn: conn, card: card} do
    attrs = %{ name: "Test card 2", text: "Test text 2", properties: ["properties"], game_id: card.game_id, card_type_id: card.card_type_id, effect_ids: card.effect_ids }
    conn = put(conn, "/api/cards/#{card.id}", card: attrs)
    response = json_response(conn, 200)

    assert response["id"] == card.id
    assert response["name"] == "Test card 2"
    assert response["text"] == "Test text 2"
    assert response["game_id"] == card.game_id
    assert response["card_type_id"] == card.card_type_id
    assert response["effect_ids"] == card.effect_ids
  end

  test "DELETE /api/cards/:id deletes a card", %{conn: conn, card: card} do
    conn = delete(conn, "/api/cards/delete/#{card.id}")
    assert response(conn, 204) == ""

    assert Repo.get(Card, card.id) == nil
  end

  test "POST /api/cards/:id/properties creates a new card with properties", %{conn: conn, game: game, cardType: cardType, effect: effect, cardTypeProperty: cardTypeProperty, cardTypeProperty2: cardTypeProperty2} do
    attrs = %{ name: "Test card 2", text: "Test text 2", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] }
    properties = [%{ name: "property1", value_string: "value1", cardtype_property_id: cardTypeProperty.id }, %{ name: "property2", value_number: 42, cardtype_property_id: cardTypeProperty2.id }]

    conn = post(conn, "/api/cards/with_properties", card: attrs, properties: properties)
    response = json_response(conn, 201)

    assert response["card"]["name"] == "Test card 2"
    assert response["card"]["text"] == "Test text 2"
    assert response["card"]["game_id"] == game.id
    assert response["card"]["card_type_id"] == cardType.id
    assert response["card"]["effect_ids"] == [effect.id]
    assert response["properties"] |> Enum.any?(fn p -> p["cardtype_property_id"] == cardTypeProperty.id and p["value_string"] == "value1" end)
    assert response["properties"] |> Enum.any?(fn p -> p["cardtype_property_id"] == cardTypeProperty2.id and p["value_number"] == 42 end)
  end

  test "GET /api/cards/game/:game_id/with_properties returns a list of cards with properties by game_id", %{conn: conn, card: card, game: game} do
    conn = get(conn, "/api/cards/game/#{game.id}/with_properties")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card.name end)
    assert Enum.any?(response, fn c -> c["text"] == card.text end)
    assert Enum.any?(response, fn c -> c["game_id"] == card.game_id end)
    assert Enum.any?(response, fn c -> c["card_type_id"] == card.card_type_id end)
    assert Enum.any?(response, fn c -> c["effect_ids"] == card.effect_ids end)
  end

end
