defmodule TcgmWebAppWeb.ActionController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Actions.Actions
  alias TcgmWebAppWeb.Helpers
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/actions")
    description("List all actions")
    response(code(:ok), "Success")
  end
  def index(conn, _params) do
    actions = Actions.list_actions()
    json(conn, actions)
  end

  swagger_path :show do
    get("/actions/{id}")
    description("Get an action by ID")
    parameter("id", :path, :integer, "Action ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Action not found")
  end
  def show(conn, %{"id" => id}) do
    action = Actions.get_action!(id)
    json(conn, action)
  end

  swagger_path :create do
    post("/actions")
    description("Create a new action")
    parameter(:body, :body, Schema.ref(:ActionRequest), "Action request payload", required: true)
    response(code(:created), "Action created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end
  def create(conn, %{"action" => action_params}) do
    case Actions.create_action(action_params) do
      {:ok, action} ->
        conn
        |> put_status(:created)
        |> json(action)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  swagger_path :update do
    put("/actions/{id}")
    description("Update an action by ID")
    parameter("id", :path, :integer, "Action ID", required: true)
    parameter(:body, :body, Schema.ref(:ActionRequest), "Action request payload", required: true)
    response(code(:ok), "Action updated")
    response(code(:unprocessable_entity), "Invalid parameters")
  end
  def update(conn, %{"id" => id, "action" => action_params}) do
    action = Actions.get_action!(id)
    case Actions.update_action(action, action_params) do
      {:ok, action} ->
        json(conn, action)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  swagger_path :delete do
    delete("/actions/{action_id}")
    description("Delete an action by ID")
    parameter("id", :path, :integer, "Action ID", required: true)
    response(code(:no_content), "Action deleted")
  end

  def delete_action(conn, %{"action_id" => id}) do
    action = Actions.get_action!(id)
    Actions.delete_action!(action)

    send_resp(conn, :no_content, "")
  end

  swagger_path :get_action_by_name do
    get("/actions/name/{name}")
    description("Get an action by name")
    parameter("name", :path, :string, "Action name", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Action not found")
  end
  def get_action_by_name(conn, %{"name" => name}) do
    action = Actions.get_action_by_name(name)
    json(conn, action)
  end
end
