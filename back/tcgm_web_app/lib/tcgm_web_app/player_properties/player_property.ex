defmodule TcgmWebApp.PlayerProperties.PlayerProperty do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :property_name, :game_rule_id, :value, :inserted_at, :updated_at]}

  schema "player_properties" do
    field :property_name, :string
    field :value, :integer
    field :game_rule_id, :id

    timestamps()
  end

  @doc false
  def changeset(player_property, attrs) do
    player_property
    |> cast(attrs, [:property_name, :value, :game_rule_id])
    |> validate_required([:property_name, :value, :game_rule_id])
  end
end
