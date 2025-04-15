defmodule TcgmWebApp.CardProperties.CardProperties do
  alias TcgmWebApp.CardProperties.CardProperty
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false
  @moduledoc """
    This module is responsible for handling card properties.
  """

  @doc """
    Creates a card property with the given attributes.
  """
  def create_card_property(attrs) do
    %CardProperty{}
    |> CardProperty.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a card property with the given id.
  """
  def get_card_property!(id) do
    Repo.get!(CardProperty, id)
  end

  @doc """
    Retrieves a card property with the given id.
  """
  def get_card_property(id) do
    Repo.get(CardProperty, id)
  end

  @doc """
    Retrieves all card properties.
  """
  def list_card_properties do
    Repo.all(CardProperty)
  end

  @doc """
    Deletes a card property.
  """
  def delete_card_property!(%CardProperty{} = card_property) do
    Repo.delete!(card_property)
  end

  @doc """
    Updates a card property with the given attributes.
  """
  def update_card_property(%CardProperty{} = card_property, attrs) do
    card_property
    |> CardProperty.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves a card property by it's card id.
  """
  def get_card_properties_by_card_id(card_id) do
    from(cp in CardProperty,
      where: cp.card_id == ^card_id,
      select: cp
    )
    |> Repo.all()
  end

  @doc """
    Retrieves a card property by it's card id and card type property id.
  """
  def get_card_properties_by_card_id_and_cardtype_property_id(card_id, card_type_property_id) do
    from(cp in CardProperty,
      where: cp.card_id == ^card_id and cp.cardtype_property_id == ^card_type_property_id,
      select: cp
    )
    |> Repo.all()
  end
end
