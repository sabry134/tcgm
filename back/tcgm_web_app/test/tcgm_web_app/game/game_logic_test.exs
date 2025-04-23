defmodule TcgmWebApp.Game.GameLogicTest do
  use ExUnit.Case, async: true
  alias TcgmWebApp.Game.GameLogic

  setup do
    initial_state = %{
      players: %{
        "player1" => %{
          "hand" => [],
          "deck" =>  [
            %{"Card A" => %{"name" => "Lion","properties" => %{"attack" => 7, "defense" => 3}}},
            %{"Card B" => %{"name" => "Zombie","properties" => %{"attack" => 5, "defense" => 11}}},
            %{"Card C" => %{"name" => "Gobelin","properties" => %{"attack" => 8, "defense" => 4}}}
          ],
          "field" => [],
          "graveyard" => []
        }
      },
      turn: "player1",
      turnCount: 0,
    }

    {:ok, initial_state: initial_state}
  end

  test "draw_card with undefined amount", %{initial_state: state} do
    action_args = %{}
    new_state = GameLogic.draw_card(state, "player1", action_args)

    assert new_state == {:error, "Missing required action arguments: amount"}
  end

  test "draw_card with undefined player", %{initial_state: state} do
    action_args = %{"amount" => 1}
    new_state = GameLogic.draw_card(state, "player undefined", action_args)

    assert new_state == {:error, "Le player n'existe pas"}
  end

  test "draw_card with empty deck", %{initial_state: state} do
    updated_state = update_in(state[:players]["player1"]["deck"], fn _deck -> [] end)
    action_args = %{"amount" => 1}
    new_state = GameLogic.draw_card(updated_state, "player1", action_args)

    assert new_state == {:error, "Le deck est vide"}
  end

  test "draw_card moves card from deck with 1 Card to hand", %{initial_state: state} do
    updated_state = update_in(state[:players]["player1"]["deck"], fn deck ->
      deck
      |> Enum.take(1)
    end)
    action_args = %{"amount" => 1}
    new_state = GameLogic.draw_card(updated_state, "player1", action_args)

    assert length(new_state.players["player1"]["hand"]) == 1
    assert length(new_state.players["player1"]["deck"]) == 0
    assert Enum.any?(new_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card A") end) == true
  end

  test "draw_card moves card from deck to hand", %{initial_state: state} do
    action_args = %{"amount" => 1}
    new_state = GameLogic.draw_card(state, "player1", action_args)

    assert length(new_state.players["player1"]["hand"]) == 1
    assert length(new_state.players["player1"]["deck"]) == 2
    assert Enum.any?(new_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card A") end) == true
  end

  test "draw_card draws more than one card", %{initial_state: state} do
    action_args = %{"amount" => 2}
    new_state = GameLogic.draw_card(state, "player1", action_args)

    assert length(new_state.players["player1"]["hand"]) == 2
    assert length(new_state.players["player1"]["deck"]) == 1
    assert Enum.any?(new_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card A") end) == true
    assert Enum.any?(new_state.players["player1"]["hand"], fn card -> Map.has_key?(card, "Card B") end) == true
  end

  test "play_card with undefined player", %{initial_state: state} do
    card1 = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    action_args = %{"card" => card1}
    state_with_card_in_hand = put_in(state.players["player1"]["hand"], card1)
    new_state = GameLogic.play_card_logic(state_with_card_in_hand, "player undefined", action_args)

    assert new_state == {:error, "Le player n'existe pas"}
  end

  test "play_card with empty hand", %{initial_state: state} do
    card1 = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    action_args = %{"card" => card1}
    new_state = GameLogic.play_card_logic(state, "player1", action_args)

    assert new_state == {:error, "La main est vide"}
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
    action_args = %{"card" => card2}
    state_with_card_in_hand = put_in(state.players["player1"]["hand"], [card1])
    new_state = GameLogic.play_card_logic(state_with_card_in_hand, "player1", action_args)

    assert new_state == {:error, "la carte n'existe pas"}
  end

  test "play_card moves card from hand to field", %{initial_state: state} do
    card1 = %{"Card X" => %{
      "name" => "king",
      "properties" => %{"attack" => 15, "defense" => 10}
    }}
    action_args = %{"card" => card1}
    state_with_card_in_hand = put_in(state.players["player1"]["hand"], [card1])
    new_state = GameLogic.play_card_logic(state_with_card_in_hand, "player1", action_args)

    assert length(new_state.players["player1"]["hand"]) == 0
    assert length(new_state.players["player1"]["field"]) == 1
    assert Enum.any?(new_state.players["player1"]["field"], fn card -> Map.has_key?(card, "Card X") end) == true

  end

  test "move_card with undefined player", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"source" => "graveyard", "dest" => "hand", "card" => card1}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], card1)
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player undefined", action_args)

    assert new_state == {:error, "Le player n'existe pas"}
  end

  test "move_card with undefined source", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"source" => "cemetery", "dest" => "hand", "card" => card1}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], card1)
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", action_args)

    assert new_state == {:error, "la source n'existe pas"}
  end

  test "move_card with empty source", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"source" => "graveyard", "dest" => "deck", "card" => card1}
    new_state = GameLogic.move_card_logic(state, "player1", action_args)

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
    action_args = %{"source" => "graveyard", "dest" => "deck", "card" => card2}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], [card1])
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", action_args)

    assert new_state == {:error, "la carte n'existe pas"}
  end

  test "move_card with undefined destination", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"source" => "graveyard", "dest" => "cemetery", "card" => card1}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], [card1])
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", action_args)

    assert new_state == {:error, "la destination n'existe pas"}
  end

  test "move_card moves card from source to (dest with card)", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], [card1])
    action_args = %{"source" => "graveyard", "dest" => "deck", "card" => card1}
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", action_args)

    assert length(new_state.players["player1"]["graveyard"]) == 0
    assert length(new_state.players["player1"]["deck"]) == 4
    assert Enum.any?(new_state.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card Y") end) == true

  end

  test "move_card moves card from source to dest", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"source" => "graveyard", "dest" => "hand", "card" => card1}
    state_with_card_in_graveyard = put_in(state.players["player1"]["graveyard"], [card1])
    new_state = GameLogic.move_card_logic(state_with_card_in_graveyard, "player1", action_args)

    assert length(new_state.players["player1"]["graveyard"]) == 0
    assert length(new_state.players["player1"]["hand"]) == 1
    assert Enum.any?(new_state.players["player1"]["hand"], fn card -> Map.has_key?(card,"Card Y") end) == true
  end

  test "update_values with undefined player", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    insert_args = %{"location" => "graveyard", "card" => card1}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", insert_args)
    update_values_args = %{"location" => "graveyard", "key" => "attack", "value" => 7, "card" => "card1"}
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player undefined", update_values_args)

    assert new_state == {:error, "Le player n'existe pas"}
  end

  test "update_values with undefined location", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    insert_args = %{"location" => "graveyard", "card" => card1}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", insert_args)
    update_values_args = %{"location" => "cemetery", "key" => "attack", "value" => 7, "card" => "card1"}
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player1", update_values_args)

    assert new_state == {:error, "la location n'existe pas"}
  end

  test "update_values with undefined card", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    insert_args = %{"location" => "graveyard", "card" => card1}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", insert_args)
    update_values_args = %{"location" => "graveyard", "key" => "attack", "value" => 7, "card" => "card z"}
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player1", update_values_args)

    assert new_state == {:error, "la carte n'existe pas"}
  end

  test "update_values with undefined properties", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    insert_args = %{"location" => "graveyard", "card" => card1}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", insert_args)
    update_values_args = %{"location" => "graveyard", "key" => "invincibilite", "value" => 7, "card" => "card1"}
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player1", update_values_args)

    assert new_state == {:error, "la propriete n'existe pas"}
  end

  test "update_values update card properties", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    insert_args = %{"location" => "graveyard", "card" => card1}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", insert_args)
    update_values_args = %{"location" => "graveyard", "key" => "attack", "value" => 7, "card" => "card1"}
    new_state = GameLogic.update_values_logic(state_with_card_in_graveyard, "player1", update_values_args)

    card = Enum.find(new_state.players["player1"]["graveyard"], fn c -> Map.has_key?(c, "card1") end)
    assert card["card1"]["properties"]["attack"] == 7
  end

  test "insert_card with undefined player", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"location" => "graveyard", "card" => card1}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player undefined", action_args)

    assert state_with_card_in_graveyard == {:error, "Le player n'existe pas"}
  end

  test "insert_card with card already exist", %{initial_state: state} do
    card1 = %{"Card B" => %{
      "name" => "Zombie",
      "properties" => %{"attack" => 5, "defense" => 11}
    }}
    action_args = %{"location" => "deck", "card" => card1}
    state_with_card_in_deck = GameLogic.insert_card(state, "player1", action_args)

    assert state_with_card_in_deck == {:error, "la carte existe deja"}
  end

  test "insert_card with undefined destination", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"location" => "cemetery", "card" => card1}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", action_args)

    assert state_with_card_in_graveyard == {:error, "la destination n'existe pas"}
  end

  test "insert_card insert card into location", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"location" => "graveyard", "card" => card1}
    state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", action_args)

    assert Enum.any?(state_with_card_in_graveyard.players["player1"]["graveyard"], fn card -> Map.has_key?(card, "Card Y") end) == true

  end

  test "insert_card insert card into location with already cards", %{initial_state: state} do
    card1 = %{"Card Y" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    action_args = %{"location" => "deck", "card" => card1}
    state_with_card_in_deck = GameLogic.insert_card(state, "player1", action_args)

    assert Enum.any?(state_with_card_in_deck.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card A") end) == true
    assert Enum.any?(state_with_card_in_deck.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card B") end) == true
    assert Enum.any?(state_with_card_in_deck.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card C") end) == true
    assert Enum.any?(state_with_card_in_deck.players["player1"]["deck"], fn card -> Map.has_key?(card, "Card Y") end) == true
  end

  test "set_turn set the turn state", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    insert_args = %{"location" => "graveyard", "card" => card1}
    #state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", insert_args)
    state_pass_turn = GameLogic.set_turn(state, "player1", insert_args)

    assert state_pass_turn.turn == "player1"
  end

  test "pass_turn pass the turn to another player", %{initial_state: state} do
    card1 = %{"card1" => %{
      "name" => "Dragon",
      "properties" => %{"attack" => 10, "defense" => 5}
    }}
    insert_args = %{"location" => "graveyard", "card" => card1}
    _state_with_card_in_graveyard = GameLogic.insert_card(state, "player1", insert_args)
    state_pass_turn = GameLogic.pass_turn_logic(state, "player2", insert_args)

    assert state_pass_turn.turn == "player2"
    assert state_pass_turn.turnCount == 1
  end
end
