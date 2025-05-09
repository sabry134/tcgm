alias TcgmWebApp.Game.GameServer
defmodule TcgmWebAppWeb.RoomControllerTest do
  use TcgmWebAppWeb.ConnCase

  setup do
    room_id = UUID.uuid4()
    TcgmWebApp.Game.RoomSupervisor.start_room(room_id)
    TcgmWebApp.Game.GameServer.join_room(room_id, "player1")
    {:ok, room_id: room_id}
  end

  test "POST /api/rooms creates a room", %{conn: conn} do
    conn = post(conn, "/api/rooms")
    assert json_response(conn, 200)["room_id"]
  end

  test "GET /api/rooms/:room_id returns state", %{conn: conn} do
    conn = post(conn, "/api/rooms")
    %{"room_id" => room_id} = json_response(conn, 200)

    conn = get(conn, "/api/rooms/#{room_id}")
    assert json_response(conn, 200)["players"] == %{}
  end

  test "POST /api/rooms/:room_id/join adds a player to the room", %{conn: conn} do
    conn = post(conn, "/api/rooms")
    %{"room_id" => room_id} = json_response(conn, 200)

    conn = post(conn, "/api/rooms/#{room_id}/join", player_id: "player1")
    assert json_response(conn, 200)["players"] == %{"player1" => %{"deck" => %{}, "field" => %{}, "graveyard" => %{}, "hand" => %{}, "health" => 20, "caster" => %{}}}
  end

  test "players can leave a room", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")
    state_before = GameServer.get_state(room_id)
    assert Map.has_key?(state_before.players, "player1")

    :ok = GameServer.leave_room(room_id, "player1")

    state_after = GameServer.get_state(room_id)
    refute Map.has_key?(state_after.players, "player1")
  end
end
