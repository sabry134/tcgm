defmodule TcgmWebApp.Repo.Migrations.UpdateBoardZonesToAcceptFloats do
  use Ecto.Migration

  def change do
    alter table(:board_zones) do
      modify :width, :float
      modify :height, :float
      modify :x, :float
      modify :y, :float
      modify :border_radius, :float
    end
  end
end
