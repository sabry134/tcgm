defmodule TcgmWebApp.CardCollectionGroups.CardCollectionGroups do
  alias TcgmWebApp.CardCollectionGroups.CardCollectionGroup
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  @moduledoc """
    This module is responsible for handling card collection groups.
  """

  @doc """
    Creates a card collection group with the given attributes.
  """
  def create_card_collection_group(attrs) do
    %CardCollectionGroup{}
    |> CardCollectionGroup.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a card collection group with the given id.
  """
  def get_card_collection_group!(id) do
    Repo.get!(CardCollectionGroup, id)
  end

  @doc """
    Retrieves all card collection groups.
  """
  def list_card_collection_groups() do
    Repo.all(CardCollectionGroup)
  end

  @doc """
    Deletes a card collection group.
  """
  def delete_card_collection_group!(%CardCollectionGroup{} = card_collection_group) do
    Repo.delete!(card_collection_group)
  end

  @doc """
    Updates a card collection group with the given attributes.
  """
  def update_card_collection_group(%CardCollectionGroup{} = card_collection_group, attrs) do
    card_collection_group
    |> CardCollectionGroup.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves card collection groups by card collection ids.
  """
  def get_card_collection_groups_by_game_id(game_id) do
    from(ccg in CardCollectionGroup,
      where: ccg.game_id == ^game_id
    )
    |> Repo.all()
  end

  def get_card_collection_id_by_game_id_and_collection_type(game_id, collection_type) do
    from(ccg in CardCollectionGroup,
      where: ccg.game_id == ^game_id and ccg.collection_type == ^collection_type
    )
    |> Repo.all()
  end
end
