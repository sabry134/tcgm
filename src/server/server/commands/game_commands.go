package commands

import (
	"fmt"
	"server/server/game"
	"server/server/models"
	"server/server/response"
)

func LeaveGameCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Game == nil {
		response.GetErrorResponse(response.CodeNotFound, "You are not in a game.")
	}
	leftGame := client.Game.GameId
	game.LeaveGame(client.Game, client, s)
	data := map[string]interface{}{
		"message": fmt.Sprintf("You have left game '%s'.", leftGame),
	}
	return response.CodeSuccess, data
}

func StartGameCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	g := client.Game
	if g == nil {
		response.GetErrorResponse(response.CodeNotFound, "You are not in a game.")
	}
	if client != g.Creator {
		response.GetErrorResponse(response.CodeForbidden, "Only game creator can start it.")
	}
	minPlayers := 2 // Should get this from rules later
	if g.PlayerCount < minPlayers {
		response.GetErrorResponse(response.CodeError, "Game has not yet reached the required player count.")
	}

	game.StartGame(g, client)
	data := map[string]interface{}{}
	return response.CodeSuccess, data
}
