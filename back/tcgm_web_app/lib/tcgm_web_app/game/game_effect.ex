defmodule TcgmWebApp.Game.GameEffect do

  def apply_effect(state, player_id, action, condition) do
    if condition["func"].(state, player_id, condition["args"]) == false do
      {:error, "cond false"}
    else
      effect = action["func"].(state, player_id, action["args"])
      effect
    end
  end
end
