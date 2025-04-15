defmodule TcgmWebApp.Repo.Migrations.CreateCardCollectionCards do
  use Ecto.Migration

  def change do
    create table(:card_collection_cards) do
      add :card_collection_id, references(:card_collections, on_delete: :delete_all)
      add :card_id, references(:cards, on_delete: :delete_all)
      add :quantity, :integer, default: 1, null: false
      add :group, :string, null: false

      timestamps()
    end

    create unique_index(:card_collection_cards, [:card_collection_id, :card_id, :group])
  end
end
