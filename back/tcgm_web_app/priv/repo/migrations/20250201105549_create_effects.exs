defmodule TcgmWebApp.Repo.Migrations.CreateEffects do
  use Ecto.Migration

  def change do
    create table(:effects) do
      add :description, :string, null: false

      add :action_ids, {:array, :string}, null: false

      add :game_id, references(:games, on_delete: :delete_all), null: false

      timestamps()
    end

  end
end
