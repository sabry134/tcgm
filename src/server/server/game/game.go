package game

import (
	"fmt"
	"server/server/models"
	"server/server/response"

	"github.com/google/uuid"
)

func generateGameId() string {
	return uuid.New().String()
}

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

func StartGame(g *models.Game, client *models.Client) {
	g.WithLock(func(g *models.Game) {
		g.GameStarted = true
		g.GameState = initGameSate(g)
	})
	gameStateData := getGameStateData(g)
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
