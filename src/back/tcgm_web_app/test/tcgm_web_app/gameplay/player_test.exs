defmodule TcgWebApp.Gameplay.PlayerTest do
  use ExUnit.Case
  alias TcgWebApp.Gameplay.Player

  test "initialize a new player" do
    player = Player.new(1, ["Card1", "Card2"])
    assert player.id == 1
    assert player.hand == []
    assert player.deck == ["Card1", "Card2"]
    assert player.field == []
    assert player.graveyard == []
    assert player.caster_zones == []
  end
end
