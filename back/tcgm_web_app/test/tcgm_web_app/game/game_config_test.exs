defmodule TcgmWebApp.Game.GameConfigTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameConfig
  alias TcgmWebApp.Game.GameServer

  setup do
    initial_state = %{
      players: %{
        "player1" => %{
          "hand" => %{},
          "deck" =>  %{},
          "field" => %{},
          "graveyard" => %{}
        },
        "player2" => %{
          "hand" => %{},
          "deck" =>  %{},
          "field" => %{},
          "graveyard" => %{}
        },
        "player3" => %{
          "hand" => %{},
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
    assert map_size(update_state.players["player1"]["deck"]) == 3
    assert map_size(update_state.players["player2"]["deck"]) == 2
  end

  test "create deck for players with quantity", %{room_id: room_id, initial_state: state} do
    newstate = GameConfig.load_deck_config(state, room_id, "player2")
    update_state = GameConfig.load_deck_config(newstate, room_id, "player3")
    assert Map.has_key?(update_state.players["player3"]["deck"], "Card Y #2") == true
    assert Map.has_key?(update_state.players["player2"]["deck"], "card4") == true
    assert map_size(update_state.players["player3"]["deck"]) == 6
    assert map_size(update_state.players["player2"]["deck"]) == 2
  end

end
