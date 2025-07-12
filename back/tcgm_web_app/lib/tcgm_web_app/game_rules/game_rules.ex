defmodule TcgmWebApp.GameRules.GameRules do
  alias TcgmWebApp.GameRules.GameRule
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false
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

  @doc """
    Retrieves a game rule by it's game id.
  """
  def get_game_rules_by_game_id(game_id) do
    from(gr in GameRule,
      where: gr.game_id == ^game_id,
      select: gr
    )
    |> Repo.all()
  end

  def get_game_rule_by_game_id(game_id) do
    from(gr in GameRule,
      where: gr.game_id == ^game_id,
      limit: 1,
      select: gr
    )
    |> Repo.one()
  end

  @doc """
    Retrieves game rules with true public_template.
  """
  def get_game_rule_templates do
    Repo.all(from gr in GameRule, where: gr.public_template == true)
  end
end
