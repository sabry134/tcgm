defmodule TcgmWebApp.Repo.Migrations.CreateCards do
  use Ecto.Migration

  def change do
    create table(:cards) do
      add :name, :string, null: false
      add :text, :string, null: false
      add :image, :string, null: false

      add :effect_ids, {:array, :integer}, null: false

      add :game_id, references(:games, on_delete: :delete_all), null: false
      add :card_type_id, references(:types, on_delete: :delete_all), null: false

      timestamps()
    end

    create unique_index(:cards, [:name])
  end
end
