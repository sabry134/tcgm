defmodule TcgmWebApp.CardCollections.CardCollection do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :name, :quantity, :game_id, :user_id, :type, :public_template, :inserted_at, :updated_at]}

  schema "card_collections" do
    field :name, :string
    field :quantity, :integer, default: 0
    field :game_id, :id
    field :user_id, :id
    field :type, :string
    field :public_template, :boolean

    timestamps()
  end

  @doc false
  def changeset(card_collection, attrs) do
    card_collection
    |> cast(attrs, [:name, :quantity, :game_id, :user_id, :type, :public_template])
    |> validate_required([:name, :game_id, :type])
  end
end
