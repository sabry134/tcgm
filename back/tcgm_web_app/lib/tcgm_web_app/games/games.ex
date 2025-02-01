defmodule TcgmWebApp.Games.Games do
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Repo

  def create_game(attrs) do
    %Game{}
    |> Game.changeset(attrs)
    |> Repo.insert()
  end

  def get_game!(id) do
    Repo.get!(Game, id)
  end

  def get_game(id) do
    Repo.get(Game, id)
  end

  def list_games do
    Repo.all(Game)
  end

  def delete_game!(id) do
    Repo.delete!(get_game!(id))
  end

  def update_game(id, attrs) do
    game = get_game!(id)
    game
    |> Game.changeset(attrs)
    |> Repo.update()
  end

  def get_game_by_name(name) do
    Repo.get_by(Game, name: name)
  end
end
