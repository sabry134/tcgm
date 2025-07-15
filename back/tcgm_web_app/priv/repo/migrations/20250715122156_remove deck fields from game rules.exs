defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Remove deck fields from game rules" do
  use Ecto.Migration

  def change do
    alter table(:game_rules) do
      remove :min_deck_size
      remove :max_deck_size
    end
  end
end
