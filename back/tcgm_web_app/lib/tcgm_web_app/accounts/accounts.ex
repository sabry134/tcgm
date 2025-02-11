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

  def delete_user!(%User{} = user) do
    Repo.delete(user)
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def authenticate_user(%{"username" => username}) do
    user = get_user_by_username(username)
    case user do
      nil -> {:error, "User not found"}
      _ -> {:ok, user}
    end
  end
end
