defmodule TcgWebApp.Gameplay.TurnManager do
  def next_turn(players, current_turn) do
    current_index = Enum.find_index(players, fn player -> player.id == current_turn end)
    next_index = rem(current_index + 1, length(players))
    Enum.at(players, next_index).id
  end
end
