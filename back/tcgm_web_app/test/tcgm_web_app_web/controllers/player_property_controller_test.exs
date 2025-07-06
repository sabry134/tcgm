defmodule TcgmWebAppWeb.PlayerPropertyControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.CardProperties.CardProperty
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.PlayerProperties.PlayerProperty
  alias TcgmWebApp.GameRules.GameRule
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

    game_rule = %GameRule{}
    |> GameRule.changeset(%{starting_hand_size: 2, min_deck_size: 3, max_deck_size: 3, max_hand_size: 7, draw_per_turn: 9, game_id: game.id})
    |> Repo.insert!()

    game_rule2 = %GameRule{}
    |> GameRule.changeset(%{starting_hand_size: 2, min_deck_size: 3, max_deck_size: 3, max_hand_size: 7, draw_per_turn: 9, game_id: game.id})
    |> Repo.insert!()

    player_property = %PlayerProperty{}
    |> PlayerProperty.changeset(%{ property_name: "attack",  value: 9, game_rule_id: game_rule.id})
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
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
    |> Card.changeset(%{ name: "Test card", text: "Test text", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card2 = %Card{}
    |> Card.changeset(%{ name: "Test card 2", text: "Test text 2", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    cardProperty = %CardProperty{}
    |> CardProperty.changeset(%{ card_id: card.id, cardtype_property_id: cardTypeProperty.id, value_string: "test", value_number: 1, value_boolean: true })
    |> Repo.insert!()

    {:ok, cardProperty: cardProperty, cardTypeProperty: cardTypeProperty, cardTypeProperty2: cardTypeProperty2, cardType: cardType, game: game, card: card, card2: card2, player_property: player_property, game_rule: game_rule, game_rule2: game_rule2}
  end

  test "GET /api/playerProperties returns a list of player properties", %{conn: conn, player_property: player_property} do
    conn = get(conn, "/api/playerProperties")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn cp -> cp["id"] == player_property.id end)
    assert Enum.any?(response, fn cp -> cp["property_name"] == player_property.property_name end)
    assert Enum.any?(response, fn cp -> cp["value"] == player_property.value end)
    assert Enum.any?(response, fn cp -> cp["game_rule_id"] == player_property.game_rule_id end)
  end

  test "GET /api/playerProperties/:id returns a single player property", %{conn: conn, player_property: player_property} do
    conn = get(conn, "/api/playerProperties/#{player_property.id}")
    response = json_response(conn, 200)

    assert response["id"] == player_property.id
    assert response["property_name"] == player_property.property_name
    assert response["value"] == player_property.value
    assert response["game_rule_id"] == player_property.game_rule_id
  end

  test "POST /api/playerProperties creates a new player property", %{conn: conn, player_property: player_property, game_rule2: game_rule2} do
    conn = post(conn, "/api/playerProperties", %{
      "playerProperty" => %{
        "game_rule_id" => game_rule2.id,
        "property_name" => "defense",
        "value" => 23
      }
    })
    response = json_response(conn, 201)

    assert response["game_rule_id"] == game_rule2.id
    assert response["property_name"] == "defense"
    assert response["value"] == 23
  end

   test "PUT /api/playerProperties/:id updates a player property", %{conn: conn, player_property: player_property} do
    conn = put(conn, "/api/playerProperties/#{player_property.id}", %{
      "playerProperty" => %{
        "value" => 23,
      }
    })
    response = json_response(conn, 200)

    assert response["id"] == player_property.id
    assert response["value"] == 23
  end

  test "DELETE /api/playerProperties/delete/:id deletes a player property", %{conn: conn, player_property: player_property} do
    conn = delete(conn, "/api/playerProperties/delete/#{player_property.id}")
    assert response(conn, 204)

    assert_raise Ecto.NoResultsError, fn ->
      Repo.get!(PlayerProperty, player_property.id)
    end
  end

  test "GET /api/playerProperties/playerProperty/:game_rule_id returns player properties by game rule ID", %{conn: conn, player_property: player_property} do
    conn = get(conn, "/api/playerProperties/playerProperty/#{player_property.game_rule_id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn pp -> pp["id"] == player_property.id end)
    assert Enum.any?(response, fn pp -> pp["property_name"] == player_property.property_name end)
    assert Enum.any?(response, fn pp -> pp["value"] == player_property.value end)
    assert Enum.any?(response, fn pp -> pp["game_rule_id"] == player_property.game_rule_id end)
  end
end
