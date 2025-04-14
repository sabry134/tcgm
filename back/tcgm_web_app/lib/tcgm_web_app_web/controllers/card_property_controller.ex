defmodule TcgmWebAppWeb.CardPropertyController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.CardProperties.CardProperties
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/cardProperties")
    description("List all card properties")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    card_properties = CardProperties.list_card_properties()
    json(conn, card_properties)
  end

  swagger_path :show do
    get("/cardProperties/{id}")
    description("Get a card property by ID")
    parameter("id", :path, :integer, "Card property ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card property not found")
  end

  def show(conn, %{"id" => id}) do
    card_property = CardProperties.get_card_property!(id)
    json(conn, card_property)
  end

  swagger_path :create do
    post("/cardProperties")
    description("Create a new card property")
    parameter(:body, :body, Schema.ref(:CardPropertyRequest), "Card property request payload", required: true)
    response(code(:created), "Card property created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"cardProperty" => card_property_params}) do
    case CardProperties.create_card_property(card_property_params) do
      {:ok, card_property} ->
        conn
        |> put_status(:created)
        |> json(card_property)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update do
    put("/cardProperties/{id}")
    description("Update a card property by ID")
    parameter("id", :path, :string, "Card property ID", required: true)
    parameter(:body, :body, Schema.ref(:CardPropertyRequest), "Card property request payload", required: true)
    response(code(:ok), "Card property updated")
    response(code(:not_found), "Card property not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "cardProperty" => card_property_params}) do
    card_property = CardProperties.get_card_property!(id)

    case CardProperties.update_card_property(card_property, card_property_params) do
      {:ok, card_property} ->
        json(conn, card_property)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/cardProperties/delete/{id}")
    description("Delete a card property by ID")
    parameter("id", :path, :integer, "Card property ID", required: true)
    response(code(:no_content), "Card property deleted")
    response(code(:not_found), "Card property not found")
  end

  def delete_card_property(conn, %{"cardProperty_id" => id}) do
    card_property = CardProperties.get_card_property!(id)

    CardProperties.delete_card_property!(card_property)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_card_properties_by_card_id do
    get("/cardProperties/card/{card_id}")
    description("Get card properties by card ID")
    parameter("card_id", :path, :integer, "Card ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card not found")
  end

  def get_card_properties_by_card_id(conn, %{"card_id" => card_id}) do
    case CardProperties.get_card_properties_by_card_id(card_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      card_properties ->
        json(conn, card_properties)
    end
  end

  swagger_path :get_card_properties_by_card_id_and_cardtype_property_id do
    get("/cardProperties/card/{card_id}/property/{cardtype_property_id}")
    description("Get card properties by card ID and card type property ID")
    parameter("card_id", :path, :integer, "Card ID", required: true)
    parameter("cardtype_property_id", :path, :integer, "Card type property ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card properties not found")
  end

  def get_card_properties_by_card_id_and_cardtype_property_id(conn, %{"card_id" => card_id, "cardtype_property_id" => cardtype_property_id}) do
    case CardProperties.get_card_properties_by_card_id_and_cardtype_property_id(card_id, cardtype_property_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      card_properties ->
        json(conn, card_properties)
    end
  end
end
