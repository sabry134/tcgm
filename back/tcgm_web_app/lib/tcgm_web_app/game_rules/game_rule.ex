defmodule TcgmWebApp.GameRules.GameRule do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :starting_hand_size, :max_hand_size, :draw_per_turn, :game_id, :public_template, :inserted_at, :updated_at]}

  schema "game_rules" do
    field :game_id, :id
    field :starting_hand_size, :integer
    field :max_hand_size, :integer
    field :draw_per_turn, :integer
    field :public_template, :boolean
    timestamps()
  end

  @doc false
  def changeset(rules, attrs) do
    rules
    |> cast(attrs, [:starting_hand_size, :max_hand_size, :draw_per_turn, :game_id, :public_template])
    |> validate_required([:starting_hand_size, :max_hand_size, :draw_per_turn, :game_id])
  end
end
