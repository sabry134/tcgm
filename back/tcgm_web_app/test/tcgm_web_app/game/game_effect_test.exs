defmodule TcgmWebApp.Game.GameEffectTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameEffect
  alias TcgmWebApp.Game.GameCondition
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

  test "apply_effect will not success to affect by cond with cond number_of_cards_in_hand and draw_card", %{initial_state: state} do
    card1 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card2 = %{"Card 2" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card3 = %{"Card 3" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    card4 = %{"Card 4" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}

    action = %{
      "func" => &GameLogic.draw_card/3,
      "args" => %{
        "amount" => 2
      }
    }
    condition = %{
      "func" => &GameCondition.number_of_cards_in_hand/3,
      "args" => %{
        "fonc" => &Kernel.<=/2,
        "number" => 3
      }
    }

    new_state = put_in(state, [:players, "player1", "hand", "Card Y"], card1["Card Y"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card 2"], card2["Card 2"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card 3"], card3["Card 3"])
    new_state = put_in(new_state, [:players, "player1", "hand", "Card 4"], card4["Card 4"])
    result = GameEffect.apply_effect(new_state, "player1", action, condition)
    assert match?({:error, _}, result)
  end

  test "apply_effect will not success to affect by action with cond number_of_cards_in_hand and draw_card", %{initial_state: state} do
  action = %{
      "func" => &GameLogic.draw_card/3,
      "args" => %{
        "amount" => 2
      }
    }
    condition = %{
      "func" => &GameCondition.number_of_cards_in_hand/3,
      "args" => %{
        "fonc" => &Kernel.<=/2,
        "number" => 3
      }
    }
    updated_state = update_in(state[:players]["player1"]["deck"], fn _deck -> %{} end)
    result = GameEffect.apply_effect(updated_state, "player1", action, condition)
    assert match?({:error, _}, result)
  end

  test "apply_effect will apply and affect with cond number_of_cards_in_hand and draw_card", %{initial_state: state} do
    action = %{
      "func" => &GameLogic.draw_card/3,
      "args" => %{
        "amount" => 2
      }
    }
    condition = %{
      "func" => &GameCondition.number_of_cards_in_hand/3,
      "args" => %{
        "fonc" => &Kernel.<=/2,
        "number" => 3
      }
    }
    result = GameEffect.apply_effect(state, "player1", action, condition)
    assert not match?({:error, _}, result)
  end

  test "apply_effect will not affect with cond action_condition (insert_card with error) and draw_card", %{initial_state: state} do
    card1 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    action = %{
      "func" => &GameLogic.draw_card/3,
      "args" => %{
        "amount" => 2
      }
    }
    condition = %{
      "func" => &GameCondition.action_condition/3,
      "args" =>  %{
        "fonc" => &GameLogic.insert_card/3,
        "args" => %{
          "location" => "cemetery",
          "card" => card1
        }
      }
    }
    result = GameEffect.apply_effect(state, "player1", action, condition)
    assert match?({:error, _}, result)
  end

  test "apply_effect will apply and affect with cond action_condition (insert_card) and draw_card", %{initial_state: state} do
    card1 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    action = %{
      "func" => &GameLogic.draw_card/3,
      "args" => %{
        "amount" => 2
      }
    }
    condition = %{
      "func" => &GameCondition.action_condition/3,
      "args" =>  %{
        "fonc" => &GameLogic.insert_card/3,
        "args" => %{
          "location" => "graveyard",
          "card" => card1
        }
      }
    }
    result = GameEffect.apply_effect(state, "player1", action, condition)
    assert not match?({:error, _}, result)
  end

  test "apply_effect will not apply and affect with cond action_condition (insert_card) and draw_card with error", %{initial_state: state} do
    card1 = %{"Card Y" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
    action = %{
      "func" => &GameLogic.draw_card/3,
      "args" => %{
        "amount" => 2
      }
    }
    condition = %{
      "func" => &GameCondition.action_condition/3,
      "args" =>  %{
        "fonc" => &GameLogic.insert_card/3,
        "args" => %{
          "location" => "graveyard",
          "card" => card1
        }
      }
    }
    updated_state = update_in(state[:players]["player1"]["deck"], fn _deck -> %{} end)
    result = GameEffect.apply_effect(updated_state, "player1", action, condition)
    assert match?({:error, _}, result)
  end
end
