defmodule TcgmWebApp.Repo.Migrations.UpdateCardCollectionsUniqueActiveIndex do
  use Ecto.Migration

  def change do
    drop_if_exists index(:card_collections, [:game_id, :type], name: :unique_active_card_collection_per_game_and_type)

    create unique_index(:card_collections, [:game_id, :type, :user_id],
      where: "active = true",
      name: :unique_active_card_collection_per_game_type_user
    )
  end
end
