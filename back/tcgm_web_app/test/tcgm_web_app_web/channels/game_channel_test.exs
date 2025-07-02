defmodule TcgmWebAppWeb.GameChannelTest do
  use TcgmWebAppWeb.ChannelCase

  alias TcgmWebAppWeb.GameChannel
  alias TcgmWebApp.Game.GameServer

  setup do
    room_id = "test_room"
    {:ok, _pid} = GameServer.start_link(room_id)
    {:ok, socket} = connect(TcgmWebAppWeb.UserSocket, %{})
    {:ok, socket2} = connect(TcgmWebAppWeb.UserSocket, %{})

    {:ok, socket: socket, socket2: socket2, room_id: room_id}
  end

  test "players can join room channel", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    assert socket.assigns.room_id == room_id

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})

    assert Map.has_key?(state.players, "player1")
  end

  test "players can leave a room", %{room_id: room_id} do
    GameServer.join_room(room_id, "player1")
    state_before = GameServer.get_state(room_id)
    assert Map.has_key?(state_before.players, "player1")

    :ok = GameServer.leave_room(room_id, "player1")

    state_after = GameServer.get_state(room_id)
    refute Map.has_key?(state_after.players, "player1")
  end

  test "multiple players can join room channel", %{socket: socket, socket2: socket2, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    assert socket.assigns.room_id == room_id

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})

    assert Map.has_key?(state.players, "player1")

    {:ok, _, socket2} = subscribe_and_join(socket2, GameChannel, "room:" <> room_id, %{})
    push(socket2, "join_room", %{"player_id" => "player2"})
    assert_broadcast("game_update", %{state: updated_state})
    assert Map.has_key?(updated_state.players, "player2")
  end

  test "multiple players receive broadcasts", %{socket: socket1, socket2: socket2, room_id: room_id} do
    {:ok, _, socket1} = subscribe_and_join(socket1, GameChannel, "room:" <> room_id, %{})
    push(socket1, "join_room", %{"player_id" => "player1"})

    assert_broadcast("game_update", %{state: state1})
    assert Map.has_key?(state1.players, "player1")

    # Now join the second socket
    {:ok, _, socket2} = subscribe_and_join(socket2, GameChannel, "room:" <> room_id, %{})
    push(socket2, "join_room", %{"player_id" => "player2"})

    assert_broadcast("game_update", %{state: state2})
    assert Map.has_key?(state2.players, "player2")

    # Ensure both players are in the final broadcasted state
    assert Map.has_key?(state2.players, "player1")
    assert Map.has_key?(state2.players, "player2")
  end

  test "inserting a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "playing a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card, "location" => "hand"})
    assert_broadcast("game_update", %{state: _updated_state})
    push(socket, "play_card", %{"player_id" => "player1", "card" => card})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"]["field"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "setting a deck updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    deck = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "drawing a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    deck = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "draw_card", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "moving a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")
    tmp_card = %{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}
    deck = [tmp_card]
    source = "hand"
    dest = "field"
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "draw_card", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "move_card", %{"player_id" => "player1", "source" => source, "dest" => dest, "card" => tmp_card})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players["player1"][dest], fn card -> Map.has_key?(card, "Card Y") end) == true
  end

  test "updating a card updates game state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    deck = [%{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}]
    location = "hand"
    push(socket, "set_deck", %{"player_id" => "player1", "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "draw_card", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "update_card", %{"player_id" => "player1", "location" => location, "card" => "Card Y", "key" => "attack", "value" => 20})
    assert_broadcast("game_update", %{state: updated_state})

    c = Enum.find(updated_state.players["player1"][location], fn c -> Map.has_key?(c, "Card Y") end)
    assert c["Card Y"]["properties"]["attack"] == 20
  end

  test "setting the turn state", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    push(socket, "set_turn", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: updated_state})

    assert updated_state.turn == "player1"
  end

  test "passing the turn to another player", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    push(socket, "set_turn", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: _updated_state})

    push(socket, "pass_turn", %{"player_id" => "player2"})
    assert_broadcast("game_update", %{state: updated_state})

    assert updated_state.turn == "player2"
    assert updated_state.turnCount == 1
  end

  test "shuffling the card in deck location", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    card1 = %{"Card A" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card B" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card1, "location" => "deck"})
    assert_broadcast("game_update", %{state: updated_state})
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card2, "location" => "deck"})
    assert_broadcast("game_update", %{state: updated_state})
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card3, "location" => "deck"})
    assert_broadcast("game_update", %{state: updated_state})
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card4, "location" => "deck"})
    assert_broadcast("game_update", %{state: updated_state})

    new_deck = updated_state.players["player1"]["deck"]
    changed =
      Enum.any?(1..10, fn _ ->
        push(socket, "shuffle_card", %{"player_id" => "player1", "location" => "deck"})
        assert_broadcast("game_update", %{state: shuffled_state})
        shuffled_deck = shuffled_state.players["player1"]["deck"]
        shuffled_deck != new_deck
      end)

    assert changed
  end

  test "shuffling the card in hand location", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    push(socket, "join_room", %{"player_id" => "player1"})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, "player1")

    card1 = %{"Card A" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card B" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card1, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card2, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card3, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})
    push(socket, "insert_card", %{"player_id" => "player1", "card" => card4, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})

    new_hand = updated_state.players["player1"]["hand"]
    changed =
      Enum.any?(1..10, fn _ ->
        push(socket, "shuffle_card", %{"player_id" => "player1", "location" => "hand"})
        assert_broadcast("game_update", %{state: shuffled_state})
        shuffled_hand = shuffled_state.players["player1"]["hand"]
        shuffled_hand != new_hand
      end)

    assert changed
  end

  test "get_chat retrieves the chat messages", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    # Add some chat messages to the room
    TcgmWebApp.Game.GameServer.add_chat_message(room_id, "player1", "Hello!")
    TcgmWebApp.Game.GameServer.add_chat_message(room_id, "player2", "Hi there!")

    # Push the "get_chat" event
    push(socket, "get_chat", %{})

    # Assert that the chat messages are pushed to the socket
    assert_push("chat_update", %{chat: chat})
    assert Enum.any?(chat, fn msg -> msg[:player_id] == "player1" and msg[:message] == "Hello!" and Map.has_key?(msg, :timestamp) end)
    assert Enum.any?(chat, fn msg -> msg[:player_id] == "player2" and msg[:message] == "Hi there!" and Map.has_key?(msg, :timestamp) end)
  end

  test "add_chat_message broadcasts the updated chat", %{socket: socket, room_id: room_id} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    # Push the "add_chat_message" event
    push(socket, "add_chat_message", %{"player_id" => "player1", "message" => "Hello!"})

    # Assert that the updated chat is broadcasted
    assert_broadcast("chat_update", %{chat: chat})
    assert Enum.any?(chat, fn msg ->
      msg[:player_id] == "player1" and
      msg[:message] == "Hello!" and
      Map.has_key?(msg, :timestamp)
    end)

    # Add another message
    push(socket, "add_chat_message", %{"player_id" => "player2", "message" => "Hi there!"})

    # Assert that the updated chat is broadcasted again
    assert_broadcast("chat_update", %{chat: chat})
    assert Enum.any?(chat, fn msg ->
      msg[:player_id] == "player2" and
      msg[:message] == "Hi there!" and
      Map.has_key?(msg, :timestamp)
    end)
  end
end
