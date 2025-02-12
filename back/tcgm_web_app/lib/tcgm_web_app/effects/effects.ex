defmodule TcgmWebApp.Effects.Effects do
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  @moduledoc """
    This module is responsible for handling effects.
  """
  def create_effect(attrs) do
    %Effect{}
    |> Effect.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
    Retrieves an effect with the given id.
  """
  def get_effect!(id) do
    Repo.get!(Effect, id)
  end

  @doc """
    Retrieves an effect with the given id.
  """
  def get_effect(id) do
    Repo.get(Effect, id)
  end

  @doc """
    Retrieves all effects.
  """
  def list_effects do
    Repo.all(Effect)
  end

  @doc """
    Deletes an effect.
  """
  def delete_effect!(%Effect{} = effect) do
    Repo.delete!(effect)
  end

  @doc """
    Updates an effect with the given attributes.
  """
  def update_effect(%Effect{} = effect, attrs) do
    effect
    |> Effect.changeset(attrs)
    |> Repo.update()
  end

  @doc """
    Retrieves an effect by it's game id.
  """
  def get_effects_by_game_id(game_id) do
    Repo.all(from e in Effect, where: e.game_id == ^game_id)
  end
end
