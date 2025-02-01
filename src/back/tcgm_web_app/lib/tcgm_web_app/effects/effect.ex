defmodule TcgmWebApp.Effects.Effect do
  use Ecto.Schema
  import Ecto.Changeset
  alias TcgmWebApp.Games.Game

  schema "effects" do
    field :description, :string

    field :action_ids, {:array, :string}

    belongs_to :game, Game

    timestamps()
  end

  @doc false
  def changeset(effect, attrs) do
    effect
    |> cast(attrs, [:description, :action_ids, :game_id])
    |> validate_required([:description, :action_ids, :game_id])
  end
end
