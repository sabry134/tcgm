defmodule TcgmWebApp.Repo.Migrations.AddCardCollectionTable do
  use Ecto.Migration

  def change do
    create table(:card_collections) do
      add :name , :string, null: false
      add :quantity, :integer, default: 0
      add :game_id, references(:games, on_delete: :delete_all), null: false
      add :type , :string, null: false
      timestamps()
    end

    create unique_index(:card_collections, [:name])
  end
end
