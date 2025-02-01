defmodule TcgmWebApp.CardTypes.CardTypes do
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Repo

  def create_cardType(attrs) do
    %CardType{}
    |> CardType.changeset(attrs)
    |> Repo.insert()
  end

  def get_cardType!(id) do
    Repo.get!(CardType, id)
  end

  def get_cardType(id) do
    Repo.get(CardType, id)
  end

  def list_cardTypes do
    Repo.all(CardType)
  end

  def delete_cardType!(id) do
    Repo.delete!(get_cardType!(id))
  end

  def update_cardType(id, attrs) do
    card_type = get_cardType!(id)
    card_type
    |> CardType.changeset(attrs)
    |> Repo.update()
  end

  def get_cardTypes_by_game_id(game_id) do
    Repo.get_by(CardType, game_id: game_id)
  end
end
