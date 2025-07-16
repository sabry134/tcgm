defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Remove name constraint for cards" do
  use Ecto.Migration

  def change do
    drop_if_exists index(:cards, [:name])
  end
end
