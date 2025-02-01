defmodule TcgmWebAppWeb.EffectController do
  use TcgmWebAppWeb, :controller

  alias TcgmWebApp.Effects.Effects

  def index(conn, _params) do
    effects = Effects.list_effects()
    json(conn, effects)
  end

  def show(conn, %{"id" => id}) do
    effect = Effects.get_effect!(id)
    json(conn, effect)
  end

  def create(conn, %{"effect" => effect_params}) do
    case Effects.create_effect(effect_params) do
      {:ok, effect} ->
        conn
        |> put_status(:created)
        |> json(effect)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  def update(conn, %{"id" => id, "effect" => effect_params}) do
    effect = Effects.get_effect!(id)
    case Effects.update_effect(effect, effect_params) do
      {:ok, effect} ->
        json(conn, effect)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    effect = Effects.get_effect!(id)

    case Effects.delete_effect!(effect) do
      {:ok, _effect} ->
        send_resp(conn, :no_content, "")

      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not delete effect"})
    end
  end

  def get_effects_by_game_id(conn, %{"game_id" => game_id}) do
    case Effects.get_effects_by_game_id(game_id) do
      {:ok, effects} ->
        conn
        |> put_status(:ok)
        |> json(effects)
      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not get effects by game id"})
    end
  end
end
