defmodule TcgmWebApp.Accounts do
  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.Repo

  def create_user(attrs) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def get_user!(id) do
    Repo.get!(User, id)
  end

  def get_user(id) do
    Repo.get(User, id)
  end

  def get_user_by_username(username) do
    Repo.get_by(User, username: username)
  end

  def list_users do
    Repo.all(User)
  end

  def delete_user!(id) do
    Repo.delete!(get_user!(id))
  end

  def update_user(id, attrs) do
    user = get_user!(id)
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end
end
