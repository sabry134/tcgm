defmodule TcgmWebApp.Repo.Migrations.CreateCardCollectionGroup do
  use Ecto.Migration

  def change do
    create table(:card_collection_groups) do
      add :name, :string
      add :card_collection_id, references(:card_collections, on_delete: :delete_all)
      add :max_cards, :integer
      add :min_cards, :integer
      add :max_copies, :integer
      add :share_max_copies, :boolean
      add :allowed_card_types, {:array, :integer}

      timestamps()
    end

    create unique_index(:card_collection_groups, [:name, :card_collection_id])
    create index(:card_collection_groups, [:card_collection_id])
  end
end
