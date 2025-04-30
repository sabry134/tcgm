defmodule TcgmWebApp.CardTypeProperties.CardTypeProperty do
  use Ecto.Schema
  import Ecto.Changeset

  @derive {Jason.Encoder, only: [:id, :property_name, :cardtype_id, :type, :value, :variant, :mutable,
                                :width, :height, :background_color, :font, :font_size, :font_color,
                                :position_x, :position_y, :rotation, :scale_x, :scale_y, :border_width,
                                :border_color, :border_radius, :opacity, :z_axis, :inserted_at, :updated_at]}

  schema "cardtype_property" do
    field :property_name, :string
    field :cardtype_id, :id
    field :type, :string
    field :value, :string
    field :variant, :string
    field :mutable, :boolean
    field :width, :integer
    field :height, :integer
    field :background_color, :string
    field :font, :string
    field :font_size, :integer
    field :font_color, :string
    field :position_x, :integer
    field :position_y, :integer
    field :rotation, :integer
    field :scale_x, :integer
    field :scale_y, :integer
    field :border_width, :integer
    field :border_color, :string
    field :border_radius, :integer
    field :opacity, :integer
    field :z_axis, :integer

    timestamps()
  end

  @doc false
  def changeset(cardtype_property, attrs) do
    cardtype_property
    |> cast(attrs, [:property_name, :cardtype_id, :type, :value, :variant, :mutable,
                    :width, :height, :background_color, :font, :font_size, :font_color,
                    :position_x, :position_y, :rotation, :scale_x, :scale_y, :border_width,
                    :border_color, :border_radius, :opacity, :z_axis])
    |> validate_required([:property_name, :cardtype_id, :type, :position_x, :position_y, :rotation, :scale_x, :scale_y])
  end
end
