defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Add user game role table" do
  use Ecto.Migration

  def change do
    create table(:user_game_roles) do
      add :role_name, :string, null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :game_id, references(:games, on_delete: :delete_all), null: false

      timestamps()
    end

    create unique_index(:user_game_roles, [:user_id, :role_name], name: :unique_user_game_role)
  end
end
