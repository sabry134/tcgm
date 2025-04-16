defmodule TcgmWebApp.Repo.Migrations.CreateTypes do
  use Ecto.Migration

  def change do
    create table(:types) do
      add :name, :string, null: false

      add :game_id, references(:games, on_delete: :delete_all), null: false

      timestamps()
    end

    create unique_index(:types, [:name])

  end
end
