defmodule TcgmWebAppWeb.BoardController do
  use TcgmWebAppWeb, :controller
  import Plug.Conn.Status, only: [code: 1]
  use PhoenixSwagger

  alias TcgmWebApp.BoardZones.BoardZones
  alias TcgmWebApp.Boards.Boards
  alias TcgmWebApp.BoardZones.BoardZones
  alias TcgmWebAppWeb.Schemas

  def swagger_definitions, do: Schemas.swagger_definitions()

  swagger_path :index do
    get("/boards")
    description("List all boards")
    response(code(:ok), "Success")
  end

  def index(conn, _params) do
    boards = Boards.list_boards()
    json(conn, boards)
  end

  swagger_path :show do
    get("/boards/{id}")
    description("Get a board by ID")
    parameter("id", :path, :integer, "Board ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Board not found")
  end

  def show(conn, %{"id" => id}) do
    board = Boards.get_board!(id)
    json(conn, board)
  end

  swagger_path :create do
    post("/boards")
    description("Create a new board")
    parameter(:body, :body, Schema.ref(:BoardRequest), "Board request payload", required: true)
    response(code(:created), "Board created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create(conn, %{"board" => board_params}) do
    case Boards.create_board(board_params) do
      {:ok, board} ->
        conn
        |> put_status(:created)
        |> json(board)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update do
    put("/boards/{id}")
    description("Update a board by ID")
    parameter("id", :path, :integer, "Board ID", required: true)
    parameter(:body, :body, Schema.ref(:BoardRequest), "Board request payload", required: true)
    response(code(:ok), "Board updated")
    response(code(:not_found), "Board not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update(conn, %{"id" => id, "board" => board_params}) do
    board = Boards.get_board!(id)

    case Boards.update_board(board, board_params) do
      {:ok, board} ->
        json(conn, board)
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :delete do
    delete("/boards/{id}")
    description("Delete a board by ID")
    parameter("id", :path, :integer, "Board ID", required: true)
    response(code(:no_content), "Board deleted")
    response(code(:not_found), "Board not found")
  end

  def delete_board(conn, %{"board_id" => id}) do
    board = Boards.get_board!(id)

    Boards.delete_board!(board)
    send_resp(conn, :no_content, "")
  end

  swagger_path :get_board_by_game_id do
    get("/boards/game/{game_id}")
    description("Get a board by game ID")
    parameter("game_id", :path, :integer, "Game ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Board not found")
  end

  def get_board_by_game_id(conn, %{"game_id" => game_id}) do
    board = Boards.get_board_by_game_id(game_id)

    case board do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Board not found"})
      _board ->
        json(conn, board)
    end
  end

  swagger_path :create_board_with_zones do
    post("/boards/with_zones")
    description("Create a new board with zones")
    parameter(:body, :body, Schema.ref(:BoardWithZonesRequest), "Board with zones request payload", required: true)
    response(code(:created), "Board with zones created")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def create_board_with_zones(conn, %{"board" => board_params, "zones" => zones_params}) do
    case Boards.create_board(board_params) do
      {:ok, board} ->
        zones = Enum.map(zones_params, fn zone_param ->
          %{
            name: zone_param["name"],
            width: zone_param["width"],
            height: zone_param["height"],
            x: zone_param["x"],
            y: zone_param["y"],
            border_radius: zone_param["border_radius"],
            background_image: zone_param["background_image"],
            board_id: board.id
          }
        end)

        case Enum.reduce_while(zones, {:ok, []}, fn zone, {:ok, acc} ->
          case BoardZones.create_board_zone(zone) do
            {:ok, board_zone} ->
              {:cont, {:ok, [board_zone | acc]}}

            {:error, %Ecto.Changeset{} = changeset} ->
              {:halt, {:error, changeset}}
          end
        end) do
          {:ok, board_zones} ->
            conn
            |> put_status(:created)
            |> json(%{board: board, zones: Enum.reverse(board_zones)})
          {:error, %Ecto.Changeset{} = changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(changeset)
        end

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :update_board_with_zones do
    put("/boards/with_zones/{id}")
    description("Update a board with zones by ID")
    parameter("id", :path, :integer, "Board ID", required: true)
    parameter(:body, :body, Schema.ref(:BoardWithZonesRequest), "Board with zones request payload", required: true)
    response(code(:ok), "Board with zones updated")
    response(code(:not_found), "Board not found")
    response(code(:unprocessable_entity), "Invalid parameters")
  end

  def update_board_with_zones(conn, %{"board_id" => id, "board" => board_params, "zones" => zones_params}) do
    board = Boards.get_board!(id)

    case Boards.update_board(board, board_params) do
      {:ok, board} ->
        zones = Enum.map(zones_params, fn zone_param ->
          %{
            name: zone_param["name"],
            width: zone_param["width"],
            height: zone_param["height"],
            x: zone_param["x"],
            y: zone_param["y"],
            border_radius: zone_param["border_radius"],
            background_image: zone_param["background_image"],
            board_id: board.id,
            id: zone_param["id"]
          }
        end)

        case Enum.reduce_while(zones, {:ok, []}, fn zone, {:ok, acc} ->
          case BoardZones.get_board_zone(zone.id) do
            nil ->
              case BoardZones.create_board_zone(zone) do
                {:ok, board_zone} ->
                  {:cont, {:ok, [board_zone | acc]}}

                {:error, %Ecto.Changeset{} = changeset} ->
                  {:halt, {:error, changeset}}
              end

            board_zone ->
              case BoardZones.update_board_zone(board_zone, zone) do
                {:ok, new_board_zone} ->
                  {:cont, {:ok, [new_board_zone | acc]}}

                {:error, %Ecto.Changeset{} = changeset} ->
                  {:halt, {:error, changeset}}
              end
          end
        end) do
          {:ok, board_zones} ->
            json(conn, %{board: board, zones: Enum.reverse(board_zones)})
          {:error, %Ecto.Changeset{} = changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> json(changeset)
        end

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(changeset)
    end
  end

  swagger_path :get_board_with_zones do
    get("/boards/with_zones/{id}")
    description("Get a board with zones by ID")
    parameter("id", :path, :integer, "Board ID", required: true)
    response(code(:ok), "Success")
    response(code(:not_found), "Board not found")
  end

  def get_board_with_zones(conn, %{"board_id" => id}) do
    board = Boards.get_board!(id)
    zones = BoardZones.get_board_zones_by_board_id(id)

    case board do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Board not found"})
      _board ->
        json(conn, %{board: board, zones: zones})
    end
  end

  swagger_path :get_board_zones do
    get("/boards/:board_id/zones")
    description("Get all board zones")
    response(code(:ok), "Success")
  end

  def get_board_zones(conn, %{"board_id" => board_id}) do
    zones = BoardZones.get_board_zones_by_board_id(board_id)

    case zones do
      [] ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "No board zones found"})
      _zones ->
        json(conn, zones)
    end
  end

  swagger_path :delete_board_zone do
    delete("/boards/zones/{zone_id}")
    description("Delete a board zone by ID")
    parameter("zone_id", :path, :integer, "Board zone ID", required: true)
    response(code(:no_content), "Board zone deleted")
    response(code(:not_found), "Board zone not found")
  end

  def delete_board_zone(conn, %{"zone_id" => zone_id}) do
    board_zone = BoardZones.get_board_zone!(zone_id)

    BoardZones.delete_board_zone(board_zone)
    send_resp(conn, :no_content, "")
  end
end
