defmodule TcgmWebApp.CardTypes.CardTypes do
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  @moduledoc """
    This module is responsible for handling card types.
  """

  @doc """
    Creates a card type with the given attributes.
  """
  def create_cardType(attrs) do
    %CardType{}
    |> CardType.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a card type with the given id.
  """
  def get_cardType!(id) do
    Repo.get!(CardType, id)
  end

  @doc """
    Retrieves a card type with the given id.
  """
  def get_cardType(id) do
    Repo.get(CardType, id)
  end

  @doc """
    Retrieves all card types.
  """
  def list_cardTypes do
    Repo.all(CardType)
  end

  @doc """
    Deletes a card type.
  """
  def delete_cardType!(%CardType{} = cardType) do
    Repo.delete!(cardType)
  end

  @doc """
    Updates a card type with the given attributes.
  """
  def update_cardType(%CardType{} = cardType, attrs) do
    cardType
    |> CardType.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves a card type by it's game id.
  """
  def get_cardTypes_by_game_id(game_id) do
    Repo.all(from c in CardType, where: c.game_id == ^game_id)
  end

end
