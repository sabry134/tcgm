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

  test "draw_card with undefined player", %{initial_state: state} do
    new_state = GameLogic.draw_card(state, "player undefined")

    assert new_state == {:error, "Le player n'existe pas"}
  end

  test "draw_card with empty deck", %{initial_state: state} do
    updated_state = update_in(state[:players]["player1"]["deck"], fn _deck -> %{} end)
    new_state = GameLogic.draw_card(updated_state, "player1")

    assert new_state == {:error, "Le deck est vide"}
  end

  test "draw_card moves card from deck with 1 Card to hand", %{initial_state: state} do
    updated_state = update_in(state[:players]["player1"]["deck"], fn deck ->
      deck
      |> Enum.take(1)
      |> Enum.into(%{})
    end)
    new_state = GameLogic.draw_card(updated_state, "player1")

    assert map_size(new_state.players["player1"]["hand"]) == 1
    assert map_size(new_state.players["player1"]["deck"]) == 0
    assert Map.has_key?(new_state.players["player1"]["hand"], "Card A") == true
  end

  test "draw_card moves card from deck to hand", %{initial_state: state} do
    new_state = GameLogic.draw_card(state, "player1")

    assert map_size(new_state.players["player1"]["hand"]) == 1
    assert map_size(new_state.players["player1"]["deck"]) == 2
    assert Map.has_key?(new_state.players["player1"]["hand"], "Card A") == true
  end

  test "play_card with undefined player", %{initial_state: state} do
    card1 = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    state_with_card_in_hand = put_in(state.players["player1"]["hand"], card1)
    new_state = GameLogic.play_card_logic(state_with_card_in_hand, "player undefined", card1)

    assert new_state == {:error, "Le player n'existe pas"}
  end

  test "play_card with empty hand", %{initial_state: state} do
    card1 = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    new_state = GameLogic.play_card_logic(state, "player1", card1)

    assert new_state == {:error, "Le deck est vide"}
  end

  test "play_card with undefined card", %{initial_state: state} do
    card1 = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    card2 = %{"Card Y" => %{
      "name" => "zombi",
      "properties" => %{"attack" => 3, "defense" => 9}
    }}
    state_with_card_in_hand = put_in(state.players["player1"]["hand"], card1)
    new_state = GameLogic.play_card_logic(state_with_card_in_hand, "player1", card2)

    assert new_state == {:error, "la carte n'existe pas"}
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

  test "move_card with undefined player", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], card1)
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player undefined", "graveyard", "hand", card1)

    assert new_state == {:error, "Le player n'existe pas"}
  end

  test "move_card with undefined source", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], card1)
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", "cemetery", "hand", card1)

    assert new_state == {:error, "la source n'existe pas"}
  end

  test "move_card with empty source", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    new_state = GameLogic.move_card_logic(state, "player1", "graveyard", "deck", card1)

    assert new_state == {:error, "La source est vide"}
  end

  test "move_card with undefined card", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    card2 = %{"Card Z" => %{
      "name" => "zombi",
      "properties" => %{"attack" => 3, "defense" => 9}
    }}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], card1)
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", "graveyard", "deck", card2)

    assert new_state == {:error, "la carte n'existe pas"}
  end

  test "move_card with undefined destination", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], card1)
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", "graveyard", "main", card1)

    assert new_state == {:error, "la destination n'existe pas"}
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

  test "update_values with undefined player", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", "graveyard", card1)
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player undefined", "graveyard", "attack", 7, "card1")

    assert new_state == {:error, "Le player n'existe pas"}
  end

  test "update_values with undefined location", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", "graveyard", card1)
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player1", "cemetery", "attack", 7, "card1")

    assert new_state == {:error, "la location n'existe pas"}
  end

  test "update_values with undefined card", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", "graveyard", card1)
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player1", "graveyard", "attack", 7, "card z")

    assert new_state == {:error, "la carte n'existe pas"}
  end

  test "update_values with undefined properties", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", "graveyard", card1)
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player1", "graveyard", "invincibilite", 7, "card1")

    assert new_state == {:error, "la propriete n'existe pas"}
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

  test "insert_card with undefined player", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player undefined", "graveyard", card1)

    assert state_with_card_in_graveyard == {:error, "Le player n'existe pas"}
  end

  test "insert_card with card already exist", %{initial_state: state} do
    card1 = %{"Card B" => %{
      "name" => "Zombie",
      "properties" => %{"attack" => 5, "defense" => 11}
    }}
    state_with_card_in_deck = GameLogic.insert_card(state, "player1", "deck", card1)

    assert state_with_card_in_deck == {:error, "la carte existe deja"}
  end

  test "insert_card with undefined destination", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", "cemetery", card1)

    assert state_with_card_in_graveyard == {:error, "la destination n'existe pas"}
  end

  test "insert_card insert card into location", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", "graveyard", card1)

    assert Map.has_key?(state_with_card_in_graveyard.players["player1"]["graveyard"], "Card Y") == true
  end

  test "insert_card insert card into location with already cards", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_deck = GameLogic.insert_card(state, "player1", "deck", card1)

    assert Map.has_key?(state_with_card_in_deck.players["player1"]["deck"], "Card A") == true
    assert Map.has_key?(state_with_card_in_deck.players["player1"]["deck"], "Card B") == true
    assert Map.has_key?(state_with_card_in_deck.players["player1"]["deck"], "Card C") == true
    assert Map.has_key?(state_with_card_in_deck.players["player1"]["deck"], "Card Y") == true
  end
end
