defmodule TcgmWebApp.Game.GameConfigTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameConfig
  alias TcgmWebApp.Game.GameServer

  setup do
    initial_state = %{
      players: %{
        "player1" => %{
          "hand" => [],
          "caster" => [],
          "deck" => [],
          "field" => [],
          "graveyard" => []
        },
        "player2" => %{
          "hand" => [],
          "caster" => [],
          "deck" => [],
          "field" => [],
          "graveyard" => []
        },
        "player3" => %{
          "hand" => [],
          "caster" => [],
          "deck" => [],
          "field" => [],
          "graveyard" => []
        },
        "player4" => %{
          "hand" => [],
          "caster" => [],
          "deck" => [],
          "field" => [],
          "graveyard" => []
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
    
    assert Enum.any?(update_state.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card X") end) == true
    assert Enum.any?(update_state.players["player2"]["deck"], fn card -> Map.has_key?(card, "card4") end) == true
    assert length(update_state.players["player1"]["deck"]) == 5
    assert length(update_state.players["player2"]["deck"]) == 5
  end

  test "create deck for players with quantity", %{room_id: room_id, initial_state: state} do
    newstate = GameConfig.load_deck_config(state, room_id, "player2")
    update_state = GameConfig.load_deck_config(newstate, room_id, "player3")

    assert Enum.any?(update_state.players["player3"]["deck"], fn card -> Map.has_key?(card, "Card X #2") end) == true
    assert Enum.any?(update_state.players["player2"]["deck"], fn card -> Map.has_key?(card, "card4") end) == true
    assert length(update_state.players["player3"]["deck"]) == 5
    assert length(update_state.players["player2"]["deck"]) == 5
  end

  test "create casters for players", %{room_id: room_id, initial_state: state} do
    newstate = GameConfig.load_deck_config(state, room_id, "player4")
    update_state = GameConfig.load_deck_config(newstate, room_id, "player2")

    assert Enum.any?(update_state.players["player4"]["caster"], fn card -> Map.has_key?(card, "active") end) == true
    assert Enum.any?(update_state.players["player4"]["caster"], fn card -> Map.has_key?(card, "inactive") end) == true
    active = Enum.find(update_state.players["player4"]["caster"], fn c -> Map.has_key?(c, "active") end)
    inactive = Enum.find(update_state.players["player4"]["caster"], fn c -> Map.has_key?(c, "inactive") end)
    assert map_size(active["active"]) == 1
    assert map_size(inactive["inactive"]) == 1
    assert Enum.any?(update_state.players["player2"]["caster"], fn card -> Map.has_key?(card, "active") end) == false
    assert Enum.any?(update_state.players["player2"]["caster"], fn card -> Map.has_key?(card, "inactive") end) == false
    assert length(update_state.players["player2"]["caster"]) == 0
    assert length(update_state.players["player4"]["deck"]) == 5
    assert length(update_state.players["player2"]["deck"]) == 5
  end
end
