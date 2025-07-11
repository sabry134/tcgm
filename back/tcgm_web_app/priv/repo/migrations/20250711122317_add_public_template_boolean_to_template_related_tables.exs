defmodule TcgmWebApp.Repo.Migrations.AddPublicTemplateBooleanToTemplateRelatedTables do
  use Ecto.Migration

  def change do
    alter table(:game_rules) do
      add :public_template, :boolean, default: false, null: false
    end

    alter table(:boards) do
      add :public_template, :boolean, default: false, null: false
    end

    alter table(:card_collections) do
      add :public_template, :boolean, default: false, null: false
    end

    alter table(:types) do
      add :public_template, :boolean, default: false, null: false
    end
  end
end
