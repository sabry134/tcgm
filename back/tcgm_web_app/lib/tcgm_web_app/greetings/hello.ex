defmodule TcgmWebApp.Greetings.Hello do
  use Ecto.Schema
  import Ecto.Changeset

  schema "hellos" do
    field :message, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(hello, attrs) do
    hello
    |> cast(attrs, [:message])
    |> validate_required([:message])
  end
end
