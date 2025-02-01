defmodule TcgWebApp.Gameplay.GameStateTest do
  use ExUnit.Case
  alias TcgWebApp.Gameplay.{GameState, Player}

  setup do
    players = [
      Player.new(1, ["Card1", "Card2"]),
      Player.new(2, ["Card3", "Card4"])
    ]

    initial_state = %{
      players: players,
      turn: 1,
      game_over: false
    }

    {:ok, _pid} = GameState.start_link(initial_state)
    :ok
  end

  test "get the initial game state" do
    state = GameState.get_game_state()
    assert state.turn == 1
    assert length(state.players) == 2
  end

  test "player draws a card" do
    GameState.draw_card(1)
    state = GameState.get_game_state()

    player1 = Enum.find(state.players, fn p -> p.id == 1 end)
    assert player1.hand == ["Card1"]
    assert player1.deck == ["Card2"]
  end

  test "player plays a card" do
    GameState.draw_card(1)
    GameState.play_card(1, "Card1")
    state = GameState.get_game_state()

    player1 = Enum.find(state.players, fn p -> p.id == 1 end)
    assert player1.hand == []
    assert player1.field == ["Card1"]
  end

  test "end turn moves to the next player" do
    GameState.end_turn()
    state = GameState.get_game_state()
    assert state.turn == 2
  end
end
