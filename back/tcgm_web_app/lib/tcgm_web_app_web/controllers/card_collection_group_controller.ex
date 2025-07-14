defmodule TcgmWebAppWeb.CardCollectionGroupController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.CardCollectionGroups.CardCollectionGroups
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/card_collection_groups")
    description("List all card collection groups")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    groups = CardCollectionGroups.list_card_collection_groups()
    json(conn, groups)
  end

  swagger_path :show do
    get("/card_collection_groups/{id}")
    description("Get a card collection group by ID")
    parameter("id", :path, :integer, "Card Collection Group ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card Collection Group not found")
  end

  def show(conn, %{"id" => id}) do
    group = CardCollectionGroups.get_card_collection_group!(id)
    json(conn, group)
  end

  swagger_path :create_card_collection_group do
    post("/card_collection_groups")
    description("Create a new card collection group")
    parameter(:body, :body, Schema.ref(:CardCollectionGroupRequest), "Card Collection group request payload", required: true)
    response(code(:created), "Card Collection group created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"group" => group_params}) do
    case CardCollectionGroups.create_card_collection_group(group_params) do
      {:ok, card_collection_group} ->
        conn
        |> put_status(:created)
        |> json(card_collection_group)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update_card_collection_group do
    put("/card_collection_groups/{id}")
    description("Update an existing card collection group")
    parameter("id", :path, :integer, "Card Collection Group ID", required: true)
    parameter(:body, :body, Schema.ref(:CardCollectionGroupRequest), "Card Collection group request payload", required: true)
    response(code(:ok), "Card Collection group updated")
    response(code(:not_found), "Card Collection Group not found")
  end

  def update(conn, %{"id" => id, "group" => group_params}) do
    group = CardCollectionGroups.get_card_collection_group!(id)
    case CardCollectionGroups.update_card_collection_group(group, group_params) do
      {:ok, card_collection_group} ->
        conn
        |> put_status(:ok)
        |> json(card_collection_group)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete_card_collection_group do
    delete("/card_collection_groups/{card_collection_group_id}")
    description("Delete a card collection group by ID")
    parameter("id", :path, :integer, "Card Collection Group ID", required: true)
    response(code(:no_content), "Card Collection group deleted")
    response(code(:not_found), "Card Collection Group not found")
  end

  def delete_card_collection_group(conn, %{"card_collection_group_id" => id}) do
    card_collection_group = CardCollectionGroups.get_card_collection_group!(id)

    CardCollectionGroups.delete_card_collection_group!(card_collection_group)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_card_collection_groups_by_game_id do
    get("/card_collection_groups/game/{game_id}")
    description("Get card collection groups by game ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Game not found")
  end

  def get_card_collection_groups_by_game_id(conn, %{"game_id" => game_id}) do
    case CardCollectionGroups.get_card_collection_groups_by_game_id(game_id) do
      card_collection_groups ->
        case card_collection_groups do
          [] -> send_resp(conn, :not_found, "No card collection groups found for this game")
          _ -> json(conn, card_collection_groups)
        end
        json(conn, card_collection_groups)
      {:error, :not_found} ->
        send_resp(conn, :not_found, "Game not found")
    end
  end

  swagger_path :get_card_collection_group_by_game_id_and_collection_type do
    get("/card_collection_groups/game{game_id}/type/{collection_type}")
    description("Get card collection group by game ID and collection type")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    parameter("collection_type", :path, :string, "Collection Type", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Game not found")
  end

  def get_card_collection_group_by_game_id_and_collection_type(conn, %{"game_id" => game_id, "collection_type" => collection_type}) do
    case CardCollectionGroups.get_card_collection_id_by_game_id_and_collection_type(game_id, collection_type) do
      card_collection_group ->
        case card_collection_group do
          nil -> send_resp(conn, :not_found, "Card collection group with type #{collection_type} not found for game #{game_id}")
          _ -> json(conn, card_collection_group)
        end
        json(conn, card_collection_group)
      {:error, :not_found} ->
        send_resp(conn, :not_found, "Card collection group not found")
    end
  end

  swagger_path :get_card_collection_types do
    get("/card_collection_groups/card_collection_types")
    description("Get all card collection types")
    response(code(:ok), "Success")
  end

  def get_card_collection_types(conn, _params) do
    collection_types = [
      %{"name" => "deck"},
      %{"name" => "set"},
      %{"name" => "collection"},
    ]
    json(conn, collection_types)
  end
end
