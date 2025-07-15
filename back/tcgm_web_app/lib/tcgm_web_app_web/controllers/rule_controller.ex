defmodule TcgmWebAppWeb.RuleController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Rules.Rules
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/rules")
    description("List all rules")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    rules = Rules.list_rules()
    json(conn, rules)
  end

  swagger_path :show do
    get("/rules/{id}")
    description("Get a rule by ID")
    parameter("id", :path, :integer, "rule ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "rule not found")
  end

  def show(conn, %{"id" => id}) do
    rule = Rules.get_rule!(id)
    json(conn, rule)
  end

  swagger_path :create do
    post("/rules")
    description("Create a new rule")
    parameter(:body, :body, Schema.ref(:RuleRequest), "rule request payload", required: true)
    response(code(:created), "rule created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"rule" => rule_params}) do
    case Rules.create_rule(rule_params) do
      {:ok, rule_params} ->
        conn
        |> put_status(:created)
        |> json(rule_params)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update do
    put("/rules/{id}")
    description("Update a rule by ID")
    parameter("id", :path, :string, "Card property ID", required: true)
    parameter(:body, :body, Schema.ref(:RuleRequest), "rule request payload", required: true)
    response(code(:ok), "rule updated")
    response(code(:not_found), "rule not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "rule" => rule_params}) do
    rule = Rules.get_rule!(id)

    case Rules.update_rule(rule, rule_params) do
      {:ok, rule} ->
        json(conn, rule)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/rules/delete/{id}")
    description("Delete a rule by ID")
    parameter("id", :path, :integer, "Rule ID", required: true)
    response(code(:no_content), "Rule deleted")
    response(code(:not_found), "Rule not found")
  end

  def delete_rule(conn, %{"rule_id" => id}) do
    rule = Rules.get_rule!(id)

    Rules.delete_rule!(rule)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_rules_by_game_rule_id do
    get("/rules/rule/{game_rule_id}")
    description("Get rules by game rule ID")
    parameter("game_rule_id", :path, :integer, "Game rule ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "rules not found")
  end

  def get_rules_by_game_rule_id(conn, %{"game_rule_id" => game_rule_id}) do
    case Rules.get_rules_by_game_rule_id(game_rule_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      rules ->
        json(conn, rules)
    end
  end
end
