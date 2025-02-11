defmodule TcgmWebAppWeb.ActionControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Repo

  @valid_attrs %{ name: "Test action", description: "Test description" }
  @create_attrs %{ name: "Test action 2", description: "Test description 2" }
  @invalid_attrs %{ name: "", description: "" }

  setup do
    action = %Action{}
    |> Action.changeset(@valid_attrs)
    |> Repo.insert!()

    {:ok, action: action}
  end

  test "GET /api/actions returns a list of actions", %{conn: conn, action: action} do
    conn = get(conn, "/api/actions")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn a -> a["name"] == action.name end)
    assert Enum.any?(response, fn a -> a["description"] == action.description end)
  end

  test "GET /api/actions/:id returns a single action", %{conn: conn, action: action} do
    conn = get(conn, "/api/actions/#{action.id}")
    response = json_response(conn, 200)

    assert response["id"] == action.id
    assert response["name"] == action.name
    assert response["description"] == action.description
  end

  test "GET /api/actions/:name returns a single action", %{conn: conn, action: action} do
    conn = get(conn, "/api/actions/name/#{action.name}")
    response = json_response(conn, 200)

    assert response["id"] == action.id
    assert response["name"] == action.name
    assert response["description"] == action.description
  end

  test "POST /api/actions creates a new action", %{conn: conn} do
    conn = post(conn, "/api/actions", action: @create_attrs)
    response = json_response(conn, 201)

    assert response["name"] == @create_attrs.name
    assert response["description"] == @create_attrs.description
    assert Repo.get_by(Action, name: @create_attrs[:name])
  end

  test "POST /api/actions returns errors when data is invalid", %{conn: conn} do
    conn = post(conn, "/api/actions", action: @invalid_attrs)
    assert json_response(conn, 422)["errors"]
  end

  test "PUT /api/actions/:id updates an existing action", %{conn: conn, action: action} do
    update_attrs = %{name: "namee", description: "descriptione"}

    conn = put(conn, "/api/actions/#{action.id}", %{"action" => update_attrs})
    response = json_response(conn, 200)

    assert response["name"] == "namee"
    assert response["description"] == "descriptione"

    actione = Repo.get!(Action, action.id)

    assert actione.name == "namee"
    assert actione.description == "descriptione"
  end

  test "DELETE /api/actions/:id deletes an existing action", %{conn: conn, action: action} do
    conn = delete(conn, "/api/actions/delete/#{action.id}")
    assert response(conn, 204) == ""

    assert Repo.get(Action, action.id) == nil
  end
end
