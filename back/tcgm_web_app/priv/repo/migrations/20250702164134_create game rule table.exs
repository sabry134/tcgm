defmodule :"Elixir.TcgmWebApp.Repo.Migrations.Create game rule table" do
  use Ecto.Migration

  def change do
    create table(:game_rules) do
      add :game_id, references(:games, on_delete: :delete_all)
      add :starting_hand_size, :integer
      add :min_deck_size, :integer
      add :max_deck_size, :integer
      add :max_hand_size, :integer
      add :draw_per_turn, :integer
      timestamps()
    end

    create unique_index(:games, [:id])
  end
end
