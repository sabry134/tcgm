defmodule TcgmWebApp.Repo.Migrations.CreateCardProperty do
  use Ecto.Migration

  def change do
    create table(:card_property) do
      add :card_id, references(:cards, on_delete: :delete_all), null: false
      add :cardtype_property_id, references(:cardtype_property, on_delete: :nothing), null: false

      add :value_string, :string
      add :value_number, :integer
      add :value_boolean, :boolean

      timestamps()
    end

    create unique_index(:card_property, [:card_id, :cardtype_property_id])
    create index(:card_property, [:card_id])
    create index(:card_property, [:cardtype_property_id])

    create index(:card_property, [:value_string, :cardtype_property_id])
    create index(:card_property, [:value_number, :cardtype_property_id])
    create index(:card_property, [:value_boolean, :cardtype_property_id])
  end
end
