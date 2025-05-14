defmodule TcgmWebApp.BoardZones.BoardZone do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :name, :board_id, :width, :height, :x, :y, :border_radius, :background_image, :inserted_at, :updated_at]}

  schema "board_zones" do
    field :name, :string
    field :width, :integer
    field :height, :integer
    field :x, :integer
    field :y, :integer
    field :border_radius, :integer
    field :background_image, :string

    belongs_to :board, TcgmWebApp.Boards.Board

    timestamps()
  end

  @doc false
  def changeset(board_zone, attrs) do
    board_zone
    |> cast(attrs, [:name, :board_id, :width, :height, :x, :y, :border_radius, :background_image])
    |> validate_required([:name, :board_id, :width, :height, :x, :y, :border_radius])
  end
end
