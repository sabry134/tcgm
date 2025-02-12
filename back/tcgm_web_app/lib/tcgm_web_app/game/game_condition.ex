defmodule TcgmWebApp.Game.GameCondition do

  def action_condition(state, player_id, args) do
    not match?({:error, _}, args["fonc"].(state, player_id, args["args"]))
  end

  def number_of_cards_in_hand(state, player_id, args) do
    cond_result = args["fonc"].(map_size(state.players[player_id]["hand"]), args["number"])
    cond_result
  end
end
