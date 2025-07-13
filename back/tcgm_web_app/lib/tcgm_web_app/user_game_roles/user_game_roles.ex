defmodule TcgmWebApp.UserGameRoles.UserGameRoles do
  alias TcgmWebApp.UserGameRoles.UserGameRole
  alias TcgmWebApp.Repo
  import Ecto.Query

  @moduledoc """
    This module is responsible for handling user game roles.
  """

  @doc """
    Creates a user game role with the given attributes.
  """
  def create_user_game_role(attrs) do
    %UserGameRole{}
    |> UserGameRole.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a user game role with the given id.
  """
  def get_user_game_role!(id) do
    Repo.get!(UserGameRole, id)
  end

  @doc """
    Retrieves a user game role with the given id.
  """
  def get_user_game_role(id) do
    Repo.get(UserGameRole, id)
  end

  @doc """
    Retrieves all user game roles.
  """
  def list_user_game_roles do
    Repo.all(UserGameRole)
  end

  @doc """
    Retrieves all user game roles for a specific game and role name.
  """
  def list_user_game_roles_by_game_and_role(game_id, role_name) do
    Repo.all(from ugr in UserGameRole,
             where: ugr.game_id == ^game_id and ugr.role_name == ^role_name)
  end

  @doc """
    Retrieves all user game roles for a specific game and user.
  """

  def list_user_game_roles_by_game_and_user(game_id, user_id) do
    Repo.all(from ugr in UserGameRole,
             where: ugr.game_id == ^game_id and ugr.user_id == ^user_id)
  end

  @doc """
    Retrieves all user game roles for a specific user and role name.
  """

  def list_user_game_roles_by_user_and_role(user_id, role_name) do
    Repo.all(from ugr in UserGameRole,
             where: ugr.user_id == ^user_id and ugr.role_name == ^role_name)
  end

  @doc """
    Updates a user game role with the given attributes.
  """
  def update_user_game_role(%UserGameRole{} = user_game_role, attrs) do
    user_game_role
    |> UserGameRole.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Deletes a user game role.
  """
  def delete_user_game_role!(%UserGameRole{} = user_game_role) do
    Repo.delete!(user_game_role)
  end

end
