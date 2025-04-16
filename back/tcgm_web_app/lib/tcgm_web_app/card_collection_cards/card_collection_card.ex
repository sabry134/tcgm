defmodule TcgmWebApp.CardCollectionCards.CardCollectionCard do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :card_collection_id, :card_id, :quantity, :group, :inserted_at, :updated_at]}

  schema "card_collection_cards" do
    field :card_collection_id, :id
    field :card_id, :id
    field :quantity, :integer, default: 1
    field :group, :string

    timestamps()
  end

  @doc false
  def changeset(card_collection_card, attrs) do
    card_collection_card
    |> cast(attrs, [:card_collection_id, :card_id, :quantity, :group])
    |> validate_required([:card_collection_id, :card_id])
  end
end
