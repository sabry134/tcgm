defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Add a valid boolean field to card collections" do
  use Ecto.Migration

  def change do
    alter table(:card_collections) do
      add :valid, :boolean, default: false, null: false
    end

    create index(:card_collections, [:valid])
  end
end
