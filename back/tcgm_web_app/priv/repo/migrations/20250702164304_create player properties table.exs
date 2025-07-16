defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Create player properties table" do
  use Ecto.Migration

  def change do
    create table(:player_properties) do
      add :game_rule_id, references(:game_rules, on_delete: :delete_all)
      add :property_name, :string
      add :value, :integer
      timestamps()
    end

    create unique_index(:player_properties, [:game_rule_id, :property_name])
  end
end
