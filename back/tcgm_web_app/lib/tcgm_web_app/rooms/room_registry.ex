defmodule TcgmWebApp.Rooms.RoomRegistry do
  @moduledoc "Registry for tracking active game rooms"

  def child_spec(_opts) do
    %{
      id: __MODULE__,
      start: {Registry, :start_link, [[keys: :unique, name: __MODULE__]]},
      type: :supervisor
    }
  end
end
