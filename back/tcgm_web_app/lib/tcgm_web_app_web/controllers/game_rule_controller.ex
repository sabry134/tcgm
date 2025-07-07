defmodule TcgmWebAppWeb.GameRuleController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.GameRules.GameRules
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/gameRules")
    description("List all game rules")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    game_rules = GameRules.list_game_rules()
    json(conn, game_rules)
  end

  swagger_path :show do
    get("/gameRules/{id}")
    description("Get a game rule by ID")
    parameter("id", :path, :integer, "game rule ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "game rule not found")
  end

  def show(conn, %{"id" => id}) do
    game_rule = GameRules.get_game_rule!(id)
    json(conn, game_rule)
  end

  swagger_path :create do
    post("/gameRules")
    description("Create a new game rule")
    parameter(:body, :body, Schema.ref(:GameRuleRequest), "Game rule request payload", required: true)
    response(code(:created), "Game rule created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"gameRule" => game_rule_params}) do
    case GameRules.create_game_rule(game_rule_params) do
      {:ok, game_rule_params} ->
        conn
        |> put_status(:created)
        |> json(game_rule_params)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update do
    put("/gameRules/{id}")
    description("Update a game rule by ID")
    parameter("id", :path, :string, "Game rule ID", required: true)
    parameter(:body, :body, Schema.ref(:GameRuleRequest), "Game rule request payload", required: true)
    response(code(:ok), "Game rule updated")
    response(code(:not_found), "Game rule not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "gameRule" => game_rule_params}) do
    game_rule = GameRules.get_game_rule!(id)

    case GameRules.update_game_rule(game_rule, game_rule_params) do
      {:ok, game_rule} ->
        json(conn, game_rule)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/gameRules/delete/{id}")
    description("Delete a game rule by ID")
    parameter("id", :path, :integer, "Game Rule ID", required: true)
    response(code(:no_content), "Game Rule deleted")
    response(code(:not_found), "Game Rule not found")
  end

  def delete_game_rule(conn, %{"game_rule_id" => id}) do
    game_rule = GameRules.get_game_rule!(id)

    GameRules.delete_game_rule!(game_rule)
    send_resp(conn, :no_content, "")
  end

    swagger_path :get_game_rules_by_game_id do
    get("/gameRules/gameRule/{game_id}")
    description("Get game rules by game ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "game rules not found")
  end

  def get_game_rules_by_game_id(conn, %{"game_id" => game_id}) do
    case GameRules.get_game_rules_by_game_id(game_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      game_rules ->
        json(conn, game_rules)
    end
  end
end
