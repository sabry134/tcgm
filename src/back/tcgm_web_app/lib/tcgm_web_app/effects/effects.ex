defmodule TcgmWebApp.Effects.Effects do
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.Repo

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

  def delete_effect!(id) do
    Repo.delete!(get_effect!(id))
  end

  def update_effect(id, attrs) do
    effect = get_effect!(id)
    effect
    |> Effect.changeset(attrs)
    |> Repo.update()
  end

  def get_effects_by_game_id(game_id) do
    Repo.get_by(Effect, game_id: game_id)
  end
end
