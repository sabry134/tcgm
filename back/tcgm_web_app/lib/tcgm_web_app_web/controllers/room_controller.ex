defmodule TcgmWebAppWeb.RoomController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path(:create) do
    post("/rooms")
    description("Create a new room")
    response(code(:created), "Room created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, _params) do
    room_id = UUID.uuid4()
    TcgmWebApp.Game.RoomSupervisor.start_room(room_id)
    json(conn, %{room_id: room_id})
  end

  swagger_path(:state) do
    get("/rooms/{room_id}")
    description("Get the state of a room")
    parameter("room_id", :path, :string, "Room ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Room not found")
  end

  def state(conn, %{"room_id" => room_id}) do
    state = TcgmWebApp.Game.GameServer.get_state(room_id)
    json(conn, state)
  end

  swagger_path(:join) do
    post("/rooms/join")
    description("Join a room")
    parameter(:body, :body, Schema.ref(:RoomRequest), "Room request payload", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Room not found")
  end

  def join(conn, %{"room_id" => room_id, "player_id" => player_id}) do
    TcgmWebApp.Game.GameServer.join_room(room_id, player_id)
    state = TcgmWebApp.Game.GameServer.get_state(room_id)
    json(conn, state)
  end
end
