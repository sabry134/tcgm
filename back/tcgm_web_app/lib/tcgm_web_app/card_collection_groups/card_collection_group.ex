defmodule TcgmWebApp.CardCollectionGroups.CardCollectionGroup do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :name, :game_id, :max_cards, :min_cards, :max_copies, :share_max_copies, :allowed_card_types, :collection_type, :inserted_at, :updated_at]}

  schema "card_collection_groups" do
    field :name, :string
    field :max_cards, :integer
    field :min_cards, :integer
    field :max_copies, :integer
    field :share_max_copies, :boolean
    field :allowed_card_types, {:array, :integer}
    field :game_id, :integer
    field :collection_type, :string

    timestamps()
  end

  @doc false
  def changeset(card_collection_group, attrs) do
    card_collection_group
    |> cast(attrs, [:name, :game_id, :max_cards, :min_cards, :max_copies, :share_max_copies, :allowed_card_types, :collection_type])
    |> validate_required([:name, :game_id, :max_cards, :min_cards, :max_copies, :share_max_copies, :allowed_card_types, :collection_type])
    |> validate_required([:name])
  end
end
