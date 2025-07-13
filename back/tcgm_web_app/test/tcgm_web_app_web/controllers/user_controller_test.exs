defmodule TcgmWebAppWeb.UserControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.Repo

  @valid_attrs %{ username: "John Doe", password: "jd", email: "john.doe@gmail.com"}
  @create_attrs %{ username: "Jane Doe" , password: "test", email: "jane.doe@gmail.com"}
  @invalid_attrs %{ username: "" }

  setup do
    {:ok, user2} = TcgmWebApp.Accounts.create_user(%{username: "test", email: "a@b.com", password: "pass123"})

    {:ok, token, _claims} = TcgmWebApp.Guardian.encode_and_sign(user2)

    user = %User{}
    |> User.changeset(@valid_attrs)
    |> Repo.insert!()

    {:ok, user: user, user2: user2, token: token}
  end

  test "GET /api/users returns a list of users", %{conn: conn, user2: user2, token: token} do
    conn =
      conn
      |> put_req_header("authorization", "Bearer #{token}")
      |> get("/api/users")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn u -> u["username"] == user2.username end)
  end

  test "GET /api/users/:id returns a single user", %{conn: conn, user2: user2, token: token} do
    conn =
      conn
      |> put_req_header("authorization", "Bearer #{token}")
      |> get("/api/users/#{user2.id}")
    response = json_response(conn, 200)

    assert response["id"] == user2.id
    assert response["username"] == user2.username
  end

  test "POST /api/users creates a new user", %{conn: conn} do
    conn = post(conn, "/api/users", user: @create_attrs)
    response = json_response(conn, 201)

    assert Map.has_key?(response, "token") == true
    token = response["token"]
    assert is_binary(token)
    assert {:ok, _} = TcgmWebApp.Guardian.decode_and_verify(token)
    user_id = response["user"]["id"] |> to_string()
    assert {:ok, %{"sub" => ^user_id}} = TcgmWebApp.Guardian.decode_and_verify(token)
    assert response["user"]["username"] == @create_attrs.username
    assert Repo.get_by(User, username: @create_attrs[:username])
  end

  test "POST /api/users returns errors when data is invalid", %{conn: conn} do
    conn = post(conn, "/api/users", user: @invalid_attrs)
    assert json_response(conn, 422)["errors"]
  end

  test "PUT /api/users/:id updates an existing user", %{conn: conn, user2: user2, token: token} do
    update_attrs = %{username: "usernamee", password: user2.password}
    conn =
      conn
      |> put_req_header("authorization", "Bearer #{token}")
      |> put("/api/users/#{user2.id}", %{"user" => update_attrs})
    response = json_response(conn, 200)

    assert response["username"] == "usernamee"
    assert Repo.get!(User, user2.id).username == "usernamee"
  end

  test "DELETE /api/users/:id deletes an existing user", %{conn: conn, user2: user2, token: token} do
    conn =
      conn
      |> put_req_header("authorization", "Bearer #{token}")
      |> delete("/api/users/delete/#{user2.id}")
    assert response(conn, 204) == ""

    assert Repo.get(User, user2.id) == nil
  end

  test "POST /api/users/login authenticates a user", %{conn: conn, user: user} do
    conn = post(conn, "/api/users/login", user: %{username: user.username, password: user.password})
    response = json_response(conn, 200)

    assert Map.has_key?(response, "token") == true
    token = response["token"]
    assert is_binary(token)
    assert {:ok, _} = TcgmWebApp.Guardian.decode_and_verify(token)
    user_id = response["user"]["id"] |> to_string()
    assert {:ok, %{"sub" => ^user_id}} = TcgmWebApp.Guardian.decode_and_verify(token)
    assert response["user"]["id"] == user.id
    assert response["user"]["username"] == user.username
  end

end
