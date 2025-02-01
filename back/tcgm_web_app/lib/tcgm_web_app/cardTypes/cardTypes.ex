defmodule TcgmWebApp.CardTypes.CardTypes do
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Repo

  def create_card_type(attrs) do
    %CardType{}
    |> CardType.changeset(attrs)
    |> Repo.insert()
  end

  def get_card_type!(id) do
    Repo.get!(CardType, id)
  end

  def get_card_type(id) do
    Repo.get(CardType, id)
  end

  def list_card_types do
    Repo.all(CardType)
  end

  def delete_card_type!(id) do
    Repo.delete!(get_card_type!(id))
  end

  def update_card_type(id, attrs) do
    card_type = get_card_type!(id)
    card_type
    |> CardType.changeset(attrs)
    |> Repo.update()
  end

  def get_card_types_by_game_id(game_id) do
    Repo.get_by(CardType, game_id: game_id)
  end
end
