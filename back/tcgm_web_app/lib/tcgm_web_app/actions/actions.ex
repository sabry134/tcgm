defmodule TcgmWebApp.Actions.Actions do
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Repo

  @moduledoc """
    This module is responsible for handling actions.
  """

  @doc """
    Creates an action with the given attributes.
  """
  def create_action(attrs) do
    %Action{}
    |> Action.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves an action with the given id.
  """
  def get_action!(id) do
    Repo.get!(Action, id)
  end

  @doc """
    Retrieves an action with the given id.
  """
  def get_action(id) do
    Repo.get(Action, id)
  end

  @doc """
    Retrieves all actions.
  """
  def list_actions do
    Repo.all(Action)
  end

  @doc """
    Updates an action with the given attributes.
  """
  def update_action(%Action{} = action, attrs) do
    action
    |> Action.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Deletes an action.
  """
  def delete_action!(%Action{} = action) do
    Repo.delete!(action)
  end

  @doc """
    Retrieves an action with the given name.
  """
  def get_action_by_name(name) do
    Repo.get_by(Action, name: name)
  end
end
