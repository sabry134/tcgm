defmodule TcgmWebAppWeb.GameController do
  use TcgmWebAppWeb, :controller

  alias TcgmWebApp.Games.Games

  def index(conn, _params) do
    games = Games.list_games()
    json(conn, games)
  end

  def show(conn, %{"id" => id}) do
    game = Games.get_game!(id)
    json(conn, game)
  end

  def create(conn, %{"game" => game_params}) do
    case Games.create_game(game_params) do
      {:ok, game} ->
        conn
        |> put_status(:created)
        |> json(game)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  def update(conn, %{"id" => id, "game" => game_params}) do
    game = Games.get_game!(id)
    case Games.update_game(game, game_params) do
      {:ok, game} ->
        json(conn, game)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    game = Games.get_game!(id)

    case Games.delete_game!(game) do
      {:ok, _game} ->
        send_resp(conn, :no_content, "")

      {:error, _reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Could not delete game"})
    end
  end
end
