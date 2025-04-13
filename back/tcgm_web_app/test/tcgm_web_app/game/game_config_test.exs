defmodule TcgmWebApp.Game.GameConfigTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameConfig
  alias TcgmWebApp.Game.GameServer

  setup do
    initial_state = %{
      players: %{
        "player1" => %{
          "hand" => %{},
          "caster" =>  %{},
          "deck" =>  %{},
          "field" => %{},
          "graveyard" => %{}
        },
        "player2" => %{
          "hand" => %{},
          "caster" =>  %{},
          "deck" =>  %{},
          "field" => %{},
          "graveyard" => %{}
        },
        "player3" => %{
          "hand" => %{},
          "caster" =>  %{},
          "deck" =>  %{},
          "field" => %{},
          "graveyard" => %{}
        },
        "player4" => %{
          "hand" => %{},
          "caster" =>  %{},
          "deck" =>  %{},
          "field" => %{},
          "graveyard" => %{}
        }
      },
      turn: "player1",
      turnCount: 0,
    }

    room_id = "1"
    {:ok, _pid} = GameServer.start_link(room_id)
    {:ok, initial_state: initial_state, room_id: room_id}
  end

  test "create deck for players", %{room_id: room_id, initial_state: state} do
    newstate = GameConfig.load_deck_config(state, room_id, "player1")
    update_state = GameConfig.load_deck_config(newstate, room_id, "player2")
    assert Map.has_key?(update_state.players["player1"]["deck"], "Card X") == true
    assert Map.has_key?(update_state.players["player2"]["deck"], "card4") == true
    assert map_size(update_state.players["player1"]["deck"]) == 5
    assert map_size(update_state.players["player2"]["deck"]) == 5
  end

  test "create deck for players with quantity", %{room_id: room_id, initial_state: state} do
    newstate = GameConfig.load_deck_config(state, room_id, "player2")
    update_state = GameConfig.load_deck_config(newstate, room_id, "player3")
    assert Map.has_key?(update_state.players["player3"]["deck"], "Card X #2") == true
    assert Map.has_key?(update_state.players["player2"]["deck"], "card4") == true
    assert map_size(update_state.players["player3"]["deck"]) == 5
    assert map_size(update_state.players["player2"]["deck"]) == 5
  end

  test "create casters for players", %{room_id: room_id, initial_state: state} do
    #GameServer.join_room(room_id, "player4")
    #GameServer.join_room(room_id, "player2")
    newstate = GameConfig.load_deck_config(state, room_id, "player4")
    update_state = GameConfig.load_deck_config(newstate, room_id, "player2")
    #:ok = GameServer.start_game(room_id)

    #state = GameServer.get_state(room_id)

    assert Map.has_key?(update_state.players["player4"]["caster"], "active") == true
    assert Map.has_key?(update_state.players["player4"]["caster"], "inactive") == true
    assert map_size(update_state.players["player4"]["caster"]["active"]) == 1
    assert map_size(update_state.players["player4"]["caster"]["inactive"]) == 1
    assert Map.has_key?(update_state.players["player2"]["caster"], "active") == false
    assert Map.has_key?(update_state.players["player2"]["caster"], "inactive") == false
    assert map_size(update_state.players["player2"]["caster"]) == 0
    assert map_size(update_state.players["player4"]["deck"]) == 5
    assert map_size(update_state.players["player2"]["deck"]) == 5
  end
end
