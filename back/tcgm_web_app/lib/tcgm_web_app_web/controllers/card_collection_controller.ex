defmodule TcgmWebAppWeb.CardCollectionController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Cards.Cards
  alias TcgmWebApp.CardCollections.CardCollections
  alias TcgmWebApp.CardCollectionCards.CardCollectionCards
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
    parameter("id", :path, :integer, "Card Collection ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card Collection not found")
  end

  def show(conn, %{"id" => id}) do
    card_collection = CardCollections.get_card_collection!(id)
    json(conn, card_collection)
  end

  swagger_path :create do
    post("/card_collections")
    description("Create a new card collection")
    parameter(:body, :body, Schema.ref(:CardCollectionRequest), "Card Collection request payload", required: true)
    response(code(:created), "Card Collection created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"card_collection" => card_collection_params}) do

    card_collection_params =
      case CardCollections.get_card_collections_by_game_id_and_type(card_collection_params["game_id"], card_collection_params["type"]) do
        [] ->
          case card_collection_params["valid"] do
            true ->
              Map.put(card_collection_params, "active", true)
            _ ->
              card_collection_params
          end
        _ ->
          case card_collection_params["active"] do
            true ->
              active_card_collection = CardCollections.get_active_card_collection_by_game_id_and_type(card_collection_params["game_id"], card_collection_params["type"])
              CardCollections.update_card_collection(active_card_collection, %{active: false})
              card_collection_params
            _ ->
              card_collection_params
          end
      end

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
    parameter("id", :path, :string, "Card Collection ID", required: true)
    parameter(:body, :body, Schema.ref(:CardCollectionRequest), "Card Collection request payload", required: true)
    response(code(:ok), "Card Collection updated")
    response(code(:not_found), "Card Collection not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "card_collection" => card_collection_params}) do
    card_collection = CardCollections.get_card_collection!(id)

    case card_collection.active do
      true ->
        case CardCollections.get_active_card_collection_by_game_id_and_type(card_collection_params["game_id"], card_collection_params["type"]) do
          nil ->
            :ok
          active_card_collection ->
            # Deactivate the currently active card collection
            CardCollections.update_card_collection(active_card_collection, %{active: false})
        end
      _ ->
        :ok
    end

    case CardCollections.update_card_collection(card_collection, card_collection_params) do
      {:ok, card_collection} ->
        json(conn, card_collection)

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/card_collections/delete/{card_collection_id}")
    description("Delete a card collection by ID")
    parameter("id", :path, :integer, "Card Collection ID", required: true)
    response(code(:no_content), "Card Collection deleted")
    response(code(:not_found), "Card Collection not found")
  end

  def delete_card_collection(conn, %{"card_collection_id" => id}) do
    card_collection = CardCollections.get_card_collection!(id)

    CardCollections.delete_card_collection!(card_collection)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_cards do
    get("/card_collections/{card_collection_id}/cards")
    description("Get all cards in a card collection by ID")
    parameter("id", :path, :integer, "Card Collection ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card Collection not found")
  end

  def get_cards_in_card_collection(conn, %{"card_collection_id" => id}) do
    card_collection = CardCollections.get_card_collection!(id)
    card_collection_cards = CardCollectionCards.get_card_collection_cards_by_card_collection_id(card_collection.id)

    card_data = Enum.reduce(card_collection_cards, %{}, fn card, acc ->
      Map.put(acc, card.card_id, %{quantity: card.quantity, group: card.group})
    end)

    card_ids = Map.keys(card_data)
    cards = Cards.get_cards_by_ids(card_ids)

    cards_with_details = Enum.map(cards, fn card ->
      card_info = card_data[card.id]

      card
      |> Map.from_struct()
      |> Map.drop([:__meta__, :inserted_at, :updated_at])
      |> Map.put(:quantity, card_info.quantity)
      |> Map.put(:group, card_info.group)
    end)

    json(conn, cards_with_details)
  end

  swagger_path :update_card_collection do
    put("/card_collections/{card_collection_id}/cards")
    description("Update a card collection by ID with a list of cards, their quantities, and groups")
    parameter("id", :path, :integer, "Card Collection ID", required: true)
    parameter(:body, :body, Schema.ref(:UpdateCardCollectionRequest), "Card Collection update request payload", required: true)
    response(code(:ok), "Card Collection updated successfully")
    response(code(:not_found), "Card Collection not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update_card_collection(conn, %{"card_collection_id" => id, "cards" => cards_payload}) do
    card_collection = CardCollections.get_card_collection!(id)
    payload_card_ids = Enum.map(cards_payload, fn %{"card_id" => card_id} -> card_id end)
    existing_cards = CardCollectionCards.get_card_collection_cards_by_card_collection_id(card_collection.id)

    cards_to_delete =
      Enum.filter(existing_cards, fn existing_card ->
        not Enum.member?(payload_card_ids, existing_card.card_id)
      end)

    Enum.each(cards_to_delete, fn card_to_delete ->
      CardCollectionCards.delete_card_collection_card!(card_to_delete)
    end)

    Enum.each(cards_payload, fn %{"card_id" => card_id, "quantity" => quantity, "group" => group} ->
      case CardCollectionCards.get_card_collection_cards_by_card_collection_id_and_card_id(card_collection.id, card_id) do
        nil ->
          CardCollectionCards.create_card_collection_card(%{
            card_collection_id: card_collection.id,
            card_id: card_id,
            quantity: quantity,
            group: group
          })
        existing_card ->
          CardCollectionCards.update_card_collection_card(existing_card, %{
            quantity: quantity,
            group: group
          })
      end
    end)

    updated_cards = CardCollectionCards.get_card_collection_cards_by_card_collection_id(card_collection.id)

    json(conn, %{card_collection: card_collection, cards: updated_cards})
  end

  swagger_path :get_card_collections_by_user_id do
    get("/card_collections/user/{user_id}")
    description("Get all card collections by user ID")
    parameter("user_id", :path, :integer, "User ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card Collection not found")
  end

  def get_card_collections_by_user_id(conn, %{"user_id" => user_id}) do
    card_collections = CardCollections.get_card_collections_by_user_id(user_id)
    json(conn, card_collections)
  end

  swagger_path :get_card_collections_by_user_id_and_game_id do
    get("/card_collections/user/{user_id}/game/{game_id}")
    description("Get all card collections by user ID and game ID")
    parameter("user_id", :path, :integer, "User ID", required: true)
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card Collection not found")
  end

  def get_card_collections_by_user_id_and_game_id(conn, %{"user_id" => user_id, "game_id" => game_id}) do
    card_collections = CardCollections.get_card_collections_by_user_id_and_game_id(user_id, game_id)
    json(conn, card_collections)
  end

  swagger_path :get_card_collection_templates do
    get("/card_collections/templates")
    description("Get all public card collections")
    response(code(:ok), "Success")
    response(code(:not_found), "No public card collections found")
  end

  def get_card_collection_templates(conn, _params) do
    case CardCollections.get_card_collection_templates() do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "No public card collections found"})
      card_collections ->
        json(conn, card_collections)
    end
  end

  swagger_path :get_active_card_collection_by_game_id_and_type do
    get("/card_collections/active/{game_id}/{type}")
    description("Get the active card collection for game ID and type")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "No active card collection found")
  end

  def get_active_card_collection_by_game_id_and_type(conn, %{"game_id" => game_id, "type" => type}) do
    case CardCollections.get_active_card_collection_by_game_id_and_type(game_id, type) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "No active card collection found"})
      card_collection ->
        json(conn, card_collection)
    end
  end
end
