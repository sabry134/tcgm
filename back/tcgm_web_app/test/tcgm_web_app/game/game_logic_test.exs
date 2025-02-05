defmodule TcgmWebApp.Game.GameLogicTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameLogic

  setup do
    initial_state = %{
      players: %{
        "player1" => %{
          "hand" => [],
          "deck" => ["Card A", "Card B", "Card C"],
          "field" => [],
          "graveyard" => []
        }
      }
    }
    {:ok, initial_state: initial_state}
  end

  test "draw_card moves card from deck to hand", %{initial_state: state} do
    new_state = GameLogic.draw_card(state, "player1")

    assert length(new_state.players["player1"]["hand"]) == 1
    assert length(new_state.players["player1"]["deck"]) == 2
    assert "Card A" in new_state.players["player1"]["hand"]
  end

  test "play_card moves card from hand to field", %{initial_state: state} do
    state_with_card_in_hand = put_in(state.players["player1"]["hand"], ["Card X"])
    new_state = GameLogic.play_card_logic(state_with_card_in_hand, "player1", "Card X")

    assert length(new_state.players["player1"]["hand"]) == 0
    assert length(new_state.players["player1"]["field"]) == 1
    assert "Card X" in new_state.players["player1"]["field"]
  end
end
