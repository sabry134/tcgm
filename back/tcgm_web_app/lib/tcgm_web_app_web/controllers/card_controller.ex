defmodule TcgmWebAppWeb.CardController do
  use TcgmWebAppWeb, :controller

  alias TcgmWebApp.Cards.Cards

  def index(conn, _params) do
    cards = Cards.list_cards()
    json(conn, cards)
  end

  def show(conn, %{"id" => id}) do
    card = Cards.get_card!(id)
    json(conn, card)
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

  def delete(conn, %{"id" => id}) do
    card = Cards.get_card!(id)

    Cards.delete_card!(card)
    send_resp(conn, :no_content, "")
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
