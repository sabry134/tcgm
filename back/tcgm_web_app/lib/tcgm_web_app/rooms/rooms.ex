defmodule TcgmWebApp.Rooms.Rooms do
  alias TcgmWebApp.Rooms.RoomSupervisor

  def create_room(room_id) do
    RoomSupervisor.create_room(room_id)
  end

  def join_room(room_id, player) do
    TcgmWebApp.Rooms.RoomServer.join_room(room_id, player)
  end

  def make_move(room_id, move) do
    TcgmWebApp.Rooms.RoomServer.make_move(room_id, move)
  end
end
