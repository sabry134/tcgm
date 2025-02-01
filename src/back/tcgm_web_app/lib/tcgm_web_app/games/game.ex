defmodule TcgmWebApp.Games.Game do
  use Ecto.Schema
  import Ecto.Changeset
  alias TcgmWebApp.Games.Game

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
