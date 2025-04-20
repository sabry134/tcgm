defmodule TcgmWebAppWeb.CardController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Cards.Cards
  alias TcgmWebApp.CardTypes.CardTypes
  alias TcgmWebApp.CardProperties.CardProperties
  alias TcgmWebApp.CardTypeProperties.CardTypeProperties
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/cards")
    description("List all cards")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    cards = Cards.list_cards()
    json(conn, cards)
  end

  swagger_path :show do
    get("/cards/{id}")
    description("Get a card by ID")
    parameter("id", :path, :integer, "Card ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card not found")
  end

  def show(conn, %{"id" => id}) do
    card = Cards.get_card!(id)
    json(conn, card)
  end

  swagger_path :create do
    post("/cards")
    description("Create a new card")
    parameter(:body, :body, Schema.ref(:CardRequest), "Card request payload", required: true)
    response(code(:created), "Card created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"card" => card_params}) do
    case Cards.create_card(card_params) do
      {:ok, card} ->
        conn
        |> put_status(:created)
        |> json(card)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update do
    put("/cards/{id}")
    description("Update a card by ID")
    parameter("id", :path, :string, "Card ID", required: true)
    parameter(:body, :body, Schema.ref(:CardRequest), "Card request payload", required: true)
    response(code(:ok), "Card updated")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "card" => card_params}) do
    card = Cards.get_card!(id)
    case Cards.update_card(card, card_params) do
      {:ok, card} ->
        json(conn, card)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/cards/{card_id}")
    description("Delete a card by ID")
    parameter("id", :path, :integer, "Card ID", required: true)
    response(code(:no_content), "Card deleted")
  end

  def delete_card(conn, %{"card_id" => id}) do
    card = Cards.get_card!(id)

    Cards.delete_card!(card)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_cards_by_game_id do
    get("/cards/game/{game_id}")
    description("Get cards by game ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "No cards found for game ID")
    response(code(:unprocessable_entity), "Could not retrieve cards by game ID")
  end

  def get_cards_by_game_id(conn, %{"game_id" => game_id}) do
    case Cards.get_cards_by_game_id(game_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "No cards found for game ID #{game_id}"})

      cards when is_list(cards) ->
        conn
        |> put_status(:ok)
        |> json(cards)

      _ ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not retrieve cards by game ID"})
    end
  end

  swagger_path :get_card_cardtype do
    get("/cards/{card_id}/cardtype")
    description("Get card type by card ID")
    parameter("card_id", :path, :integer, "Card ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Card not found")
  end

  def get_card_cardtype(conn, %{"card_id" => card_id}) do
    card = Cards.get_card!(card_id)
    card_type = CardTypes.get_cardType!(card.card_type_id)

    if card_type do
      conn
      |> put_status(:ok)
      |> json(card_type)
    else
      conn
      |> put_status(:not_found)
      |> json(%{error: "Card type not found for card ID #{card_id}"})
    end
  end

  swagger_path :create_card_with_properties do
    post("/cards/with_properties")
    description("Create a new card with properties")
    parameter(:body, :body, Schema.ref(:CardWithPropertiesRequest), "Card with properties request payload", required: true)
    response(code(:created), "Card and properties created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create_card_with_properties(conn, %{"card" => card_params, "properties" => properties}) do
    case Cards.create_card(card_params) do
      {:ok, card} ->
        properties = Enum.map(properties, fn property ->
          %{
            value_string: property["value_string"],
            value_number: property["value_number"],
            value_boolean: property["value_boolean"],
            cardtype_property_id: property["cardtype_property_id"],
            card_id: card.id
          }
        end)

        case Enum.reduce_while(properties, {:ok, []}, fn property, {:ok, acc} ->
              case CardProperties.create_card_property(property) do
                 {:ok, card_property} ->
                   {:cont, {:ok, [card_property | acc]}}

                 {:error, changeset} ->
                   {:halt, {:error, changeset}}
               end
             end) do
          {:ok, card_properties} ->
            conn
            |> put_status(:created)
            |> json(%{card: card, properties: Enum.reverse(card_properties)})

          {:error, %Ecto.Changeset{} = changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(%{error: "Failed to create one or more card properties", details: changeset})
        end

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Failed to create card", details: changeset})
    end
  end

  swagger_path :get_cards_with_properties_by_game_id do
    get("/cards/game/{game_id}/with_properties")
    description("Get cards with properties by game ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "No cards found for game ID")
    response(code(:unprocessable_entity), "Could not retrieve cards by game ID")
  end

  def get_cards_with_properties_by_game_id(conn, %{"game_id" => game_id}) do
    case Cards.get_cards_by_game_id(game_id) do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "No cards found for game ID #{game_id}"})

      cards when is_list(cards) ->
        cards_with_properties = Enum.map(cards, fn card ->
          properties = CardProperties.get_card_properties_by_card_id(card.id)
          clean_properties = Enum.map(properties, fn property ->
            get_clean_property(property)
          end)
          card_map =
            card
            |> Map.from_struct()
            |> Map.drop([:__meta__, :inserted_at, :updated_at])
            |> Map.put(:properties, clean_properties)

          card_map
        end)

        conn
        |> put_status(:ok)
        |> json(cards_with_properties)

      _ ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not retrieve cards by game ID"})
    end
  end

  defp get_clean_property(property) do
    cardTypeProperty = CardTypeProperties.get_card_type_property!(property.cardtype_property_id)
    case cardTypeProperty.type do
      "text" ->
        %{
          name: cardTypeProperty.property_name,
          value: property.value_string,
        }

      "number" ->
        %{
          name: cardTypeProperty.property_name,
          value: property.value_number,
        }

      "boolean" ->
        %{
          name: cardTypeProperty.property_name,
          value: property.value_boolean,
        }
    end
  end
end
