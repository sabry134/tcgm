defmodule TcgmWebAppWeb.CardControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
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

    {:ok, card: card, game: game, cardType: cardType, action: action, effect: effect}
  end

  test "GET /api/cards returns a list of cards", %{conn: conn, card: card} do
    conn = get(conn, "/api/cards")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn c -> c["name"] == card.name end)
    assert Enum.any?(response, fn c -> c["text"] == card.text end)
    assert Enum.any?(response, fn c -> c["image"] == card.image end)
    assert Enum.any?(response, fn c -> c["properties"] == card.properties end)
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
    assert response["image"] == card.image
    assert response["properties"] == card.properties
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
    assert Enum.any?(response, fn c -> c["image"] == card.image end)
    assert Enum.any?(response, fn c -> c["properties"] == card.properties end)
    assert Enum.any?(response, fn c -> c["game_id"] == card.game_id end)
    assert Enum.any?(response, fn c -> c["card_type_id"] == card.card_type_id end)
    assert Enum.any?(response, fn c -> c["effect_ids"] == card.effect_ids end)
  end

  test "POST /api/cards creates a new card", %{conn: conn, game: game, cardType: cardType, effect: effect} do
    attrs = %{ name: "Test card 2", text: "Test text 2", image: "image 2", properties: ["properties"], game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] }
    conn = post(conn, "/api/cards", card: attrs)
    response = json_response(conn, 201)

    assert response["id"]
    assert response["name"] == "Test card 2"
    assert response["text"] == "Test text 2"
    assert response["image"] == "image 2"
    assert response["properties"] == ["properties"]
    assert response["game_id"] == game.id
    assert response["card_type_id"] == cardType.id
    assert response["effect_ids"] == [effect.id]
  end

  test "PUT /api/cards/:id updates a card", %{conn: conn, card: card} do
    attrs = %{ name: "Test card 2", text: "Test text 2", image: "image 2", properties: ["properties"], game_id: card.game_id, card_type_id: card.card_type_id, effect_ids: card.effect_ids }
    conn = put(conn, "/api/cards/#{card.id}", card: attrs)
    response = json_response(conn, 200)

    assert response["id"] == card.id
    assert response["name"] == "Test card 2"
    assert response["text"] == "Test text 2"
    assert response["image"] == "image 2"
    assert response["properties"] == ["properties"]
    assert response["game_id"] == card.game_id
    assert response["card_type_id"] == card.card_type_id
    assert response["effect_ids"] == card.effect_ids
  end

  test "DELETE /api/cards/:id deletes a card", %{conn: conn, card: card} do
    conn = delete(conn, "/api/cards/delete/#{card.id}")
    assert response(conn, 204) == ""

    assert Repo.get(Card, card.id) == nil
  end

end
