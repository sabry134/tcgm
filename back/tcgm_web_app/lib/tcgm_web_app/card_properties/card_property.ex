defmodule TcgmWebApp.CardProperties.CardProperty do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :card_id, :cardtype_property_id, :value_string, :value_number, :value_boolean, :inserted_at, :updated_at]}

  schema "card_property" do
    field :card_id, :id
    field :cardtype_property_id, :id
    field :value_string, :string
    field :value_number, :integer
    field :value_boolean, :boolean

    timestamps()
  end

  @doc false
  def changeset(card_property, attrs) do
    card_property
    |> cast(attrs, [:card_id, :cardtype_property_id, :value_string, :value_number, :value_boolean])
    |> validate_required([:card_id, :cardtype_property_id])
  end
end
