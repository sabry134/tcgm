defmodule TcgmWebApp.Games.Games do
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Repo

  @moduledoc """
    This module is responsible for handling games.
  """

  @doc """
    Creates a game with the given attributes.
  """
  def create_game(attrs) do
    %Game{}
    |> Game.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a game with the given id.
  """
  def get_game!(id) do
    Repo.get!(Game, id)
  end

  @doc """
    Retrieves a game with the given id.
  """
  def get_game(id) do
    Repo.get(Game, id)
  end

  @doc """
    Retrieves all games.
  """
  def list_games do
    Repo.all(Game)
  end

  @doc """
    Deletes a game.
  """
  def delete_game!(%Game{} = game) do
    Repo.delete!(game)
  end

  @doc """
    Updates a game with the given attributes.
  """
  def update_game(%Game{} = game, attrs) do
    game
    |> Game.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves a game by it's name.
  """
  def get_game_by_name(name) do
    Repo.get_by(Game, name: name)
  end
end
