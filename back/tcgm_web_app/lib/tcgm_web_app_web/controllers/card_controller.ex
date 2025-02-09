defmodule TcgmWebAppWeb.CardController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.Cards.Cards
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

      cards ->
        IO.inspect(cards, label: "cards")
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not retrieve cards by game ID"})
    end
  end
end
