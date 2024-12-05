package commands

import (
	"fmt"
	"server/server/game"
	"server/server/models"
	"server/server/response"
)

// LeaveGameCommand is the function called when the LeaveGame command is used by a client.
// It removes the client from the game they are in if any.
func LeaveGameCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Game == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a game.")
	}
	leftGame := client.Game.GameId
	game.LeaveGame(client.Game, client, s)
	data := map[string]interface{}{
		"message": fmt.Sprintf("You have left game '%s'.", leftGame),
	}
	return response.CodeSuccess, data
}

// StartGameCommand is the function called when the StartGame command is used by a client.
// It will start the game the client is in if any, and if the required amount of players are present in it.
func StartGameCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	g := client.Game
	if g == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a game.")
	}
	if client != g.Creator {
		return response.GetErrorResponse(response.CodeForbidden, "Only game creator can start it.")
	}
	minPlayers := 2 // Should get this from rules later
	if g.PlayerCount < minPlayers {
		return response.GetErrorResponse(response.CodeError, "Game has not yet reached the required player count.")
	}

	game.StartGame(g, client)
	data := map[string]interface{}{}
	return response.CodeSuccess, data
}
