defmodule TcgmWebApp.CardTypeProperties.CardTypeProperty do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :property_name, :cardtype_id, :type, :font, :font_size, :font_color, :position_x, :position_y, :rotation, :scale_x, :scale_y, :image, :image_width, :image_height, :image_position_x, :image_position_y, :image_rotation, :image_scale_x, :image_scale_y, :image_opacity, :inserted_at, :updated_at]}

  schema "cardtype_property" do
    field :property_name, :string
    field :cardtype_id, :id
    field :type, :string
    field :font, :string
    field :font_size, :integer
    field :font_color, :string
    field :position_x, :integer
    field :position_y, :integer
    field :rotation, :integer
    field :scale_x, :integer
    field :scale_y, :integer
    field :image, :string
    field :image_width, :integer
    field :image_height, :integer
    field :image_position_x, :integer
    field :image_position_y, :integer
    field :image_rotation, :integer
    field :image_scale_x, :integer
    field :image_scale_y, :integer
    field :image_opacity, :integer

    timestamps()
  end

  @doc false
  def changeset(cardtype_property, attrs) do
    cardtype_property
    |> cast(attrs, [:property_name, :cardtype_id, :type, :font, :font_size, :font_color, :position_x, :position_y, :rotation, :scale_x, :scale_y, :image, :image_width, :image_height, :image_position_x, :image_position_y, :image_rotation, :image_scale_x, :image_scale_y, :image_opacity])
    |> validate_required([:property_name, :cardtype_id, :type, :position_x, :position_y, :rotation, :scale_x, :scale_y])
  end

end
