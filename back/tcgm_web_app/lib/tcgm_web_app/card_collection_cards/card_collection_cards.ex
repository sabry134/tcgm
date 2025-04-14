defmodule TcgmWebApp.CardCollectionCards.CardCollectionCards do
  alias TcgmWebApp.CardCollectionCards.CardCollectionCard
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  @moduledoc """
    This module is responsible for handling card collection cards.
  """

  @doc """
    Creates a card collection card with the given attributes.
  """
  def create_card_collection_card(attrs) do
    %CardCollectionCard{}
    |> CardCollectionCard.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a card collection card with the given id.
  """
  def get_card_collection_card!(id) do
    Repo.get!(CardCollectionCard, id)
  end

  @doc """
    Retrieves a card collection card with the given id.
  """
  def get_card_collection_card(id) do
    Repo.get(CardCollectionCard, id)
  end

  @doc """
    Retrieves all card collection cards.
  """
  def list_card_collection_cards do
    Repo.all(CardCollectionCard)
  end

  @doc """
    Deletes a card collection card.
  """
  def delete_card_collection_card!(%CardCollectionCard{} = card_collection_card) do
    Repo.delete!(card_collection_card)
  end

  @doc """
    Updates a card collection card with the given attributes.
  """
  def update_card_collection_card(%CardCollectionCard{} = card_collection_card, attrs) do
    card_collection_card
    |> CardCollectionCard.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves a card collection card by it's card collection id.
  """
  def get_card_collection_cards_by_card_collection_id(card_collection_id) do
    Repo.all(from c in CardCollectionCard, where: c.card_collection_id == ^card_collection_id)
  end

  @doc """
    Retrieves a card collection card by it's card collection id and group.
  """
  def get_card_collection_cards_by_card_collection_id_and_group(card_collection_id, group) do
    Repo.all(from c in CardCollectionCard, where: c.card_collection_id == ^card_collection_id and c.group == ^group)
  end

  @doc """
    Retrieves a card collection card by it's card collection id and card id.
  """
  def get_card_collection_cards_by_card_collection_id_and_card_id(card_collection_id, card_id) do
    Repo.one(from c in CardCollectionCard, where: c.card_collection_id == ^card_collection_id and c.card_id == ^card_id)
  end
end
