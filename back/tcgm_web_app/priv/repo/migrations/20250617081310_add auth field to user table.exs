defmodule TcgmWebApp.Repo.Migrations.AddPasswordHashToUserTable do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :password_hash, :string
      add :email, :string
    end
  end
end
