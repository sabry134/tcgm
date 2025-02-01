defmodule TcgmWebApp.Health.Check do
  use Ecto.Schema
  import Ecto.Changeset

  schema "health_checks" do
    field :status, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(check, attrs) do
    check
    |> cast(attrs, [:status])
    |> validate_required([:status])
  end
end
