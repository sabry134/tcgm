defmodule TcgmWebApp.Actions.Action do
  use Ecto.Schema
  import Ecto.Changeset

  schema "actions" do
    field :name, :string
    field :description, :string

    timestamps()
  end

  @doc false
  def changeset(action, attrs) do
    action
    |> cast(attrs, [:name, :description])
    |> validate_required([:name, :description])
  end
end
