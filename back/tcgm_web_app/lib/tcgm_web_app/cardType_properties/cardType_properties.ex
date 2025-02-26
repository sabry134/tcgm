defmodule TcgmWebApp.CardTypeProperties.CardTypeProperties do

  alias TcgmWebApp.CardTypeProperties.CardTypeProperty
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  @moduledoc """
    This module is responsible for handling card type properties.
  """

  @doc """
    Creates a card type property with the given attributes.
  """
  def create_card_type_property(attrs) do
    %CardTypeProperty{}
    |> CardTypeProperty.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a card type property with the given id.
  """
  def get_card_type_property!(id) do
    Repo.get!(CardTypeProperty, id)
  end

  @doc """
    Retrieves a card type property with the given id.
  """
  def get_card_type_property(id) do
    Repo.get(CardTypeProperty, id)
  end

  @doc """
    Retrieves all card type properties.
  """
  def list_card_type_properties do
    Repo.all(CardTypeProperty)
  end

  @doc """
    Deletes a card type property.
  """
  def delete_card_type_property!(%CardTypeProperty{} = card_type_property) do
    Repo.delete!(card_type_property)
  end

  @doc """
    Updates a card type property with the given attributes.
  """
  def update_card_type_property(%CardTypeProperty{} = card_type_property, attrs) do
    card_type_property
    |> CardTypeProperty.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves a card type property by it's card type id.
  """
  def get_card_type_properties_by_card_type_id(cardType_id) do
    Repo.all(from c in CardTypeProperty, where: c.cardtype_id == ^cardType_id)
  end

  @doc """
    Retrieves a card type property by it's card type id and property name.
  """
  def get_card_type_properties_by_card_type_id_and_property_name(cardType_id, property_name) do
    Repo.all(from c in CardTypeProperty, where: c.cardtype_id == ^cardType_id and c.property_name == ^property_name)
  end

end
