defmodule TcgmWebAppWeb.RuleControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.CardProperties.CardProperty
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Rules.Rule
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

    rule = %Rule{}
    |> Rule.changeset(%{ rule_name: "number max of size hand",  value: 9, game_rule_id: game_rule.id})
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

    {:ok, cardProperty: cardProperty, cardTypeProperty: cardTypeProperty, cardTypeProperty2: cardTypeProperty2, cardType: cardType, game: game, card: card, card2: card2, rule: rule, game_rule: game_rule, game_rule2: game_rule2}
  end

  test "GET /api/rules returns a list of rules", %{conn: conn, rule: rule} do
    conn = get(conn, "/api/rules")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn r -> r["id"] == rule.id end)
    assert Enum.any?(response, fn r -> r["rule_name"] == rule.rule_name end)
    assert Enum.any?(response, fn r -> r["value"] == rule.value end)
    assert Enum.any?(response, fn r -> r["game_rule_id"] == rule.game_rule_id end)
  end

  test "GET /api/rules/:id returns a single rule", %{conn: conn, rule: rule} do
    conn = get(conn, "/api/rules/#{rule.id}")
    response = json_response(conn, 200)

    assert response["id"] == rule.id
    assert response["rule_name"] == rule.rule_name
    assert response["value"] == rule.value
    assert response["game_rule_id"] == rule.game_rule_id
  end

  test "POST /api/rules creates a new rule", %{conn: conn, rule: rule, game_rule2: game_rule2} do
    conn = post(conn, "/api/rules", %{
      "rule" => %{
        "game_rule_id" => game_rule2.id,
        "rule_name" => "nbr_of_card_in_hand",
        "value" => 3
      }
    })
    response = json_response(conn, 201)

    assert response["game_rule_id"] == game_rule2.id
    assert response["rule_name"] == "nbr_of_card_in_hand"
    assert response["value"] == 3
  end

   test "PUT /api/rules/:id updates a rule", %{conn: conn, rule: rule} do
    conn = put(conn, "/api/rules/#{rule.id}", %{
      "rule" => %{
        "rule_name" => "nbr_of_card_in_hand",
        "value" => 2,
      }
    })
    response = json_response(conn, 200)

    assert response["id"] == rule.id
    assert response["rule_name"] == "nbr_of_card_in_hand"
    assert response["value"] == 2
  end

  test "DELETE /api/rules/delete/:id deletes a rules", %{conn: conn, rule: rule} do
    conn = delete(conn, "/api/rules/delete/#{rule.id}")
    assert response(conn, 204)

    assert_raise Ecto.NoResultsError, fn ->
      Repo.get!(Rule, rule.id)
    end
  end

  test "GET /api/rules/rule/:game_rule_id returns rule by game rule ID", %{conn: conn, rule: rule} do
    conn = get(conn, "/api/rules/rule/#{rule.game_rule_id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn r -> r["id"] == rule.id end)
    assert Enum.any?(response, fn r -> r["game_rule_id"] == rule.game_rule_id end)
    assert Enum.any?(response, fn r -> r["rule_name"] == rule.rule_name end)
    assert Enum.any?(response, fn r -> r["value"] == rule.value end)
  end
end
