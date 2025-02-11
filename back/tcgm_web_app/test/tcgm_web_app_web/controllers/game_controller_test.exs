defmodule TcgmWebAppWeb.GameControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Repo

  @valid_attrs %{ name: "Test game", description: "Test description" }
  @create_attrs %{ name: "Test game 2", description: "Test description 2" }
  @invalid_attrs %{ name: "", description: "" }

  setup do
    game = %Game{}
    |> Game.changeset(@valid_attrs)
    |> Repo.insert!()

    {:ok, game: game}
  end

  test "GET /api/games returns a list of games", %{conn: conn, game: game} do
    conn = get(conn, "/api/games")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn a -> a["name"] == game.name end)
    assert Enum.any?(response, fn a -> a["description"] == game.description end)
  end

  test "GET /api/games/:id returns a single game", %{conn: conn, game: game} do
    conn = get(conn, "/api/games/#{game.id}")
    response = json_response(conn, 200)

    assert response["id"] == game.id
    assert response["name"] == game.name
    assert response["description"] == game.description
  end

  test "GET /api/games/name/:name returns a single game", %{conn: conn, game: game} do
    conn = get(conn, "/api/games/name/#{game.name}")
    response = json_response(conn, 200)

    assert response["id"] == game.id
    assert response["name"] == game.name
    assert response["description"] == game.description
  end

  test "POST /api/games creates a new game", %{conn: conn} do
    conn = post(conn, "/api/games", game: @create_attrs)
    response = json_response(conn, 201)

    assert response["name"] == @create_attrs.name
    assert response["description"] == @create_attrs.description
    assert Repo.get_by(Game, name: @create_attrs[:name])
  end

  test "POST /api/games returns errors when data is invalid", %{conn: conn} do
    conn = post(conn, "/api/games", game: @invalid_attrs)
    assert json_response(conn, 422)["errors"]
  end

  test "PUT /api/games/:id updates an existing game", %{conn: conn, game: game} do
    update_attrs = %{name: "namee", description: "descriptione"}

    conn = put(conn, "/api/games/#{game.id}", %{"game" => update_attrs})
    response = json_response(conn, 200)

    assert response["name"] == "namee"
    assert response["description"] == "descriptione"
    gamee = Repo.get!(Game, game.id)

    assert gamee.name == "namee"
    assert gamee.description == "descriptione"
  end

  test "DELETE /api/games/:id deletes an existing game", %{conn: conn, game: game} do
    conn = delete(conn, "/api/games/delete/#{game.id}")
    assert response(conn, 204) == ""

    assert Repo.get(Game, game.id) == nil
  end
end
