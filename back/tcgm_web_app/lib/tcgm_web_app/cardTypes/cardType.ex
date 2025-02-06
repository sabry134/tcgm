defmodule TcgmWebApp.CardTypes.CardType do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :name, :properties, :game_id, :inserted_at, :updated_at]}

  schema "types" do
    field :name, :string
    field :properties, {:array, :string}
    field :game_id, :id

    has_many :cards, TcgmWebApp.Cards.Card

    timestamps()
  end

  @doc false
  def changeset(type, attrs) do
    type
    |> cast(attrs, [:name, :properties, :game_id])
    |> validate_required([:name, :properties, :game_id])
  end
end
