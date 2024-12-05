package db

import (
	"context"
	"encoding/json"
	"time"
)

type GameState struct {
	GameStateID string
}

func SaveGameState(ctx context.Context, gameState *GameState, expiration time.Duration) error {
	data, err := json.Marshal(gameState)
	if err != nil {
		return err
	}
	return RedisClient.Set(ctx, gameState.GameStateID, data, expiration).Err()
}

func GetSession(ctx context.Context, gameStateID string) (*GameState, error) {
	data, err := RedisClient.Get(ctx, gameStateID).Result()
	if err != nil {
		return nil, err
	}

	var gameState GameState
	if err := json.Unmarshal([]byte(data), &gameState); err != nil {
		return nil, err
	}
	return &gameState, nil
}
