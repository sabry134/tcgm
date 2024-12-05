package game

import (
	"fmt"
	"server/game/gamestate"
	"server/server/models"
	"server/server/response"

	"github.com/google/uuid"
)

func generateGameId() string {
	return uuid.New().String()
}

// CreateGame created a new instance of the Game struct.
func CreateGame(r *models.Room, client *models.Client) *models.Game {
	gameId := generateGameId()

	newGame := &models.Game{GameId: gameId, Players: make(map[*models.Client]bool)}

	r.WithLock(func(r *models.Room) {
		r.Games[gameId] = newGame
	})

	client.Game = newGame

	newGame.WithLock(func(g *models.Game) {
		newGame.Players[client] = true
		newGame.Creator = client
		newGame.PlayerCount = 1
		newGame.GameStarted = false
	})

	data := map[string]interface{}{
		"info":        "Game was created in this room.",
		"gameId":      gameId,
		"creatorName": client.Name,
	}

	for c := range r.Clients {
		if c != client {
			response.SendInfo(c, data)
		}
	}

	return newGame
}

// JoinGame adds a client to a game.
// It sends an info message in the process to notify the other players in the game.
func JoinGame(g *models.Game, c *models.Client) {
	c.Game = g
	g.WithLock(func(g *models.Game) {
		g.Players[c] = true
		g.PlayerCount = g.PlayerCount + 1
	})

	data := map[string]interface{}{
		"info":        fmt.Sprintf("%s has joined the game.", c.Name),
		"playerCount": g.PlayerCount + 1,
	}

	for p := range g.Players {
		if p != c {
			response.SendInfo(c, data)
		}
	}
}

// GetGamesList returns a list of games hosted in a room.
func GetGamesList(r *models.Room) interface{} {
	var gamesList []map[string]interface{}
	for gameId, g := range r.Games {
		gameData := map[string]interface{}{
			"gameId":  gameId,
			"creator": g.Creator,
			"players": g.Players,
		}
		gamesList = append(gamesList, gameData)
	}
	return gamesList
}

// CloseGame closes an existing game.
// It sends an info message in the process to notify them.
func CloseGame(g *models.Game, r *models.Room) {
	data := map[string]interface{}{
		"info": "Game has been closed by owner",
	}

	for player := range g.Players {
		player.Room = nil
		response.SendInfo(player, data)
		g.WithLock(func(g *models.Game) {
			delete(g.Players, player)
		})
	}

	r.WithLock(func(r *models.Room) {
		delete(r.Games, g.GameId)
	})
}

// LeaveGame removes a client from a room.
// It sends an info message in the process to all other players in the game to notify them.
func LeaveGame(g *models.Game, client *models.Client, s *models.Server) {
	g.WithLock(func(g *models.Game) {
		delete(g.Players, client)
	})

	client.Game = nil
	if g.Creator == client || len(g.Players) == 0 {
		CloseGame(g, client.Room)
	}

	data := map[string]interface{}{
		"info": fmt.Sprintf("%s has left the game.", client.Name),
	}
	for c := range g.Players {
		response.SendInfo(c, data)
	}
}

// StartGame starts a game.
// It sends an info message to all players in the game to notify them.
func StartGame(g *models.Game, client *models.Client) {
	gamestate.InitGameSate(g)
	g.WithLock(func(g *models.Game) {
		g.GameStarted = true
	})
	gameStateData := gamestate.GetGameStateData(g)
	data := map[string]interface{}{
		"message":     "Game has started.",
		"playerCount": g.PlayerCount,
		"gameState":   gameStateData,
	}

	for p := range g.Players {
		p.InGame = true
		response.SendInfo(p, data)
	}
}
