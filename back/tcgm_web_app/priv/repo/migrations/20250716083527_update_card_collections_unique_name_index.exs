defmodule TcgmWebApp.Repo.Migrations.UpdateCardCollectionsUniqueNameIndex do
  use Ecto.Migration

  def change do
    drop index(:card_collections, [:name])
    create unique_index(:card_collections, [:name, :user_id])
  end
end
