defmodule TcgmWebAppWeb.RoomChannel do
  use Phoenix.Channel
  alias TcgmWebApp.Rooms.Rooms

  def join("room:" <> room_id, _params, socket) do
    Rooms.create_room(room_id)
    {:ok, socket |> assign(:room_id, room_id)}
  end

  def handle_in("join_room", %{"player" => player}, socket) do
    room_id = socket.assigns[:room_id]
    Rooms.join_room(room_id, player)
    broadcast!(socket, "player_joined", %{player: player})
    {:noreply, socket}
  end

  def handle_in("make_move", %{"move" => move}, socket) do
    room_id = socket.assigns[:room_id]
    {:ok, new_state} = Rooms.make_move(room_id, move)
    broadcast!(socket, "game_update", %{state: new_state})
    {:noreply, socket}
  end
end
