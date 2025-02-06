defmodule TcgmWebApp.Games.Game do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :name, :description, :inserted_at, :updated_at]}

  schema "games" do
    field :name, :string
    field :description, :string

    timestamps()
  end

  @doc false
  def changeset(game, attrs) do
    game
    |> cast(attrs, [:name, :description])
    |> validate_required([:name, :description])
  end
end
