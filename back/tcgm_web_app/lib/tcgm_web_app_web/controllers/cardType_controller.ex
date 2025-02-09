defmodule TcgmWebAppWeb.CardTypeController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.CardTypes.CardTypes
  alias TcgmWebAppWeb.Helpers
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/cardTypes")
    description("List all cardTypes")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    cardTypes = CardTypes.list_cardTypes()
    json(conn, cardTypes)
  end

  swagger_path :show do
    get("/cardTypes/{id}")
    description("Get a cardType by ID")
    parameter("id", :path, :integer, "CardType ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "CardType not found")
  end

  def show(conn, %{"id" => id}) do
    cardType = CardTypes.get_cardType!(id)
    json(conn, cardType)
  end

  swagger_path :create do
    post("/cardTypes")
    description("Create a new cardType")
    parameter(:body, :body, Schema.ref(:CardTypeRequest), "CardType request payload", required: true)
    response(code(:created), "CardType created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"cardType" => cardType_params}) do
    case CardTypes.create_cardType(cardType_params) do
      {:ok, cardType} ->
        conn
        |> put_status(:created)
        |> json(cardType)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  swagger_path :update do
    put("/cardTypes/{id}")
    description("Update a cardType by ID")
    parameter("id", :path, :integer, "CardType ID", required: true)
    parameter(:body, :body, Schema.ref(:CardTypeRequest), "CardType request payload", required: true)
    response(code(:ok), "CardType updated")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "cardType" => cardType_params}) do
    cardType = CardTypes.get_cardType!(id)
    case CardTypes.update_cardType(cardType, cardType_params) do
      {:ok, cardType} ->
        json(conn, cardType)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  swagger_path :delete do
    delete("/cardTypes/{id}")
    description("Delete a cardType by ID")
    parameter("id", :path, :integer, "CardType ID", required: true)
    response(code(:no_content), "CardType deleted")
  end

  def delete_cardType(conn, %{"id" => id}) do
    cardType = CardTypes.get_cardType!(id)

    CardTypes.delete_cardType!(cardType)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_cardTypes_by_game_id do
    get("/cardTypes/game/{game_id}")
    description("Get cardTypes by game ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "No cardTypes found for game ID")
    response(code(:unprocessable_entity), "Could not retrieve cardTypes by game ID")
  end

  def get_cardTypes_by_game_id(conn, %{"game_id" => game_id}) do
    case CardTypes.get_cardTypes_by_game_id(game_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "No cardTypes found for game ID #{game_id}"})

      cardTypes when is_list(cardTypes) ->
        conn
        |> put_status(:ok)
        |> json(cardTypes)

      cardTypes ->
        IO.inspect(cardTypes, label: "cardTypes")
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not retrieve cardTypes by game ID"})
    end
  end

end
