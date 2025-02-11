defmodule TcgmWebApp.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :username, :inserted_at, :updated_at]}

  schema "users" do
    field :username, :string

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username])
    |> validate_required([:username])
    |> unique_constraint(:username)
  #  |> put_pass_hash() will uncomment when passwords are added
  end

  #defp put_pass_hash(changeset) do
  #  case get_change(changeset, :password) do
  #    nil -> changeset
  #    password ->
  #      put_change(changeset, :password_hash, Comeonin.Bcrypt.hashpwsalt(password))
  #  end
  #end
end
