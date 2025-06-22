defmodule TcgmWebApp.UserGameRoles.UserGameRole do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :role_name, :user_id, :game_id, :inserted_at, :updated_at]}

  schema "user_game_roles" do
    field :role_name, :string
    field :user_id, :id
    field :game_id, :id

    timestamps()
  end

  @doc false
  def changeset(user_game_role, attrs) do
    user_game_role
    |> cast(attrs, [:role_name, :user_id, :game_id])
    |> validate_required([:role_name, :user_id, :game_id])
  end
end
