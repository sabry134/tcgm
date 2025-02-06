defmodule TcgmWebAppWeb.UserControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.Repo

  @valid_attrs %{ username: "John Doe" }
  @create_attrs %{ username: "Jane Doe" }
  @invalid_attrs %{ username: "" }

  setup do
    user = %User{}
    |> User.changeset(@valid_attrs)
    |> Repo.insert!()

    {:ok, user: user}
  end

  test "GET /api/users returns a list of users", %{conn: conn, user: user} do
    conn = get(conn, "/api/users")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn u -> u["username"] == user.username end)
  end

  test "GET /api/users/:id returns a single user", %{conn: conn, user: user} do
    conn = get(conn, "/api/users/#{user.id}")
    response = json_response(conn, 200)

    assert response["id"] == user.id
    assert response["username"] == user.username
  end

  test "POST /api/users creates a new user", %{conn: conn} do
    conn = post(conn, "/api/users", user: @create_attrs)
    response = json_response(conn, 201)

    assert response["username"] == @create_attrs.username
    assert Repo.get_by(User, username: @create_attrs[:username])
  end

  test "POST /api/users returns errors when data is invalid", %{conn: conn} do
    conn = post(conn, "/api/users", user: @invalid_attrs)
    assert json_response(conn, 422)["errors"]
  end

  test "PUT /api/users/:id updates an existing user", %{conn: conn, user: user} do
    update_attrs = %{username: "usernamee"}

    conn = put(conn, "/api/users/#{user.id}", %{"user" => update_attrs})
    response = json_response(conn, 200)

    assert response["username"] == "usernamee"
    assert Repo.get!(User, user.id).username == "usernamee"
  end

  test "DELETE /api/users/:id deletes an existing user", %{conn: conn, user: user} do
    conn = delete(conn, "/api/users/#{user.id}")
    assert response(conn, 204) == ""

    assert Repo.get(User, user.id) == nil
  end

  test "POST /api/users/login authenticates a user", %{conn: conn, user: user} do
    conn = post(conn, "/api/users/login", user: %{username: user.username})
    response = json_response(conn, 200)

    assert response["id"] == user.id
    assert response["username"] == user.username
  end

end
