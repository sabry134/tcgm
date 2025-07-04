defmodule TcgmWebApp.Rules.Rules do
  alias TcgmWebApp.Rules.Rule
  alias TcgmWebApp.Repo

  @moduledoc """
    This module is responsible for handling rules.
  """

  @doc """
    Creates a rule with the given attributes.
  """
  def create_rule(attrs) do
    %Rule{}
    |> Rule.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a rule with the given id.
  """
  def get_rule!(id) do
    Repo.get!(Rule, id)
  end

  @doc """
    Retrieves a rule with the given id.
  """
  def get_rule(id) do
    Repo.get(Rule, id)
  end

  @doc """
    Retrieves all rules.
  """
  def list_rules do
    Repo.all(Rule)
  end

  @doc """
    Deletes a rule.
  """
  def delete_rule!(%Rule{} = rule) do
    Repo.delete!(rule)
  end

  @doc """
    Updates a rule with the given attributes.
  """
  def update_rule(%Rule{} = rule, attrs) do
    rule
    |> Rule.changeset(attrs)
    |> Repo.update()
  end
end
