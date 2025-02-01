defmodule TcgWebApp.Gameplay.ActionsTest do
  use ExUnit.Case
  alias TcgWebApp.Gameplay.{Actions, Player}

  setup do
    players = [
      Player.new(1, ["Card1", "Card2"]),
      Player.new(2, ["Card3", "Card4"])
    ]

    {:ok, players: players}
  end

  test "draw a card from the deck", %{players: players} do
    updated_players = Actions.draw_card(players, 1)
    player1 = Enum.find(updated_players, fn p -> p.id == 1 end)

    assert player1.hand == ["Card1"]
    assert player1.deck == ["Card2"]
  end

  test "play a card to the field", %{players: players} do
    players = Actions.draw_card(players, 1)
    updated_players = Actions.play_card(players, 1, "Card1")

    player1 = Enum.find(updated_players, fn p -> p.id == 1 end)

    assert player1.hand == []
    assert player1.field == ["Card1"]
    assert player1.deck == ["Card2"]
  end
end
