defmodule TcgWebApp.GameTest do
  use ExUnit.Case

  alias TcgmWebApp.Gameplay
  alias TcgmWebApp.Gameplay.Player

  test "player draws a card from their deck" do
    # Set up the initial game state
    player1 = %Player{id: 1, hand: [], deck: ["Card1", "Card2"], field: [], graveyard: [], caster_zones: []}
    player2 = %Player{id: 2, hand: [], deck: ["Card3", "Card4"], field: [], graveyard: [], caster_zones: []}

    game_state = %Gameplay{players: [player1, player2], turn: 1, game_over: false}

    # Start the GenServer with the game state
    {:ok, _pid} = Gameplay.start_link(game_state)

    # Draw a card for player 1
    Gameplay.draw_card(1)

    # Get the updated game state
    updated_state = Gameplay.get_game_state()

    # Assertions
    updated_player1 = Enum.find(updated_state.players, fn p -> p.id == 1 end)
    assert updated_player1.hand == ["Card1"]
    assert updated_player1.deck == ["Card2"]
  end

  test "end turn switches to the next player" do
    player1 = %Player{id: 1, hand: [], deck: [], field: [], graveyard: [], caster_zones: []}
    player2 = %Player{id: 2, hand: [], deck: [], field: [], graveyard: [], caster_zones: []}

    game_state = %Gameplay{players: [player1, player2], turn: 1, game_over: false}

    {:ok, _pid} = Gameplay.start_link(game_state)

    # End turn
    Gameplay.end_turn()

    updated_state = Gameplay.get_game_state()

    # Assert that the turn has moved to player 2
    assert updated_state.turn == 2
  end
end
