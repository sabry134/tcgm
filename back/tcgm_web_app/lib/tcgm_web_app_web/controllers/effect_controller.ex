defmodule TcgmWebAppWeb.EffectController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Effects.Effects
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/effects")
    description("List all effects")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    effects = Effects.list_effects()
    json(conn, effects)
  end

  swagger_path :show do
    get("/effects/{id}")
    description("Get an effect by ID")
    parameter("id", :path, :integer, "Effect ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Effect not found")
  end

  def show(conn, %{"id" => id}) do
    effect = Effects.get_effect!(id)
    json(conn, effect)
  end

  swagger_path :create do
    post("/effects")
    description("Create a new effect")
    parameter(:body, :body, Schema.ref(:EffectRequest), "Effect request payload", required: true)
    response(code(:created), "Effect created")
    response(code(:unprocessable_entity), "Invalid parameters")
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

  swagger_path :update do
    put("/effects/{id}")
    description("Update an effect by ID")
    parameter("id", :path, :integer, "Effect ID", required: true)
    parameter(:body, :body, Schema.ref(:EffectRequest), "Effect request payload", required: true)
    response(code(:ok), "Effect updated")
    response(code(:unprocessable_entity), "Invalid parameters")
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

  swagger_path :delete do
    delete("/effects/{effect_id}")
    description("Delete an effect by ID")
    parameter("id", :path, :integer, "Effect ID", required: true)
    response(code(:no_content), "Effect deleted")
  end

  def delete_effect(conn, %{"effect_id" => id}) do
    effect = Effects.get_effect!(id)

    Effects.delete_effect!(effect)
    send_resp(conn, :no_content, "")

  end

  swagger_path :get_effects_by_game_id do
    get("/effects/game/{game_id}")
    description("Get effects by game ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Effects not found")
    response(code(:unprocessable_entity), "Could not retrieve effects by game ID")
  end

  def get_effects_by_game_id(conn, %{"game_id" => game_id}) do
    case Effects.get_effects_by_game_id(game_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "No effects found for game ID #{game_id}"})

      effects when is_list(effects) ->
        conn
        |> put_status(:ok)
        |> json(effects)

      _ ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not retrieve effects by game ID"})
    end
  end
end
