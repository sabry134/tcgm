defmodule TcgmWebApp.Game.GameCondition do
  alias TcgmWebApp.Game.GameLogic

  @map_fonc_actions %{
    "draw_card" => &GameLogic.draw_card/3,
    "play_card_logic" => &GameLogic.play_card_logic/3,
    "move_card_logic" => &GameLogic.move_card_logic/3,
    "insert_card" => &GameLogic.insert_card/3,
    "update_values_logic" => &GameLogic.update_values_logic/3,
  }

  @map_foncs %{
    "<" => &Kernel.</2,
    "<=" => &Kernel.<=/2,
    "==" => &Kernel.==/2,
    ">=" => &Kernel.>=/2,
    ">" => &Kernel.>/2,
  }

  def action_condition(state, player_id, args) do
    not match?({:error, _}, @map_fonc_actions[args["action_name"]].(state, player_id, args["args"]))
  end

  def number_of_cards_in_hand(state, player_id, args) do
    cond_result = @map_foncs[args["fonc"]].(length(state.players[player_id]["hand"]), args["number"])
    cond_result
  end

  def condition_logic(state, player_id, args) do
    if args["type"] == "predicate" do
      cond do
        args["condition_name"] == "count_cards" ->
          number_of_cards_in_hand(state, player_id, args["args"])
      end
    else
      action_condition(state, player_id, args)
    end
  end
end
