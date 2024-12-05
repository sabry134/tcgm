package gamestate

import (
	"encoding/json"
	"fmt"
	"server/db"
	"server/game/cards"
	"server/game/config"
	"server/game/players"
	"server/logger"
	"server/server/models"

	"github.com/go-redis/redis"
)

type GameState struct {
	Players        []*players.Player
	CardContainers map[string]*cards.CardContainer
}

func initPlayers(g *models.Game, gamestate *GameState) {
	for player := range g.Players {
		gamestate.Players = append(gamestate.Players, players.InitPlayer(player.Name))
	}
}

func initCardContainers(gamestate *GameState) {

	for _, player := range gamestate.Players {
		gamestate.CardContainers[player.Username+":hand"] = &cards.CardContainer{Public: false}

		for _, deck := range config.DeckTypesConfigVar.DeckTypes {
			gamestate.CardContainers[player.Username+":"+deck.Name] = &cards.CardContainer{Public: deck.Public}
		}

		for _, zone := range config.GeneralRulesConfigVar.GeneralRules.CardContainers {
			gamestate.CardContainers[player.Username+":"+zone.Name] = &cards.CardContainer{Public: zone.Public}
		}
	}
}

// InitGameState initializes the an instance of the GameState struct
func InitGameSate(g *models.Game) *GameState {
	gameState := &GameState{}

	data, err := json.Marshal(gameState)
	if err != nil {
		logger.Error(fmt.Sprintf("Error serializing game state: %v", err))
		return nil
	}

	gameKey := fmt.Sprintf("game:%s:state", g.GameId)
	if err := db.SetRedisData(db.RedisClient.Context(), gameKey, data); err != nil {
		logger.Error("Failed to save game state to Redis.")
		return nil
	}

	initPlayers(g, gameState)
	initCardContainers(gameState)
	// Should load initial game state from rules

	return gameState
}

// GetGameStateData returns the game state as an object to be viewed by the client.
func GetGameStateData(g *models.Game) map[string]interface{} {
	gameKey := fmt.Sprintf("game:%s:state", g.GameId)

	data, err := db.RedisClient.Get(db.RedisClient.Context(), gameKey).Bytes()
	if err == redis.Nil {
		logger.Error(fmt.Sprintf("Game state for game ID %s not found", g.GameId))
		return nil
	} else if err != nil {
		logger.Error(fmt.Sprintf("Error retrieving game state for game ID %s: %v", g.GameId, err))
		return nil
	}

	var gameState GameState
	if err := json.Unmarshal(data, &gameState); err != nil {
		logger.Error(fmt.Sprintf("Error deserializing game state for game ID %s: %v", g.GameId, err))
		return nil
	}

	gameStateMap := map[string]interface{}{
		"state": gameState,
	}

	return gameStateMap
}
