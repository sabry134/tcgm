defmodule TcgmWebApp.Repo.Migrations.CreateHealthChecks do
  use Ecto.Migration

  def change do
    create table(:health_checks) do
      add :status, :string

      timestamps(type: :utc_datetime)
    end
  end
end
