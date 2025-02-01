defmodule TcgmWebApp.Effects.Effect do
  use Ecto.Schema
  import Ecto.Changeset

  schema "effects" do
    field :description, :string

    field :action_ids, {:array, :string}

    belongs_to :game, TcgmWebApp.Games.Game
    has_many :actions, TcgmWebApp.Actions.Action

    timestamps()
  end

  @doc false
  def changeset(effect, attrs) do
    effect
    |> cast(attrs, [:description, :action_ids, :game_id])
    |> validate_required([:description, :action_ids, :game_id])
  end
end
