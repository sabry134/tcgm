defmodule TcgmWebAppWeb.RoomControllerTest do
  use TcgmWebAppWeb.ConnCase

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
    assert json_response(conn, 200)["players"] == %{"player1" => %{"deck" => %{}, "field" => %{}, "graveyard" => %{}, "hand" => %{}}}
  end
end
