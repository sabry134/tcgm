defmodule TcgmWebApp.Game.RoomSupervisor do
  use DynamicSupervisor

  @moduledoc """
    This module is responsible for handling rooms.
  """

  @doc """
    Starts the supervisor.
  """
  def start_link(_opts) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  @doc """
    Initializes the supervisor.
  """
  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  @doc """
    Starts a room with the given id.
  """
  def start_room(room_id) do
    spec = {TcgmWebApp.Game.GameServer, room_id}
    DynamicSupervisor.start_child(__MODULE__, spec)
  end
end
