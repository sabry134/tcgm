defmodule TcgmWebApp.Game.GameConditionTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameCondition

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

  test "number_of_cards_in_hand will check if the number of card in hand is <= 3", %{initial_state: state} do
    args = %{
      "1" => &Kernel.<=/2,
      "2" => 3
    }

    cond_result = GameCondition.number_of_cards_in_hand(state, "player1", args)
    assert cond_result == true
  end

  test "number_of_cards_in_hand will check if the number of card in hand is > 3", %{initial_state: state} do
    args = %{
      "1" => &Kernel.<=/2,
      "2" => 3
    }
    card1 = %{"Card A" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card B" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}

    new_state = put_in(state, [:players, "player1", "hand", "Card A"], card1["Card A"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card B"], card2["Card B"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card C"], card3["Card C"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card Y"], card4["Card Y"])
    cond_result = GameCondition.number_of_cards_in_hand(new_state, "player1", args)
    assert cond_result == false
  end

  test "number_of_cards_in_hand will check if the number of card in hand is 4", %{initial_state: state} do
    args = %{
      "1" => &Kernel.==/2,
      "2" => 4
    }
    card1 = %{"Card A" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card B" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}

    new_state = put_in(state, [:players, "player1", "hand", "Card A"], card1["Card A"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card B"], card2["Card B"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card C"], card3["Card C"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card Y"], card4["Card Y"])
    cond_result = GameCondition.number_of_cards_in_hand(new_state, "player1", args)
    assert cond_result == true
  end
end
