defmodule TcgmWebApp.PlayerProperties.PlayerProperties do
  alias TcgmWebApp.PlayerProperties.PlayerProperty
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false
  @moduledoc """
    This module is responsible for handling card properties.
  """

  @doc """
    Creates a player property with the given attributes.
  """
  def create_player_property(attrs) do
    %PlayerProperty{}
    |> PlayerProperty.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves a player property with the given id.
  """
  def get_player_property!(id) do
    Repo.get!(PlayerProperty, id)
  end

  @doc """
    Retrieves a player property with the given id.
  """
  def get_player_property(id) do
    Repo.get(PlayerProperty, id)
  end

  @doc """
    Retrieves all player properties.
  """
  def list_player_properties do
    Repo.all(PlayerProperty)
  end

  @doc """
    Deletes a player property.
  """
  def delete_player_property!(%PlayerProperty{} = player_property) do
    Repo.delete!(player_property)
  end

  @doc """
    Updates a player property with the given attributes.
  """
  def update_player_property(%PlayerProperty{} = player_property, attrs) do
    player_property
    |> PlayerProperty.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves a player property by it's game_rule id.
  """
  def get_player_properties_by_game_rule_id(game_rule_id) do
    from(pp in PlayerProperty,
      where: pp.game_rule_id == ^game_rule_id,
      select: pp
    )
    |> Repo.all()
  end
end
