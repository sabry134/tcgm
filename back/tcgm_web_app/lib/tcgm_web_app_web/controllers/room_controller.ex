defmodule TcgmWebAppWeb.RoomController do
  use TcgmWebAppWeb, :controller

  def create(conn, _params) do
    room_id = UUID.uuid4()
    TcgmWebApp.Game.RoomSupervisor.start_room(room_id)
    json(conn, %{room_id: room_id})
  end

  def state(conn, %{"room_id" => room_id}) do
    state = TcgmWebApp.Game.GameServer.get_state(room_id)
    json(conn, state)
  end

  def join(conn, %{"room_id" => room_id, "player_id" => player_id}) do
    TcgmWebApp.Game.GameServer.join_room(room_id, player_id)
    state = TcgmWebApp.Game.GameServer.get_state(room_id)
    json(conn, state)
  end
end
