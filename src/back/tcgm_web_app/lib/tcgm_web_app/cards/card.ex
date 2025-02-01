defmodule TcgmWebApp.Cards.Card do
  use Ecto.Schema
  import Ecto.Changeset
  alias TcgmWebApp.Cards.Card

  schema "cards" do
    field :name, :string
    field :text, :string
    field :image, :string
    field :properties, {:array, :string}
    field :game_id, :id
    field :card_type_id, :id
    field :effect_ids, {:array, :string}

    timestamps()
  end

  @doc false
  def changeset(card, attrs) do
    card
    |> cast(attrs, [:name, :text, :image, :properties, :game_id, :card_type_id, :effect_ids])
    |> validate_required([:name, :text, :image, :properties, :game_id, :card_type_id, :effect_ids])
  end
end
