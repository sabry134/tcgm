defmodule TcgmWebApp.Cards.Card do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :name, :text, :image, :game_id, :card_type_id, :effect_ids, :inserted_at, :updated_at]}

  schema "cards" do
    field :name, :string
    field :text, :string
    field :image, :string
    field :game_id, :id
    field :card_type_id, :id
    field :effect_ids, {:array, :integer}

    timestamps()
  end

  @doc false
  def changeset(card, attrs) do
    card
    |> cast(attrs, [:name, :text, :image, :game_id, :card_type_id, :effect_ids])
    |> validate_required([:name, :text, :game_id, :card_type_id, :effect_ids])
  end
end
