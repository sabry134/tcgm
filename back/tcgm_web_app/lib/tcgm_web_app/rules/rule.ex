defmodule TcgmWebApp.Rules.Rule do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :rule_name, :value, :game_rule_id, :inserted_at, :updated_at]}

  schema "rules" do
    field :rule_name, :string
    field :value,  :integer
    field :game_rule_id, :id

    timestamps()
  end

  @doc false
  def changeset(rules, attrs) do
    rules
    |> cast(attrs, [:rule_name, :value, :game_rule_id])
    |> validate_required([:rule_name, :value, :game_rule_id])
  end
end
