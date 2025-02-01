defmodule TcgmWebApp.Cards.Cards do
  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Repo

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

  def delete_card!(id) do
    Repo.delete!(get_card!(id))
  end

  def update_card(id, attrs) do
    card = get_card!(id)
    card
    |> card.changeset(attrs)
    |> Repo.update()
  end
end
