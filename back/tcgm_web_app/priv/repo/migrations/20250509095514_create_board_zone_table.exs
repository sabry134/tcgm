defmodule TcgmWebApp.Repo.Migrations.CreateBoardZoneTable do
  use Ecto.Migration

  def change do
    create table(:board_zones) do
      add :name, :string
      add :board_id, references(:boards, on_delete: :delete_all)
      add :width, :integer
      add :height, :integer
      add :x, :integer
      add :y, :integer
      add :border_radius, :integer
      add :background_image, :string

      timestamps()
    end

    create unique_index(:board_zones, [:name, :board_id])
    create index(:board_zones, [:board_id])
  end
end
