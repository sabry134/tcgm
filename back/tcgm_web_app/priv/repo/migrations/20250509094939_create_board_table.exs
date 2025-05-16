defmodule TcgmWebApp.Repo.Migrations.CreateBoardTable do
  use Ecto.Migration

  def change do
    create table(:boards) do
      add :game_id, references(:games, on_delete: :delete_all)
      add :background_image, :string

      timestamps()
    end

    create unique_index(:boards, [:game_id])
  end
end
