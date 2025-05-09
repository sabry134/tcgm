defmodule TcgmWebAppWeb.BoardControllerTest do
  use TcgmWebAppWeb.ConnCase

  alias TcgmWebApp.Boards.Board
  alias TcgmWebApp.BoardZones.BoardZone
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Repo

  setup do
    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    board = %Board{}
    |> Board.changeset(%{ game_id: game.id, background_image: "test" })
    |> Repo.insert!()

    zone = %BoardZone{}
    |> BoardZone.changeset(%{ name: "test", width: 100, height: 200, x: 0, y: 0, border_radius: 0, background_image: "test", board_id: board.id })
    |> Repo.insert!()

    {:ok, board: board, game: game, zone: zone}
  end

  test "GET /api/boards returns a list of boards", %{conn: conn, board: board} do
    conn = get(conn, "/api/boards")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn b -> b["id"] == board.id end)
    assert Enum.any?(response, fn b -> b["game_id"] == board.game_id end)
    assert Enum.any?(response, fn b -> b["background_image"] == board.background_image end)
  end

  test "PUT /api/boards/:id updates a board", %{conn: conn, board: board} do
    updated_attrs = %{background_image: "updated_image"}
    conn = put(conn, "/api/boards/#{board.id}", board: updated_attrs)
    response = json_response(conn, 200)

    assert response["id"] == board.id
    assert response["game_id"] == board.game_id
    assert response["background_image"] == updated_attrs.background_image
  end

  test "DELETE /api/boards/delete/:id deletes a board", %{conn: conn, board: board} do
    conn = delete(conn, "/api/boards/delete/#{board.id}")
    assert response(conn, 204)

    assert Repo.get(Board, board.id) == nil
  end

  test "GET /api/boards/:id returns a single board", %{conn: conn, board: board} do
    conn = get(conn, "/api/boards/#{board.id}")
    response = json_response(conn, 200)

    assert response["id"] == board.id
    assert response["game_id"] == board.game_id
    assert response["background_image"] == board.background_image
  end

  test "GET /api/boards/game/:game_id returns a board by game_id", %{conn: conn, board: board, game: game} do
    conn = get(conn, "/api/boards/game/#{game.id}")
    response = json_response(conn, 200)

    assert response["id"] == board.id
    assert response["game_id"] == game.id
    assert response["background_image"] == board.background_image
  end

  test "POST /api/boards/with_zones creates a new board with zones", %{conn: conn, board: board} do
    zone1 = %{name: "Deck", width: 100, height: 200, x: 0, y: 0, border_radius: 0, background_image: "test"}
    zone2 = %{name: "Hand", width: 100, height: 200, x: 0, y: 0, border_radius: 0, background_image: "test"}
    zones = [zone1, zone2]

    game2 = %Game{}
    |> Game.changeset(%{ name: "Test game 2", description: "Test description" })
    |> Repo.insert!()

    board_attrs = %{game_id: game2.id, background_image: board.background_image}
    conn = post(conn, "/api/boards/with_zones", board: board_attrs, zones: zones)

    response = json_response(conn, 201)

    assert response["board"]["game_id"] == game2.id
    assert response["board"]["background_image"] == board.background_image
    assert length(response["zones"]) == length(zones)
    assert Enum.any?(response["zones"], fn z -> z["name"] == zone1.name end)
    assert Enum.any?(response["zones"], fn z -> z["name"] == zone2.name end)
  end

  test "PUT /api/boads/with_zones/:id updates a board with zones", %{conn: conn, board: board, zone: zone} do
    updated_board_attrs = %{background_image: "updated_image"}
    updated_zones = [%{id: zone.id, name: "Updated Zone", width: 150, height: 250, x: 10, y: 10, border_radius: 5, background_image: "updated_test"}]

    conn = put(conn, "/api/boards/with_zones/#{board.id}", board: updated_board_attrs, zones: updated_zones)
    response = json_response(conn, 200)

    assert response["board"]["id"] == board.id
    assert response["board"]["game_id"] == board.game_id
    assert response["board"]["background_image"] == updated_board_attrs.background_image
    assert length(response["zones"]) == length(updated_zones)
    assert Enum.any?(response["zones"], fn z -> z["name"] == "Updated Zone" end)
  end

  test "GET /api/boards/with_zones/:id get a board with zones", %{conn: conn, board: board, zone: zone} do
    conn = get(conn, "/api/boards/with_zones/#{board.id}")
    response = json_response(conn, 200)

    assert response["board"]["id"] == board.id
    assert response["board"]["game_id"] == board.game_id
    assert response["board"]["background_image"] == board.background_image
    assert length(response["zones"]) > 0
    assert Enum.any?(response["zones"], fn z -> z["id"] == zone.id end)
  end

  test "GET /api/boards/:board_id/zones returns a list of zones for a board", %{conn: conn, board: board, zone: zone} do
    conn = get(conn, "/api/boards/#{board.id}/zones")
    response = json_response(conn, 200)

    assert length(response) > 0
    assert Enum.any?(response, fn z -> z["id"] == zone.id end)
    assert Enum.any?(response, fn z -> z["name"] == zone.name end)
  end

end
