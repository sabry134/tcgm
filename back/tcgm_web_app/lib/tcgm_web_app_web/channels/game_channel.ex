defmodule TcgmWebAppWeb.GameChannel do
  use Phoenix.Channel

  def join("room:" <> room_id, _params, socket) do
    {:ok, socket |> assign(:room_id, room_id)}
  end

  def handle_in("join_room", %{"player_id" => player_id}, socket) do
    TcgmWebApp.Game.GameServer.join_room(socket.assigns.room_id, player_id)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("play_card", %{"player_id" => player_id, "card" => card}, socket) do
    TcgmWebApp.Game.GameServer.play_card(socket.assigns.room_id, player_id, card)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("set_deck", %{"player_id" => player_id, "deck" => deck}, socket) do
    TcgmWebApp.Game.GameServer.set_deck(socket.assigns.room_id, player_id, deck)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("draw_card", %{"player_id" => player_id}, socket) do
    TcgmWebApp.Game.GameServer.draw_card(socket.assigns.room_id, player_id)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end
end
