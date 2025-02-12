defmodule TcgmWebApp.Game.GameEffect do

  def apply_effect(state, player_id, action, condition) do
    [condition_id | _rest] = Map.keys(action["cond"])
    if condition["func"][condition_id].(state, player_id, condition["args"]) == false do
      {:error, "cond false"}
    else
      [action_id | _rest] = Map.keys(action["func"])
      effect = action["func"][action_id].(state, player_id, action["args"])
      effect
    end
  end
end
