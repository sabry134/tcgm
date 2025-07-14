defmodule TcgmWebAppWeb.GameChannelTest do
  use TcgmWebAppWeb.ChannelCase
  use TcgmWebAppWeb.ConnCase
  use ExUnit.Case, async: false

  alias TcgmWebAppWeb.GameChannel
  alias TcgmWebApp.Game.GameServer
  alias TcgmWebApp.Games.Game
  alias TcgmWebApp.Boards.Board
  alias TcgmWebApp.BoardZones.BoardZone
  alias TcgmWebApp.GameRules.GameRule
  alias TcgmWebApp.PlayerProperties.PlayerProperty
  alias TcgmWebApp.CardCollections.CardCollection
  alias TcgmWebApp.CardCollectionCards.CardCollectionCard
  alias TcgmWebApp.Cards.Card
  alias TcgmWebApp.Actions.Action
  alias TcgmWebApp.Effects.Effect
  alias TcgmWebApp.CardTypes.CardType
  alias TcgmWebApp.Accounts.User
  alias TcgmWebApp.Repo

  setup do
    room_id = "test_room"
    {:ok, _pid} = GameServer.start_link(room_id)
    {:ok, socket} = Phoenix.ChannelTest.connect(TcgmWebAppWeb.UserSocket, %{})
    {:ok, socket2} = Phoenix.ChannelTest.connect(TcgmWebAppWeb.UserSocket, %{})

    user = %User{}
    |> User.changeset(%{ username: "test_user", email: "test@test.com", password: "password" })
    |> Repo.insert!()

    user2 = %User{}
    |> User.changeset(%{ username: "test_user2", email: "test2@test.com", password: "password" })
    |> Repo.insert!()

    game = %Game{}
    |> Game.changeset(%{ name: "Test game", description: "Test description" })
    |> Repo.insert!()

    board = %Board{}
    |> Board.changeset(%{ background_image: "test", game_id: game.id })
    |> Repo.insert!()

    hand = %BoardZone{}
    |> BoardZone.changeset(%{ name: "hand", width: 100, height: 100, x: 0, y: 0, border_radius: 10, background_image: "hand.png", board_id: board.id })
    |> Repo.insert!()

    field = %BoardZone{}
    |> BoardZone.changeset(%{ name: "field", width: 200, height: 200, x: 100, y: 100, border_radius: 20, background_image: "field.png", board_id: board.id })
    |> Repo.insert!()

    deck = %BoardZone{}
    |> BoardZone.changeset(%{ name: "deck", width: 150, height: 150, x: 200, y: 200, border_radius: 15, background_image: "deck.png", board_id: board.id })
    |> Repo.insert!()

    discard = %BoardZone{}
    |> BoardZone.changeset(%{ name: "discard", width: 120, height: 120, x: 300, y: 300, border_radius: 12, background_image: "discard.png", board_id: board.id })
    |> Repo.insert!()

    caster = %BoardZone{}
    |> BoardZone.changeset(%{ name: "caster", width: 180, height: 180, x: 400, y: 400, border_radius: 18, background_image: "caster.png", board_id: board.id })
    |> Repo.insert!()

    game_rules = %GameRule{}
    |> GameRule.changeset(%{
      game_id: game.id,
      starting_hand_size: 1,
      min_deck_size: 1,
      max_deck_size: 10,
      max_hand_size: 7,
      draw_per_turn: 1
    })
    |> Repo.insert!()

    player_properties = %PlayerProperty{}
    |> PlayerProperty.changeset(%{
      property_name: "health",
      value: 20,
      game_rule_id: game_rules.id
    })
    |> Repo.insert!()

    action = %Action{}
    |> Action.changeset(%{ name: "Test action", description: "Test description", game_id: game.id })
    |> Repo.insert!()

    effect = %Effect{}
    |> Effect.changeset(%{ description: "Test description", action_ids: [action.id], game_id: game.id })
    |> Repo.insert!()

    cardType = %CardType{}
    |> CardType.changeset(%{ name: "Test cardType", game_id: game.id })
    |> Repo.insert!()

    cardType2 = %CardType{}
    |> CardType.changeset(%{ name: "caster", game_id: game.id })
    |> Repo.insert!()

    card = %Card{}
    |> Card.changeset(%{ name: "Test card", text: "Test text", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card2 = %Card{}
    |> Card.changeset(%{ name: "Test card 2", text: "Test text 2", image: "image", game_id: game.id, card_type_id: cardType.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card3 = %Card{}
    |> Card.changeset(%{ name: "Test card 3", text: "Test text 3", image: "image", game_id: game.id, card_type_id: cardType2.id, effect_ids: [effect.id] })
    |> Repo.insert!()

    card_collection = %CardCollection{}
    |> CardCollection.changeset(%{ name: "test", quantity: 10, game_id: game.id, user_id: user.id, type: "deck", public_template: true })
    |> Repo.insert!()

    card_collection_card = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card.id, quantity: 5, group: "deck" })
    |> Repo.insert!()

    card_collection_card2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card2.id, quantity: 5, group: "deck" })
    |> Repo.insert!()

    card_collection_card3 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection.id, card_id: card3.id, quantity: 1, group: "caster" })
    |> Repo.insert!()

    card_collection_p2 = %CardCollection{}
    |> CardCollection.changeset(%{ name: "testp2", quantity: 10, game_id: game.id, user_id: user2.id, type: "deck", public_template: true })
    |> Repo.insert!()

    card_collection_card_p2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection_p2.id, card_id: card.id, quantity: 5, group: "deck" })
    |> Repo.insert!()

    card_collection_card2_p2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection_p2.id, card_id: card2.id, quantity: 5, group: "deck" })
    |> Repo.insert!()

    card_collection_card3_p2 = %CardCollectionCard{}
    |> CardCollectionCard.changeset(%{ card_collection_id: card_collection_p2.id, card_id: card3.id, quantity: 1, group: "caster" })
    |> Repo.insert!()

    {:ok, socket: socket, socket2: socket2, room_id: room_id, game: game, user: user, user2: user2}
  end

  test "players can join room channel", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    assert socket.assigns.room_id == room_id
    ref = Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast "game_update", %{state: state}
    assert Map.has_key?(state.players, user.username)
  end

  test "players can leave a room", %{room_id: room_id, game: game, user: user} do
    GameServer.join_room(room_id, user.username, game.id)

    {:ok, socket} = Phoenix.ChannelTest.connect(TcgmWebAppWeb.UserSocket, %{})
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    state_before = GameServer.get_state(room_id)
    assert Map.has_key?(state_before.players, user.username)

    {:ok, state} = GameServer.leave_room(room_id, user.username)

    refute Map.has_key?(state.players, user.username)
  end

  test "multiple players can join room channel", %{socket: socket, socket2: socket2, room_id: room_id, game: game, user: user, user2: user2} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    assert socket.assigns.room_id == room_id

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})

    assert Map.has_key?(state.players, user.username)

    {:ok, _, socket2} = subscribe_and_join(socket2, GameChannel, "room:" <> room_id, %{})
    Phoenix.ChannelTest.push(socket2, "join_room", %{"player_id" => user2.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: updated_state})
    assert Map.has_key?(updated_state.players, user2.username)
  end

  test "multiple players receive broadcasts", %{socket: socket1, socket2: socket2, room_id: room_id, game: game, user: user, user2: user2} do
    {:ok, _, socket1} = subscribe_and_join(socket1, GameChannel, "room:" <> room_id, %{})
    Phoenix.ChannelTest.push(socket1, "join_room", %{"player_id" => user.username, "game_id" => game.id})

    assert_broadcast("game_update", %{state: state1})
    assert Map.has_key?(state1.players, user.username)

    # Now join the second socket
    {:ok, _, socket2} = subscribe_and_join(socket2, GameChannel, "room:" <> room_id, %{})
    Phoenix.ChannelTest.push(socket2, "join_room", %{"player_id" => user2.username, "game_id" => game.id})

    assert_broadcast("game_update", %{state: state2})
    assert Map.has_key?(state2.players, user2.username)

    # Ensure both players are in the final broadcasted state
    assert Map.has_key?(state2.players, user.username)
    assert Map.has_key?(state2.players, user2.username)
  end

  test "inserting a card updates game state", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players[user.username]["hand"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "playing a card updates game state", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    card = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card, "location" => "hand"})
    assert_broadcast("game_update", %{state: _updated_state})
    Phoenix.ChannelTest.push(socket, "play_card", %{"player_id" => user.username, "card" => card})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players[user.username]["field"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "setting a deck updates game state", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    deck = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    Phoenix.ChannelTest.push(socket, "set_deck", %{"player_id" => user.username, "deck" => deck})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players[user.username]["deck"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "drawing a card updates game state", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    deck = [%{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}]
    Phoenix.ChannelTest.push(socket, "set_deck", %{"player_id" => user.username, "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    Phoenix.ChannelTest.push(socket, "draw_card", %{"player_id" => user.username})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players[user.username]["hand"], fn card -> Map.has_key?(card, "Card X") end) == true
  end

  test "moving a card updates game state", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)
    tmp_card = %{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}
    deck = [tmp_card]
    source = "hand"
    dest = "field"
    Phoenix.ChannelTest.push(socket, "set_deck", %{"player_id" => user.username, "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    Phoenix.ChannelTest.push(socket, "draw_card", %{"player_id" => user.username})
    assert_broadcast("game_update", %{state: _updated_state})

    Phoenix.ChannelTest.push(socket, "move_card", %{"player_id" => user.username, "source" => source, "dest" => dest, "card" => tmp_card})
    assert_broadcast("game_update", %{state: updated_state})

    assert Enum.any?(updated_state.players[user.username][dest], fn card -> Map.has_key?(card, "Card Y") end) == true
  end

  test "updating a card updates game state", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    deck = [%{"Card Y" => %{
      "name" => "magicien",
      "properties" => %{"attack" => 9, "defense" => 8}
    }}]
    location = "hand"
    Phoenix.ChannelTest.push(socket, "set_deck", %{"player_id" => user.username, "deck" => deck})
    assert_broadcast("game_update", %{state: _updated_state})

    Phoenix.ChannelTest.push(socket, "draw_card", %{"player_id" => user.username})
    assert_broadcast("game_update", %{state: _updated_state})

    Phoenix.ChannelTest.push(socket, "update_card", %{"player_id" => user.username, "location" => location, "card" => "Card Y", "key" => "attack", "value" => 20})
    assert_broadcast("game_update", %{state: updated_state})

    c = Enum.find(updated_state.players[user.username][location], fn c -> Map.has_key?(c, "Card Y") end)
    assert c["Card Y"]["properties"]["attack"] == 20
  end

  test "setting the turn state", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    Phoenix.ChannelTest.push(socket, "set_turn", %{"player_id" => user.username})
    assert_broadcast("game_update", %{state: updated_state})

    assert updated_state.turn == user.username
  end

  test "passing the turn to another player", %{socket: socket, room_id: room_id, game: game, user: user, user2: user2} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    Phoenix.ChannelTest.push(socket, "set_turn", %{"player_id" => user.username})
    assert_broadcast("game_update", %{state: _updated_state})

    Phoenix.ChannelTest.push(socket, "pass_turn", %{"player_id" => user2.username})
    assert_broadcast("game_update", %{state: updated_state})

    assert updated_state.turn == user2.username
    assert updated_state.turnCount == 1
  end

  test "shuffling the card in deck location", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    card1 = %{"Card A" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card B" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card1, "location" => "deck"})
    assert_broadcast("game_update", %{state: updated_state})
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card2, "location" => "deck"})
    assert_broadcast("game_update", %{state: updated_state})
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card3, "location" => "deck"})
    assert_broadcast("game_update", %{state: updated_state})
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card4, "location" => "deck"})
    assert_broadcast("game_update", %{state: updated_state})

    new_deck = updated_state.players[user.username]["deck"]
    changed =
      Enum.any?(1..10, fn _ ->
        Phoenix.ChannelTest.push(socket, "shuffle_card", %{"player_id" => user.username, "location" => "deck"})
        assert_broadcast("game_update", %{state: shuffled_state})
        shuffled_deck = shuffled_state.players[user.username]["deck"]
        shuffled_deck != new_deck
      end)

    assert changed
  end

  test "shuffling the card in hand location", %{socket: socket, room_id: room_id, game: game, user: user} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast("game_update", %{state: state})
    assert Map.has_key?(state.players, user.username)

    card1 = %{"Card A" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card B" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card1, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card2, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card3, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})
    Phoenix.ChannelTest.push(socket, "insert_card", %{"player_id" => user.username, "card" => card4, "location" => "hand"})
    assert_broadcast("game_update", %{state: updated_state})

    new_hand = updated_state.players[user.username]["hand"]
    changed =
      Enum.any?(1..10, fn _ ->
        Phoenix.ChannelTest.push(socket, "shuffle_card", %{"player_id" => user.username, "location" => "hand"})
        assert_broadcast("game_update", %{state: shuffled_state})
        shuffled_hand = shuffled_state.players[user.username]["hand"]
        shuffled_hand != new_hand
      end)

    assert changed
  end

  test "get_chat retrieves the chat messages", %{socket: socket, room_id: room_id, game: game, user: user, user2: user2} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    TcgmWebApp.Game.GameServer.add_chat_message(room_id, user.username, "Hello!")
    TcgmWebApp.Game.GameServer.add_chat_message(room_id, user2.username, "Hi there!")

    Phoenix.ChannelTest.push(socket, "get_chat", %{})

    assert_push("chat_update", %{chat: chat})
    assert Enum.any?(chat, fn msg -> msg[:player_id] == user.username and msg[:message] == "Hello!" and Map.has_key?(msg, :timestamp) end)
    assert Enum.any?(chat, fn msg -> msg[:player_id] == user2.username and msg[:message] == "Hi there!" and Map.has_key?(msg, :timestamp) end)
  end

  test "add_chat_message broadcasts the updated chat", %{socket: socket, room_id: room_id, game: game, user: user, user2: user2} do
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})

    Phoenix.ChannelTest.push(socket, "add_chat_message", %{"player_id" => user.username, "message" => "Hello!"})

    assert_broadcast("chat_update", %{chat: chat})
    assert Enum.any?(chat, fn msg ->
      msg[:player_id] == user.username and
      msg[:message] == "Hello!" and
      Map.has_key?(msg, :timestamp)
    end)

    Phoenix.ChannelTest.push(socket, "add_chat_message", %{"player_id" => user2.username, "message" => "Hi there!"})

    assert_broadcast("chat_update", %{chat: chat})
    assert Enum.any?(chat, fn msg ->
      msg[:player_id] == user2.username and
      msg[:message] == "Hi there!" and
      Map.has_key?(msg, :timestamp)
    end)
  end

  test "removes player from room on socket disconnect", %{socket: socket, user: user, room_id: room_id, game: game} do
    Process.flag(:trap_exit, true)
    {:ok, _, socket} = subscribe_and_join(socket, GameChannel, "room:" <> room_id, %{})
    Phoenix.ChannelTest.push(socket, "join_room", %{"player_id" => user.username, "game_id" => game.id})
    assert_broadcast "game_update", %{state: _state}
    ref = Process.monitor(socket.channel_pid)
    Phoenix.ChannelTest.close(socket)
    assert_receive {:DOWN, ^ref, :process, _pid, _reason}

    # check the player has good been disconected
    assert_broadcast "game_update", %{state: state_after}
    refute Map.has_key?(state_after.players, user.username)
  end
end
