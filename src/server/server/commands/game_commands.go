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
	//TODO
	return "", 0
}
