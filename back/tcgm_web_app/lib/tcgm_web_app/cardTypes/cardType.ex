defmodule TcgmWebApp.CardTypes.CardType do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :name, :game_id, :public_template, :inserted_at, :updated_at]}

  schema "types" do
    field :name, :string
    field :game_id, :id
    field :public_template, :boolean

    has_many :cards, TcgmWebApp.Cards.Card

    timestamps()
  end

  @doc false
  def changeset(type, attrs) do
    type
    |> cast(attrs, [:name, :game_id, :public_template])
    |> validate_required([:name, :game_id])
  end
end
