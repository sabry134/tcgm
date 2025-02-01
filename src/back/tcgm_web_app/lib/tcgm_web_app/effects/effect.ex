defmodule TcgmWebApp.Effects.Effect do
  use Ecto.Schema
  import Ecto.Changeset

  schema "effects" do
    field :description, :string

    field :action_ids, {:array, :string}

    field :game_id, :id

    timestamps()
  end

  @doc false
  def changeset(effect, attrs) do
    effect
    |> cast(attrs, [:description, :action_ids, :game_id])
    |> validate_required([:description, :action_ids, :game_id])
  end
end
