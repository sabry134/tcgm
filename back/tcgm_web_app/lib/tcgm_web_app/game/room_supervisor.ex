defmodule TcgmWebApp.Game.RoomSupervisor do
  use DynamicSupervisor

  def start_link(_opts) do
    DynamicSupervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    DynamicSupervisor.init(strategy: :one_for_one)
  end

  def start_room(room_id) do
    spec = {TcgmWebApp.Game.GameServer, room_id}
    DynamicSupervisor.start_child(__MODULE__, spec)
  end
end
