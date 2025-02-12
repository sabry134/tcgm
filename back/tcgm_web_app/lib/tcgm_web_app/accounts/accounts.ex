defmodule TcgmWebApp.Accounts do
  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.Repo

  @moduledoc """
    This module is responsible for handling user accounts.
  """

  @doc """
    Creates a user with the given attributes.
  """
  def create_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a user with the given id.
  """
  def get_user!(id) do
    Repo.get!(User, id)
  end

  @doc """
    Retrieves a user with the given id.
  """
  def get_user(id) do
    Repo.get(User, id)
  end


  @doc """
    Retrieves a user with the given username.
  """
  def get_user_by_username(username) do
    Repo.get_by(User, username: username)
  end

  @doc """
    Retrieves all users.
  """
  def list_users do
    Repo.all(User)
  end

  @doc """
    Deletes a user.
  """
  def delete_user!(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
    Updates a user with the given attributes.
  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Authenticates a user with the given username.
  """
  def authenticate_user(%{"username" => username}) do
    user = get_user_by_username(username)
    case user do
      nil -> {:error, "User not found"}
      _ -> {:ok, user}
    end
  end
end
