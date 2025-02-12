defmodule TcgmWebAppWeb.EffectControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    action = %Action{}
    |> Action.changeset(%{ name: "Test action", description: "Test description", game_id: game.id })
    |> Repo.insert!()

    effect = %Effect{}
    |> Effect.changeset(%{ description: "Test description", action_ids: [action.id], game_id: game.id })
    |> Repo.insert!()

    {:ok, effect: effect, game: game, action: action}
  end

  test "GET /api/effects returns a list of effects", %{conn: conn, effect: effect} do
    conn = get(conn, "/api/effects")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn e -> e["description"] == effect.description end)
    assert Enum.any?(response, fn e -> e["action_ids"] == effect.action_ids end)
    assert Enum.any?(response, fn e -> e["game_id"] == effect.game_id end)
  end

  test "GET /api/effects/:id returns a single effect", %{conn: conn, effect: effect} do
    conn = get(conn, "/api/effects/#{effect.id}")
    response = json_response(conn, 200)

    assert response["id"] == effect.id
    assert response["description"] == effect.description
    assert response["action_ids"] == effect.action_ids
    assert response["game_id"] == effect.game_id
  end

  test "GET /api/effects/game/:game_id returns a list of effects by game_id", %{conn: conn, effect: effect, game: game} do
    conn = get(conn, "/api/effects/game/#{game.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn e -> e["description"] == effect.description end)
    assert Enum.any?(response, fn e -> e["action_ids"] == effect.action_ids end)
    assert Enum.any?(response, fn e -> e["game_id"] == effect.game_id end)
  end

  test "POST /api/effects creates a new effect", %{conn: conn, game: game, action: action} do
    attrs = %{ description: "Test description 2", action_ids: [action.id], game_id: game.id }
    conn = post(conn, "/api/effects", effect: attrs)
    response = json_response(conn, 201)

    assert response["id"]
    assert response["description"] == "Test description 2"
    assert response["action_ids"] == [action.id]
    assert response["game_id"] == game.id
  end

  test "PUT /api/effects/:id updates an existing effect", %{conn: conn, effect: effect, game: game, action: action} do
    attrs = %{ description: "Test description 3", action_ids: [action.id], game_id: game.id }
    conn = put(conn, "/api/effects/#{effect.id}", effect: attrs)
    response = json_response(conn, 200)

    assert response["id"] == effect.id
    assert response["description"] == "Test description 3"
    assert response["action_ids"] == [action.id]
    assert response["game_id"] == game.id
  end

  test "DELETE /api/effects/:id deletes an existing effect", %{conn: conn, effect: effect} do
    conn = delete(conn, "/api/effects/delete/#{effect.id}")
    assert response(conn, 204) == ""

    assert Repo.get(Effect, effect.id) == nil
  end
end
