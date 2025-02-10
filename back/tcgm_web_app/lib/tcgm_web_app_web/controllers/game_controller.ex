defmodule TcgmWebAppWeb.GameController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Games.Games
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
end
