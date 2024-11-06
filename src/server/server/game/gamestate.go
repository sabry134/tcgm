package game

import "server/server/models"

// InitGameState initializes the an instance of the GameState struct
func initGameSate(g *models.Game) *models.GameState {
	gameState := &models.GameState{}
	// Should load initial game state from rules
	return gameState
}

// GetGameStateData returns the game state as an object to be viewed by the client.
func getGameStateData(g *models.Game) map[string]interface{} {
	return map[string]interface{}{}
}
