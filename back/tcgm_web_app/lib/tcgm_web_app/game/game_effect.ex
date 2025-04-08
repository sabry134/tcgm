defmodule TcgmWebApp.Game.GameEffect do
  alias TcgmWebApp.Game.GameCondition
  alias TcgmWebApp.Game.GameLogic

  @map_fonc_actions %{
    "draw_card" => &GameLogic.draw_card/3,
    "play_card_logic" => &GameLogic.play_card_logic/3,
    "move_card_logic" => &GameLogic.move_card_logic/3,
    "insert_card" => &GameLogic.insert_card/3,
    "update_values_logic" => &GameLogic.update_values_logic/3,
  }

  def apply_effect(state, player_id, action, condition) do
    if GameCondition.condition_logic(state, player_id, condition) == false do
    #if condition["func"].(state, player_id, condition["args"]) == false do
      {:error, "cond false"}
    else
      effect = @map_fonc_actions[action["func"]].(state, player_id, action["args"])
      effect
    end
  end
end
