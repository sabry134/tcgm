defmodule TcgmWebAppWeb.GameController do
  use TcgmWebAppWeb, :controller

  alias TcgmWebApp.Games.Games
  alias TcgmWebAppWeb.Helpers

  def index(conn, _params) do
    games = Games.list_games()
    json(conn, games)
  end

  def show(conn, %{"id" => id}) do
    game = Games.get_game!(id)
    json(conn, game)
  end

  def get_game_by_name(conn, %{"name" => name}) do
    game = Games.get_game_by_name(name)
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
        |> json(%{errors: Helpers.translate_errors(changeset)})
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
        |> json(%{errors: Helpers.translate_errors(changeset)})
    end
  end

  def delete(conn, %{"id" => id}) do
    game = Games.get_game!(id)

    Games.delete_game!(game)
    send_resp(conn, :no_content, "")
  end
end
