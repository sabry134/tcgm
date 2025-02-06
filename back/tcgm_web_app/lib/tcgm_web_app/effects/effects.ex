defmodule TcgmWebApp.Effects.Effects do
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.Repo
  import Ecto.Query, warn: false

  def create_effect(attrs) do
    %Effect{}
    |> Effect.changeset(attrs)
    |> Repo.insert()
  end

  def get_effect!(id) do
    Repo.get!(Effect, id)
  end

  def get_effect(id) do
    Repo.get(Effect, id)
  end

  def list_effects do
    Repo.all(Effect)
  end

  def delete_effect!(%Effect{} = effect) do
    Repo.delete!(effect)
  end

  def update_effect(%Effect{} = effect, attrs) do
    effect
    |> Effect.changeset(attrs)
    |> Repo.update()
  end

  def get_effects_by_game_id(game_id) do
    Repo.all(from e in Effect, where: e.game_id == ^game_id)
  end
end
