defmodule TcgmWebAppWeb.GameController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Games.Games
  alias TcgmWebApp.UserGameRoles.UserGameRoles
  alias TcgmWebAppWeb.Helpers
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/games")
    description("List all games")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    games = Games.list_games()
    json(conn, games)
  end

  swagger_path :show do
    get("/games/{id}")
    description("Get a game by ID")
    parameter("id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Game not found")
  end

  def show(conn, %{"id" => id}) do
    game = Games.get_game!(id)
    json(conn, game)
  end

  swagger_path :get_game_by_name do
    get("/games/{name}")
    description("Get a game by name")
    parameter("name", :path, :string, "Game name", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Game not found")
  end

  def get_game_by_name(conn, %{"name" => name}) do
    game = Games.get_game_by_name(name)
    json(conn, game)
  end

  swagger_path :create do
    post("/games")
    description("Create a new game")
    parameter(:body, :body, Schema.ref(:GameRequest), "Game request payload", required: true)
    response(code(:created), "Game created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"game" => game_params}) do
    case Games.create_game(game_params) do
      {:ok, game} ->
        conn
        |> put_status(:created)
        |> json(game)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  swagger_path :update do
    put("/games/{id}")
    description("Update a game by ID")
    parameter("id", :path, :integer, "Game ID", required: true)
    parameter(:body, :body, Schema.ref(:GameRequest), "Game request payload", required: true)
    response(code(:ok), "Game updated")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "game" => game_params}) do
    game = Games.get_game!(id)
    case Games.update_game(game, game_params) do
      {:ok, game} ->
        json(conn, game)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  swagger_path :delete do
    delete("/games/{game_id}")
    description("Delete a game by ID")
    parameter("id", :path, :integer, "Game ID", required: true)
    response(code(:no_content), "Game deleted")
  end

  def delete_game(conn, %{"game_id" => id}) do
    game = Games.get_game!(id)

    Games.delete_game!(game)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_games_by_role_and_user_id do
    get("/games/role/{role_name}/user/{user_id}")
    description("Get games by subscribed user ID")
    parameter("role_name", :path, :string, "Role Name", required: true)
    parameter("subscriber_id", :path, :integer, "User ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Subscriber not found")
  end

  def get_games_by_role_and_user_id(conn, %{"role_name" => role, "user_id" => user_id}) do
    existing_roles = [
      "editor",
      "subscriber",
      "creator"
    ]

    if Enum.member?(existing_roles, role) do
      games = UserGameRoles.list_user_game_roles_by_user_and_role(user_id, role)
      |> Enum.map(fn role -> Games.get_game!(role.game_id) end)
      json(conn, games)
    else
      conn
      |> put_status(:bad_request)
      |> json(%{error: "Invalid role name"})
    end
  end

  swagger_path :get_user_role_for_game do
    get("/games/{game_id}/user/{user_id}/roles")
    description("Get user roles for a specific game")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    parameter("user_id", :path, :integer, "User ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "User or Game not found")
  end

  def get_user_roles_for_game(conn, %{"game_id" => game_id, "user_id" => user_id}) do
    case UserGameRoles.list_user_game_roles_by_game_and_user(game_id, user_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "User or Game not found"})
      roles ->
        role_names = Enum.map(roles, & &1.role_name)
        json(conn, role_names)
    end
  end

  swagger_path :grant_role_to_user do
    post("/games/{game_id}/user/{user_id}/role")
    description("Grant a role to a user for a specific game")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    parameter("user_id", :path, :integer, "User ID", required: true)
    parameter(:body, :body, Schema.ref(:UserGameRoleRequest), "User Game Role request payload", required: true)
    response(code(:created), "Role granted")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def grant_role_to_user(conn, %{"game_id" => game_id, "user_id" => user_id, "role_name" => role_name}) do
    existing_roles = [
      "editor",
      "subscriber",
      "creator"
    ]
    if !Enum.member?(existing_roles, role_name) do
      conn
      |> put_status(:bad_request)
      |> json(%{error: "Invalid role name"})
    else
      case UserGameRoles.create_user_game_role(%{game_id: game_id, user_id: user_id, role_name: role_name}) do
        {:ok, user_game_role} ->
          conn
          |> put_status(:created)
          |> json(user_game_role)
        {:error, %Ecto.Changeset{} = changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> json(%{errors: Helpers.translate_errors(changeset)})
      end
    end
  end
end
