defmodule TcgmWebApp.Boards.Board do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :game_id, :background_image, :public_template, :inserted_at, :updated_at]}

  schema "boards" do
    field :background_image, :string
    field :game_id, :integer
    field :public_template, :boolean

    timestamps()
  end

  @doc false
  def changeset(board, attrs) do
    board
    |> cast(attrs, [:game_id, :background_image, :public_template])
    |> validate_required([:game_id])
  end
end
