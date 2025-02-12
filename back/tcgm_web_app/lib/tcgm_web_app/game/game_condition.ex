defmodule TcgmWebApp.Game.GameCondition do

  def action_condition(state, player_id, args) do
    not match?({:error, _}, args["1"].(args["2"]))
  end

  def number_of_cards_in_hand(state, player_id, args) do
    cond_result = args["1"].(map_size(state.players[player_id]["hand"]), args["2"])
    cond_result
  end
end
