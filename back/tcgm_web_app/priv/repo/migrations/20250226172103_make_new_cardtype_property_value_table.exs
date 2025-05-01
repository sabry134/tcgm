defmodule TcgmWebApp.Repo.Migrations.MakeNewCardtypeProperty do
  use Ecto.Migration

  def change do
    create table(:cardtype_property) do
      add :property_name, :string, null: false
      add :cardtype_id, references(:types, on_delete: :delete_all), null: false
      add :type, :string, null: false
      add :value, :string, null: false
      add :variant, :string, null: false
      add :mutable, :boolean, null: false
      add :font, :string, null: true
      add :font_size, :integer, null: true
      add :font_color, :string, null: true
      add :position_x, :integer, null: false
      add :position_y, :integer, null: false
      add :rotation, :integer, null: false
      add :scale_x, :integer, null: false
      add :scale_y, :integer, null: false
      add :border_width, :integer, null: false
      add :border_color, :string, null: false
      add :border_radius, :string, null: false
      add :opacity, :int, null: false
      add :image, :string, null: true
      add :image_width, :integer, null: true
      add :image_height, :integer, null: true
      add :image_position_x, :integer, null: true
      add :image_position_y, :integer, null: true
      add :image_rotation, :integer, null: true
      add :image_scale_x, :integer, null: true
      add :image_scale_y, :integer, null: true
      add :image_opacity, :integer, null: true
      timestamps()
    end
  end
end
