defmodule TcgmWebApp.Cards.Cards do
  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  def create_card(attrs) do
    %Card{}
    |> Card.changeset(attrs)
    |> Repo.insert()
  end

  def get_card!(id) do
    Repo.get!(Card, id)
  end

  def get_card(id) do
    Repo.get(Card, id)
  end

  def list_cards do
    Repo.all(Card)
  end

  def delete_card!(%Card{} = card) do
    Repo.delete!(card)
  end

  def update_card(%Card{} = card, attrs) do
    card
    |> Card.changeset(attrs)
    |> Repo.update()
  end

  def get_cards_by_game_id(game_id) do
    Repo.all(from c in Card, where: c.game_id == ^game_id)
  end
end
