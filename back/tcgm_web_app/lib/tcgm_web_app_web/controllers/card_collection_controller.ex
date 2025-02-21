defmodule TcgmWebAppWeb.CardCollectionController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.CardCollections.CardCollections
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/card_collections")
    description("List all card collections")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    card_collections = CardCollections.list_card_collections()
    json(conn, card_collections)
  end

  swagger_path :show do
    get("/card_collections/{id}")
    description("Get a card collection by ID")
    parameter("id", :path, :integer, "Card collection ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card collection not found")
  end

  def show(conn, %{"id" => id}) do
    card_collection = CardCollections.get_card_collection!(id)
    json(conn, card_collection)
  end

  swagger_path :create do
    post("/card_collections")
    description("Create a new card collection")
    parameter(:body, :body, Schema.ref(:CardCollectionRequest), "Card collection request payload", required: true)
    response(code(:created), "Card collection created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"card_collection" => card_collection_params}) do
    case CardCollections.create_card_collection(card_collection_params) do
      {:ok, card_collection} ->
        conn
        |> put_status(:created)
        |> json(card_collection)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update do
    put("/card_collections/{id}")
    description("Update a card collection by ID")
    parameter("id", :path, :integer, "Card collection ID", required: true)
    parameter(:body, :body, Schema.ref(:CardCollectionRequest), "Card collection request payload", required: true)
  end

  def update(conn, %{"id" => id, "card_collection" => card_collection_params}) do
    card_collection = CardCollections.get_card_collection!(id)
    case CardCollections.update_card_collection(card_collection, card_collection_params) do
      {:ok, card_collection} ->
        conn
        |> put_status(:ok)
        |> json(card_collection)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/card_collections/{id}")
    description("Delete a card collection by ID")
    parameter("id", :path, :integer, "Card collection ID", required: true)
    response(code(:ok), "Card collection deleted")
    response(code(:not_found), "Card collection not found")
  end

  def delete_card_collection(conn, %{"card_collection_id" => id}) do
    card_collection = CardCollections.get_card_collection!(id)


    CardCollections.delete_card_collection!(card_collection)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_card_collections_by_game_id do
    get("/card_collections/game/{game_id}")
    description("Get card collections by game ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card collections not found")
  end

  def get_card_collections_by_game_id(conn, %{"game_id" => game_id}) do
    case CardCollections.get_card_collections_by_game_id(game_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      card_collections when is_list(card_collections) ->
        conn
        |> put_status(:ok)
        |> json(card_collections)
      _ ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not retrieve card collections by game ID"})
      end
  end

  def get_card_collections_by_game_id_and_type(conn, %{"game_id" => game_id, "type" => type}) do
    case CardCollections.get_card_collections_by_game_id_and_type(game_id, type) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{})
      card_collections when is_list(card_collections) ->
        conn
        |> put_status(:ok)
        |> json(card_collections)
      _ ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not retrieve card collections by game ID and type"})
      end
  end
end
