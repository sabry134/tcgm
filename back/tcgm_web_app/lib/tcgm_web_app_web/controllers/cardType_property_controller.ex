defmodule TcgmWebAppWeb.CardTypePropertyController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.CardTypeProperties.CardTypeProperties
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/cardTypeProperties")
    description("List all card type properties")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    card_type_properties = CardTypeProperties.list_card_type_properties()
    json(conn, card_type_properties)
  end

  swagger_path :show do
    get("/cardTypeProperties/{id}")
    description("Get a card type property by ID")
    parameter("id", :path, :integer, "Card type property ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card type property not found")
  end

  def show(conn, %{"id" => id}) do
    card_type_property = CardTypeProperties.get_card_type_property!(id)
    json(conn, card_type_property)
  end

  swagger_path :create do
    post("/cardTypeProperties")
    description("Create a new card type property")
    parameter(:body, :body, Schema.ref(:CardTypePropertyRequest), "Card type property request payload", required: true)
    response(code(:created), "Card type property created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"cardTypeProperty" => card_type_property_params}) do
    case CardTypeProperties.create_card_type_property(card_type_property_params) do
      {:ok, card_type_property} ->
        conn
        |> put_status(:created)
        |> json(card_type_property)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update do
    put("/cardTypeProperties/{id}")
    description("Update a card type property by ID")
    parameter("id", :path, :string, "Card type property ID", required: true)
    parameter(:body, :body, Schema.ref(:CardTypePropertyRequest), "Card type property request payload", required: true)
    response(code(:ok), "Card type property updated")
    response(code(:not_found), "Card type property not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "cardTypeProperty" => card_type_property_params}) do
    card_type_property = CardTypeProperties.get_card_type_property!(id)
    case CardTypeProperties.update_card_type_property(card_type_property, card_type_property_params) do
      {:ok, card_type_property} ->
        conn
        |> put_status(:ok)
        |> json(card_type_property)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/cardTypeProperties/{cardTypeProperty_id}")
    description("Delete a card type property by ID")
    parameter("id", :path, :integer, "Card type property ID", required: true)
    response(code(:ok), "Card type property deleted")
    response(code(:not_found), "Card type property not found")
  end

  def delete_cardType_property(conn, %{"cardTypeProperty_id" => id}) do
    card_type_property = CardTypeProperties.get_card_type_property!(id)
    CardTypeProperties.delete_card_type_property!(card_type_property)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_card_type_properties_by_card_type_id do
    get("/cardTypeProperties/cardType/{cardType_id}")
    description("Get card type properties by card type ID")
    parameter("card_type_id", :path, :integer, "Card type ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card type properties not found")
  end

  def get_card_type_properties_by_card_type_id(conn, %{"cardType_id" => cardType_id}) do
    case CardTypeProperties.get_card_type_properties_by_card_type_id(cardType_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      card_type_properties ->
        conn
        |> put_status(:ok)
        |> json(card_type_properties)
      _ ->
      conn
      |> put_status(:unprocessable_entity)
      |> json(%{error: "Could not retrieve card type properties"})
    end
  end

  swagger_path :get_card_type_properties_by_card_type_id_and_property_name do
    get("/cardTypeProperties/cardType/{cardType_id}/property/{property_name}")
    description("Get card type properties by card type ID and property name")
    parameter("card_type_id", :path, :integer, "Card type ID", required: true)
    parameter("property_name", :path, :string, "Property name", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card type properties not found")
  end

  def get_card_type_properties_by_card_type_id_and_property_name(conn, %{"cardType_id" => card_type_id, "property_name" => property_name}) do
    case CardTypeProperties.get_card_type_properties_by_card_type_id_and_property_name(card_type_id, property_name) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      card_type_properties ->
        conn
        |> put_status(:ok)
        |> json(card_type_properties)
      _ ->
      conn
      |> put_status(:unprocessable_entity)
      |> json(%{error: "Could not retrieve card type properties"})
    end
  end
end
