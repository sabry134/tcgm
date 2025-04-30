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
      add :width, :integer
      add :height, :integer
      add :background_color, :string
      add :z_axis, :integer
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
      add :border_radius, :integer, null: false
      add :opacity, :integer, null: false
      timestamps()
    end
  end
end
