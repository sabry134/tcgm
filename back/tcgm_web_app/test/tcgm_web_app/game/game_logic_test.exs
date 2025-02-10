defmodule TcgmWebApp.Game.GameLogicTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameLogic

  setup do
    initial_state = %{
      players: %{
        "player1" => %{
          "hand" => %{},
          "deck" =>  %{
            "Card A" => %{"name" => "Lion","properties" => %{"attack" => 7, "defense" => 3}},
            "Card B" => %{"name" => "Zombie","properties" => %{"attack" => 5, "defense" => 11}},
            "Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}
          },
          "field" => %{},
          "graveyard" => %{}
        }
      }
    }

    {:ok, initial_state: initial_state}
  end

  test "draw_card moves card from deck to hand", %{initial_state: state} do
    new_state = GameLogic.draw_card(state, "player1")

    assert map_size(new_state.players["player1"]["hand"]) == 1
    assert map_size(new_state.players["player1"]["deck"]) == 2
    assert Map.has_key?(new_state.players["player1"]["hand"], "Card A") == true
  end

  test "play_card moves card from hand to field", %{initial_state: state} do
    card1 = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    state_with_card_in_hand = put_in(state.players["player1"]["hand"], card1)
    new_state = GameLogic.play_card_logic(state_with_card_in_hand, "player1", card1)

    assert map_size(new_state.players["player1"]["hand"]) == 0
    assert map_size(new_state.players["player1"]["field"]) == 1
    assert Map.has_key?(new_state.players["player1"]["field"], "Card X") == true
  end

  test "move_card moves card from source to (dest with card)", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], card1)
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", "graveyard", "deck", card1)

    assert map_size(new_state.players["player1"]["graveyard"]) == 0
    assert map_size(new_state.players["player1"]["deck"]) == 4
    assert Map.has_key?(new_state.players["player1"]["deck"], "Card Y") == true
  end

  test "move_card moves card from source to dest", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], card1)
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", "graveyard", "hand", card1)

    assert map_size(new_state.players["player1"]["graveyard"]) == 0
    assert map_size(new_state.players["player1"]["hand"]) == 1
    assert Map.has_key?(new_state.players["player1"]["hand"], "Card Y") == true
  end

  test "update_values update card properties", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", "graveyard", card1)
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player1", "graveyard", "attack", 7, "card1")

    assert new_state.players["player1"]["graveyard"]["card1"]["properties"]["attack"] == 7
  end
end
