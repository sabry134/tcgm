defmodule TcgmWebAppWeb.CardTypeController do
  use TcgmWebAppWeb, :controller

  alias TcgmWebApp.CardTypes.CardTypes

  def index(conn, _params) do
    cardTypes = CardTypes.list_cardTypes()
    json(conn, cardTypes)
  end

  def show(conn, %{"id" => id}) do
    cardType = CardTypes.get_cardType!(id)
    json(conn, cardType)
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
        |> json(changeset)
    end
  end

  def update(conn, %{"id" => id, "cardType" => cardType_params}) do
    cardType = CardTypes.get_cardType!(id)
    case CardTypes.update_cardType(cardType, cardType_params) do
      {:ok, cardType} ->
        json(conn, cardType)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    cardType = CardTypes.get_cardType!(id)

    case CardTypes.delete_cardType!(cardType) do
      {:ok, _cardType} ->
        send_resp(conn, :no_content, "")

      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not delete cardType"})
    end
  end

  def get_cardTypes_by_game_id(conn, %{"game_id" => game_id}) do
    case CardTypes.get_cardTypes_by_game_id(game_id) do
      {:ok, cardTypes} ->
        conn
        |> put_status(:ok)
        |> json(cardTypes)
      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not finds cardTypes by game id"})
    end
  end
end
