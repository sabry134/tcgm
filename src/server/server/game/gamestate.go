package game

import "server/server/models"

func initGameSate(g *models.Game) *models.GameState {
	gameState := &models.GameState{}
	// Should load initial game state from rules
	return gameState
}

func getGameStateData(g *models.Game) map[string]interface{} {
	return map[string]interface{}{}
}
