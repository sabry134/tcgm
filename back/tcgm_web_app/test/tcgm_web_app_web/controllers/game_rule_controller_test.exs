defmodule TcgmWebAppWeb.GameRuleControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.CardProperties.CardProperty
  alias TcgmWebApp.Games.Game
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

    game2 = %Game{}
    |> Game.changeset(%{ name: "Test game 2", description: "Test description 2" })
    |> Repo.insert!()

    game_rule = %GameRule{}
    |> GameRule.changeset(%{starting_hand_size: 2, min_deck_size: 3, max_deck_size: 3, max_hand_size: 7, draw_per_turn: 9, game_id: game.id})
    |> Repo.insert!()

    game_rule2 = %GameRule{}
    |> GameRule.changeset(%{starting_hand_size: 2, min_deck_size: 3, max_deck_size: 3, max_hand_size: 7, draw_per_turn: 9, game_id: game.id, public_template: true})
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

    {:ok, cardProperty: cardProperty, cardTypeProperty: cardTypeProperty, cardTypeProperty2: cardTypeProperty2, cardType: cardType, game: game, card: card, card2: card2, game_rule: game_rule, game2: game2}
  end

  test "GET /api/gameRules returns a list of game rules", %{conn: conn, game_rule: game_rule} do
    conn = get(conn, "/api/gameRules")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn gr -> gr["id"] == game_rule.id end)
    assert Enum.any?(response, fn gr -> gr["game_id"] == game_rule.game_id end)
    assert Enum.any?(response, fn gr -> gr["starting_hand_size"] == game_rule.starting_hand_size end)
    assert Enum.any?(response, fn gr -> gr["min_deck_size"] == game_rule.min_deck_size end)
    assert Enum.any?(response, fn gr -> gr["max_deck_size"] == game_rule.max_deck_size end)
    assert Enum.any?(response, fn gr -> gr["max_hand_size"] == game_rule.max_hand_size end)
    assert Enum.any?(response, fn gr -> gr["draw_per_turn"] == game_rule.draw_per_turn end)
  end

  test "GET /api/gameRules/:id returns a single game rule", %{conn: conn, game_rule: game_rule} do
    conn = get(conn, "/api/gameRules/#{game_rule.id}")
    response = json_response(conn, 200)

    assert response["id"] == game_rule.id
    assert response["game_id"] == game_rule.game_id
    assert response["starting_hand_size"] == game_rule.starting_hand_size
    assert response["min_deck_size"] == game_rule.min_deck_size
    assert response["max_deck_size"] == game_rule.max_deck_size
    assert response["max_hand_size"] == game_rule.max_hand_size
    assert response["draw_per_turn"] == game_rule.draw_per_turn
  end

  test "POST /api/gameRules creates a new game rule", %{conn: conn, game_rule: game_rule, game2: game2} do
    conn = post(conn, "/api/gameRules", %{
      "gameRule" => %{
        "game_id" => game2.id,
        "starting_hand_size" => 4,
        "min_deck_size" => 5,
        "max_deck_size" => 6,
        "max_hand_size" => 9,
        "draw_per_turn" => 10
      }
    })
    response = json_response(conn, 201)

    assert response["game_id"] == game2.id
    assert response["starting_hand_size"] == 4
    assert response["min_deck_size"] == 5
    assert response["max_deck_size"] == 6
    assert response["max_hand_size"] == 9
    assert response["draw_per_turn"] == 10
  end

  test "PUT /api/gameRules/:id updates a game rule", %{conn: conn, game_rule: game_rule} do
    conn = put(conn, "/api/gameRules/#{game_rule.id}", %{
      "gameRule" => %{
        "starting_hand_size" => 4,
        "min_deck_size" => 5,
        "max_deck_size" => 6,
        "max_hand_size" => 9,
        "draw_per_turn" => 10
      }
    })
    response = json_response(conn, 200)

    assert response["id"] == game_rule.id
    assert response["starting_hand_size"] == 4
    assert response["min_deck_size"] == 5
    assert response["max_deck_size"] == 6
    assert response["max_hand_size"] == 9
    assert response["draw_per_turn"] == 10
  end

  test "DELETE /api/gameRules/delete/:id deletes a game rule", %{conn: conn, game_rule: game_rule} do
    conn = delete(conn, "/api/gameRules/delete/#{game_rule.id}")
    assert response(conn, 204)

    assert_raise Ecto.NoResultsError, fn ->
      Repo.get!(GameRule, game_rule.id)
    end
  end

  test "GET /api/gameRules/gameRule/:game_id returns game rule by game ID", %{conn: conn, game_rule: game_rule} do
    conn = get(conn, "/api/gameRules/gameRule/#{game_rule.game_id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn gr -> gr["id"] == game_rule.id end)
    assert Enum.any?(response, fn gr -> gr["game_id"] == game_rule.game_id end)
    assert Enum.any?(response, fn gr -> gr["starting_hand_size"] == game_rule.starting_hand_size end)
    assert Enum.any?(response, fn gr -> gr["min_deck_size"] == game_rule.min_deck_size end)
    assert Enum.any?(response, fn gr -> gr["max_deck_size"] == game_rule.max_deck_size end)
    assert Enum.any?(response, fn gr -> gr["max_hand_size"] == game_rule.max_hand_size end)
    assert Enum.any?(response, fn gr -> gr["draw_per_turn"] == game_rule.draw_per_turn end)
  end

  test "GET /api/gameRules/templates returns public game rule templates", %{conn: conn} do
    conn = get(conn, "/api/gameRules/templates")
    response = json_response(conn, 200)

    assert is_list(response)
    assert length(response) > 0
    assert Enum.all?(response, fn template -> Map.has_key?(template, "id") end)
  end
end
