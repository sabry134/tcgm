defmodule TcgmWebApp.Actions.Actions do
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Repo

  def create_action(attrs) do
    %Action{}
    |> Action.changeset(attrs)
    |> Repo.insert()
  end

  def get_action!(id) do
    Repo.get!(Action, id)
  end

  def get_action(id) do
    Repo.get(Action, id)
  end

  def list_actions do
    Repo.all(Action)
  end

  def update_action(id, attrs) do
    action = get_action!(id)
    action
    |> Action.changeset(attrs)
    |> Repo.update()
  end

  def delete_action!(id) do
    action = get_action!(id)
    Repo.delete!(action)
  end

  def get_action_by_name(name) do
    Repo.get_by(Action, name: name)
  end
end
