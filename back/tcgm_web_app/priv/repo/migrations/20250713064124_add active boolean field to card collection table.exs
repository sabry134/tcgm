defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Add active boolean field to card collection table" do
  use Ecto.Migration

  def change do
    alter table(:card_collections) do
      add :active, :boolean, default: false, null: false
    end

    create unique_index(:card_collections, [:game_id, :type],
      where: "active = true",
      name: :unique_active_card_collection_per_game_and_type
    )
  end
end
