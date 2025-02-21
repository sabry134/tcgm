defmodule TcgmWebApp.CardCollections.CardCollections do
  alias TcgmWebApp.CardCollections.CardCollection
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  @moduledoc """
    This module is responsible for handling card collections.
  """

  @doc """
    Creates a card collection with the given attributes.
  """
  def create_card_collection(attrs) do
    %CardCollection{}
    |> CardCollection.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a card collection with the given id.
  """
  def get_card_collection!(id) do
    Repo.get!(CardCollection, id)
  end

  @doc """
    Retrieves a card collection with the given id.
  """
  def get_card_collection(id) do
    Repo.get(CardCollection, id)
  end

  @doc """
    Retrieves all card collections.
  """
  def list_card_collections do
    Repo.all(CardCollection)
  end

  @doc """
    Deletes a card collection.
  """
  def delete_card_collection!(%CardCollection{} = card_collection) do
    Repo.delete!(card_collection)
  end

  @doc """
    Updates a card collection with the given attributes.
  """
  def update_card_collection(%CardCollection{} = card_collection, attrs) do
    card_collection
    |> CardCollection.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves a card collection by it's game id.
  """
  def get_card_collections_by_game_id(game_id) do
    Repo.all(from c in CardCollection, where: c.game_id == ^game_id)
  end

  @doc """
    Retrieves a card collection by it's game id and type.
  """
  def get_card_collections_by_game_id_and_type(game_id, type) do
    Repo.all(from c in CardCollection, where: c.game_id == ^game_id and c.type == ^type)
  end
end
