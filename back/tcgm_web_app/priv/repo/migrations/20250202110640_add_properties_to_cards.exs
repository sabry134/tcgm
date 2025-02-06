defmodule TcgmWebApp.Repo.Migrations.AddPropertiesToCards do
  use Ecto.Migration

  def change do
    alter table(:cards) do
      add :properties, {:array, :string}, null: false
    end
  end
end
