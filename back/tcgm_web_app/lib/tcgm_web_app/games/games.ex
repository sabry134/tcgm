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

  def delete_game!(%Game{} = game) do
    Repo.delete!(game)
  end

  def update_game(%Game{} = game, attrs) do
    game
    |> Game.changeset(attrs)
    |> Repo.update()
  end

  def get_game_by_name(name) do
    Repo.get_by(Game, name: name)
  end
end
