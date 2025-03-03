defmodule TcgmWebApp.Cards.Cards do
  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  @moduledoc """
    This module is responsible for handling cards.
  """

  @doc """
    Creates a card with the given attributes.
  """
  def create_card(attrs) do
    %Card{}
    |> Card.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a card with the given id.
  """
  def get_card!(id) do
    Repo.get!(Card, id)
  end

  @doc """
    Retrieves a card with the given id.
  """
  def get_card(id) do
    Repo.get(Card, id)
  end

  @doc """
    Retrieves all cards.
  """
  def list_cards do
    Repo.all(Card)
  end

  @doc """
    Deletes a card.
  """
  def delete_card!(%Card{} = card) do
    Repo.delete!(card)
  end

  @doc """
    Updates a card with the given attributes.
  """
  def update_card(%Card{} = card, attrs) do
    card
    |> Card.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves a card by it's game id.
  """
  def get_cards_by_game_id(game_id) do
    Repo.all(from c in Card, where: c.game_id == ^game_id)
  end

  @doc """
    Retrieves a card by it's name.
  """
  def get_card_by_name(name) do
    Repo.all(from c in Card, where: c.name == ^name)
  end

  @doc """
    Retrieves cards by names.
  """
  def get_cards_by_names(names) do
    Repo.all(from c in Card, where: c.name in ^names)
  end
end
