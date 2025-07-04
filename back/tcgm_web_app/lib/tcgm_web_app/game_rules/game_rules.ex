defmodule TcgmWebApp.GameRules.GameRules do
  alias TcgmWebApp.GameRules.GameRule
  alias TcgmWebApp.Repo

  @moduledoc """
    This module is responsible for handling rules.
  """

  @doc """
    Creates a game rule with the given attributes.
  """
  def create_game_rule(attrs) do
    %GameRule{}
    |> GameRule.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a game rule with the given id.
  """
  def get_game_rule!(id) do
    Repo.get!(GameRule, id)
  end

  @doc """
    Retrieves a game rule with the given id.
  """
  def get_game_rule(id) do
    Repo.get(GameRule, id)
  end

  @doc """
    Retrieves all game rules.
  """
  def list_game_rules do
    Repo.all(GameRule)
  end

  @doc """
    Deletes a game rule.
  """
  def delete_game_rule!(%GameRule{} = game_rule) do
    Repo.delete!(game_rule)
  end

  @doc """
    Updates a game rule with the given attributes.
  """
  def update_game_rule(%GameRule{} = game_rule, attrs) do
    game_rule
    |> GameRule.changeset(attrs)
    |> Repo.update()
  end
end
