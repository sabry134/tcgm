defmodule TcgmWebAppWeb.GameControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.UserGameRoles.UserGameRole
  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.Repo

  @valid_attrs %{ name: "Test game", description: "Test description" }
  @create_attrs %{ name: "Test game 2", description: "Test description 2" }
  @invalid_attrs %{ name: "", description: "" }

  setup do
    game = %Game{}
    |> Game.changeset(@valid_attrs)
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
    |> Repo.insert!()

    user = %User{}
    |> User.changeset(%{ username: "testuser", password: "jd", email: "john.doe@gmail.com"})
    |> Repo.insert!()

    userGameRole = %UserGameRole{}
    |> UserGameRole.changeset(%{ role_name: "subscriber", user_id: user.id, game_id: game.id })
    |> Repo.insert!()

    {:ok, game: game, cardType: cardType, user: user, userGameRole: userGameRole}
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

  test "GET /api/games/{role_name}/user{user_id} returns games by user role", %{conn: conn, game: game, user: user, userGameRole: userGameRole} do
    conn = get(conn, "/api/games/role/#{userGameRole.role_name}/user/#{user.id}")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn g -> g["id"] == game.id end)
  end

  test "GET /api/games/{game_id}/user/{user_id}/roles returns user roles for a specific game", %{conn: conn, game: game, user: user} do
    conn = get(conn, "/api/games/#{game.id}/user/#{user.id}/roles")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn r -> r == "subscriber" end)
  end

  test "POST /api/games/{game_id}/user/{user_id}/role creates a new user role for a game", %{conn: conn, game: game, user: user} do
    role_name = "creator"
    conn = post(conn, "/api/games/#{game.id}/user/#{user.id}/role", role_name: role_name)
    response = json_response(conn, 201)

    assert response["role_name"] == "creator"
    assert response["user_id"] == user.id
    assert response["game_id"] == game.id
  end
end
