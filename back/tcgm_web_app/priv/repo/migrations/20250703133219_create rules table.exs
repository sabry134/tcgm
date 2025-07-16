defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Create rules table" do
  use Ecto.Migration

  def change do
    create table(:rules) do
      add :game_rule_id, references(:game_rules, on_delete: :delete_all)
      add :rule_name, :string
      add :value, :integer
      timestamps()
    end

    create unique_index(:rules, [:rule_name, :game_rule_id])
  end
end
