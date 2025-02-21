defmodule TcgmWebAppWeb.CardCollectionController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.CardCollections.CardCollections
  alias TcgmWebApp.Cards.Cards
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

  defp create_collection_file(card_collection, user_id, game_id) do
    file_name = if user_id do
      "#{game_id}_#{user_id}.json"
    else
      "#{game_id}.json"
    end

    file_path = "./data/card_collections/#{file_name}"
    file_content = if File.exists?(file_path) do
      {:ok, content} = File.read(file_path)
      collections = Jason.decode!(content)
      collections ++ [%{id: card_collection.id, name: card_collection.name, quantity: card_collection.quantity, type: card_collection.type, cards: %{}}]
    else
      [%{id: card_collection.id, name: card_collection.name, quantity: card_collection.quantity, type: card_collection.type, cards: %{}}]
    end

    File.write!(file_path, Jason.encode!(file_content))
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
        game_id = card_collection_params["game_id"]
        user_id = card_collection_params["user_id"]

        create_collection_file(card_collection, user_id, game_id)

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

  swagger_path :get_card_collections_by_game_id_and_type do
    get("/card_collections/game/{game_id}/{type}")
    description("Get card collections by game ID and type")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    parameter("type", :path, :string, "Type", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card collections not found")
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

  swagger_path :get_card_collections_by_user_id do
    get("/card_collections/user/{user_id}")
    description("Get card collections by user ID")
    parameter("user_id", :path, :integer, "User ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card collections not found")
  end

  def get_card_collections_by_user_id(conn, %{"user_id" => user_id}) do
    case CardCollections.get_card_collections_by_user_id(user_id) do
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
        |> json(%{error: "Could not retrieve card collections by user ID"})
      end
  end

  swagger_path :get_card_collections_by_game_id_and_user_id do
    get("/card_collections/game/{game_id}/user/{user_id}")
    description("Get card collections by game ID and user ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    parameter("user_id", :path, :integer, "User ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card collections not found")
  end

  def get_card_collections_by_user_id_and_game_id(conn, %{"game_id" => game_id, "user_id" => user_id}) do
    case CardCollections.get_card_collections_by_user_id_and_game_id(user_id, game_id) do
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
        |> json(%{error: "Could not retrieve card collections by game ID and user ID"})
      end
  end

  swagger_path :add_card_to_collection do
    post("/card_collections/add_card")
    description("Add a card to a collection")
    parameter(:body, :body, Schema.ref(:AddCardToCollectionRequest), "Add card to collection request payload", required: true)
    response(code(:ok), "Card added to collection")
    response(code(:not_found), "Card collection not found")
  end

  def add_card_to_collection(conn, %{"card_collection_id" => card_collection_id, "card_id" => card_id, "quantity" => quantity}) do
    card_collection = CardCollections.get_card_collection!(card_collection_id)
    card = Cards.get_card!(card_id)

    file_path = get_file_path(card_collection)

    file_content = read_file_content(file_path)

    quantity = String.to_integer(quantity)
    updated_collections = update_collections(file_content, card_collection_id, card.name, quantity)

    write_file_content(file_path, updated_collections)

    update_db_quantity(card_collection, quantity)

    conn
    |> put_status(:ok)
    |> json(%{message: "Card added to collection"})
  end

  defp get_file_path(card_collection) do
    if card_collection.user_id do
      "./data/card_collections/#{card_collection.game_id}_#{card_collection.user_id}.json"
    else
      "./data/card_collections/#{card_collection.game_id}.json"
    end
  end

  defp read_file_content(file_path) do
    if File.exists?(file_path) do
      {:ok, content} = File.read(file_path)
      Jason.decode!(content)
    else
      []
    end
  end

  defp update_collections(file_content, card_collection_id, card_name, quantity) do
    Enum.map(file_content, fn collection ->
      if to_string(collection["id"]) == to_string(card_collection_id) do
        updated_cards = Map.update(collection["cards"], card_name, quantity, fn existing_quantity ->
          existing_quantity + quantity
        end)
        updated_quantity = collection["quantity"] + quantity
        collection
        |> Map.put("quantity", updated_quantity)
        |> Map.put("cards", updated_cards)
      else
        collection
      end
    end)
  end

  defp write_file_content(file_path, updated_collections) do
    File.write!(file_path, Jason.encode!(updated_collections))
  end

  defp update_db_quantity(card_collection, quantity) do
    quantity = quantity
    new_quantity = card_collection.quantity + quantity
    {:ok, _updated_card_collection} = CardCollections.update_card_collection(card_collection, %{quantity: new_quantity})
  end

  swagger_path :remove_card_from_collection do
    post("/card_collections/remove_card")
    description("Remove a card from a collection")
    parameter(:body, :body, Schema.ref(:RemoveCardFromCollectionRequest), "Remove card from collection request payload", required: true)
    response(code(:ok), "Card removed from collection")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def remove_card_from_collection(conn, %{"card_collection_id" => card_collection_id, "card_id" => card_id, "quantity" => quantity}) do
    card_collection = CardCollections.get_card_collection!(card_collection_id)
    card = Cards.get_card!(card_id)

    file_path = get_file_path(card_collection)

    file_content = read_file_content(file_path)

    quantity = String.to_integer(quantity)
    updated_collections = update_collections_for_removal(file_content, card_collection_id, card.name, quantity)

    case updated_collections do
      {:error, message} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: message})
      updated_collections ->
        write_file_content(file_path, updated_collections)
        update_db_quantity(card_collection, -quantity)
        conn
        |> put_status(:ok)
        |> json(%{message: "Card removed from collection"})
    end
  end

  defp update_collections_for_removal(file_content, card_collection_id, card_name, quantity) do
    Enum.map(file_content, fn collection ->
      if to_string(collection["id"]) == to_string(card_collection_id) do
        updated_cards = Map.update(collection["cards"], card_name, 0, fn existing_quantity ->
          if existing_quantity < quantity do
            {:error, "Cannot remove more cards than are in the collection"}
          else
            new_quantity = existing_quantity - quantity
            if new_quantity == 0 do
              Map.delete(collection["cards"], card_name)
            else
              new_quantity
            end
          end
        end)

        case updated_cards do
          {:error, _} = error -> error
          _ ->
            updated_quantity = collection["quantity"] - quantity
            collection
            |> Map.put("quantity", updated_quantity)
            |> Map.put("cards", updated_cards)
        end
      else
        collection
      end
    end)
  end

  def get_cards_in_collection(conn, %{"card_collection_id" => card_collection_id}) do
    card_collection = CardCollections.get_card_collection!(card_collection_id)
    file_path = get_file_path(card_collection)
    file_content = read_file_content(file_path)

    collection = Enum.find(file_content, fn c -> to_string(c["id"]) == to_string(card_collection_id) end)
    card_quantities = collection["cards"]

    card_names = Map.keys(card_quantities)
    cards = Cards.get_cards_by_names(card_names)

    cards_with_quantities = Enum.flat_map(cards, fn card ->
      quantity = card_quantities[card.name]
      Enum.map(1..quantity, fn _ -> Map.put(card, :quantity, quantity) end)
    end)

    conn
    |> put_status(:ok)
    |> json(cards_with_quantities)
  end
end
