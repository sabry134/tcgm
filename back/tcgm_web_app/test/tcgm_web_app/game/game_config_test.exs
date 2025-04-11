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
        }
      },
      turn: "player1",
      turnCount: 0,
    }

    room_id = "1"
    {:ok, _pid} = GameServer.start_link(room_id)
    {:ok, initial_state: initial_state, room_id: room_id}
  end

  test "players can join a room", %{room_id: room_id, initial_state: state} do
    newstate = GameConfig.load_deck_config(state, room_id, "player1")
    update_state = GameConfig.load_deck_config(newstate, room_id, "player2")
    assert Map.has_key?(update_state.players["player1"]["deck"], "Card X") == true
    assert Map.has_key?(update_state.players["player2"]["deck"], "card4") == true
    assert map_size(update_state.players["player1"]["deck"]) == 2
    assert map_size(update_state.players["player2"]["deck"]) == 2
  end

end
