defmodule TcgmWebAppWeb.ActionController do
  use TcgmWebAppWeb, :controller

  alias TcgmWebApp.Actions.Actions

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
        |> json(changeset)
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
        |> json(changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    action = Actions.get_action!(id)

    case Actions.delete_action!(action) do
      {:ok, _action} ->
        send_resp(conn, :no_content, "")

      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not delete action"})
    end
  end
end
