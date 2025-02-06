defmodule TcgmWebApp.CardTypes.CardTypes do
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

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

  def delete_cardType!(%CardType{} = cardType) do
    Repo.delete!(cardType)
  end

  def update_cardType(%CardType{} = cardType, attrs) do
    cardType
    |> CardType.changeset(attrs)
    |> Repo.update()
  end

  def get_cardTypes_by_game_id(game_id) do
    Repo.all(from c in CardType, where: c.game_id == ^game_id)
  end

end
