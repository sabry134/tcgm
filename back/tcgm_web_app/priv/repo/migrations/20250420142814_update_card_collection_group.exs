defmodule TcgmWebApp.Repo.Migrations.UpdateCardCollectionGroup do
  use Ecto.Migration

  def change do
    alter table(:card_collection_groups) do
      # remove reference to card_collection
      remove :card_collection_id

      # add reference to game
      add :game_id, references(:games, on_delete: :delete_all)

      # add new fields
      add :collection_type, :string
    end

    # add unique index to card_collection_groups
    create unique_index(:card_collection_groups, [:name, :game_id])
    create index(:card_collection_groups, [:game_id])
  end
end
