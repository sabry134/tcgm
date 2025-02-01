defmodule TcgWebApp.Gameplay.TurnManagerTest do
  use ExUnit.Case
  alias TcgWebApp.Gameplay.{TurnManager, Player}

  test "determine the next turn" do
    players = [
      Player.new(1),
      Player.new(2),
      Player.new(3)
    ]

    assert TurnManager.next_turn(players, 1) == 2
    assert TurnManager.next_turn(players, 2) == 3
    assert TurnManager.next_turn(players, 3) == 1
  end
end
