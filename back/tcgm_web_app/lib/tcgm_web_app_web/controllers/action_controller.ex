defmodule TcgmWebAppWeb.ActionController do
  use TcgmWebAppWeb, :controller

  alias TcgmWebApp.Actions.Actions
  alias TcgmWebAppWeb.Helpers

  def index(conn, _params) do
    actions = Actions.list_actions()
    json(conn, actions)
  end

  def show(conn, %{"id" => id}) do
    action = Actions.get_action!(id)
    json(conn, action)
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

  def delete(conn, %{"id" => id}) do
    action = Actions.get_action!(id)
    Actions.delete_action!(action)

    send_resp(conn, :no_content, "")
  end

  def get_action_by_name(conn, %{"name" => name}) do
    action = Actions.get_action_by_name(name)
    json(conn, action)
  end
end
