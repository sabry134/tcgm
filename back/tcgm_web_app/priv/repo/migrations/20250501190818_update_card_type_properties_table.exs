defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Update card type properties table" do
  use Ecto.Migration

  def change do
    alter table(:cardtype_property) do
      remove :image
      remove :image_width
      remove :image_height
      remove :image_position_x
      remove :image_position_y
      remove :image_rotation
      remove :image_scale_x
      remove :image_scale_y
      remove :image_opacity
      remove :border_radius
      add :border_radius, :integer
      add :width, :integer
      add :height, :integer
      add :background_color, :string
      add :z_axis, :integer
    end
  end
end
