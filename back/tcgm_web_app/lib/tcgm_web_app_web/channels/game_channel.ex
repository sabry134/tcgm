defmodule TcgmWebAppWeb.GameChannel do
  use Phoenix.Channel

  @moduledoc """
    This module is responsible for handling game channels.
  """

  @doc """
    Joins the room with the given id.
  """
  def join("room:" <> room_id, _params, socket) do
    {:ok, socket |> assign(:room_id, room_id)}
  end

  @doc """
    Handles incoming messages.

    ## Variants:

    * `join_room` - Joins the room.
    * `play_card` - Plays a card.
    * `set_deck` - Sets the deck.
    * `draw_card` - Draws a card.
    * `insert_card` - Inserts a card.
  """
  def handle_in("join_room", %{"player_id" => player_id, "game_id" => game_id}, socket) do
    case TcgmWebApp.Game.GameServer.join_room(socket.assigns.room_id, player_id, game_id) do
    {:ok, state} ->
      broadcast!(socket, "game_update", %{state: state})
      {:noreply, socket}

    {:error, reason} ->
      push(socket, "join_error", %{error: reason})
      {:noreply, socket}
  end
  end

  def handle_in("leave_room", %{"player_id" => player_id}, socket) do
    TcgmWebApp.Game.GameServer.leave_room(socket.assigns.room_id, player_id)
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

  def handle_in("insert_card", %{"player_id" => player_id, "card" => card, "location" => location}, socket) do
    TcgmWebApp.Game.GameServer.insert_card(socket.assigns.room_id, player_id, card, location)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("move_card", %{"player_id" => player_id, "source" => source, "dest" => dest, "card" => card}, socket) do
    TcgmWebApp.Game.GameServer.move_card(socket.assigns.room_id, player_id, source, dest, card)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("update_card", %{"player_id" => player_id, "location" => location, "card" => card, "key" => key, "value" => value}, socket) do
    TcgmWebApp.Game.GameServer.update_card(socket.assigns.room_id, player_id, location, card, key, value)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("set_turn", %{"player_id" => player_id}, socket) do
    TcgmWebApp.Game.GameServer.set_turn(socket.assigns.room_id, player_id)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("pass_turn", %{"player_id" => player_id}, socket) do
    TcgmWebApp.Game.GameServer.pass_turn(socket.assigns.room_id, player_id)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("shuffle_card", %{"player_id" => player_id, "location" => location}, socket) do
    TcgmWebApp.Game.GameServer.shuffle_card(socket.assigns.room_id, player_id, location)
    broadcast!(socket, "game_update", %{state: TcgmWebApp.Game.GameServer.get_state(socket.assigns.room_id)})
    {:noreply, socket}
  end

  def handle_in("get_chat", _params, socket) do
    chat = TcgmWebApp.Game.GameServer.get_chat(socket.assigns.room_id)
    push(socket, "chat_update", %{chat: chat})
    {:noreply, socket}
  end

  def handle_in("add_chat_message", %{"player_id" => player_id, "message" => message}, socket) do
    TcgmWebApp.Game.GameServer.add_chat_message(socket.assigns.room_id, player_id, message)
    chat = TcgmWebApp.Game.GameServer.get_chat(socket.assigns.room_id)
    broadcast!(socket, "chat_update", %{chat: chat})
    {:noreply, socket}
  end
end
