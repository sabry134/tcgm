package db

import (
	"context"
	"encoding/json"
	"fmt"
	"server/logger"
)

type User struct {
	ID         int
	Username   string
	Email      string
	CustomData map[string]interface{} `json:"custom_data"` // JSON data for custom values
}

func CreateUser(ctx context.Context, user *User) error {
	jsonData, err := json.Marshal(user.CustomData)
	if err != nil {
		return err
	}
	_, err = PostgresDB.Exec(ctx,
		"INSERT INTO users (username, email, custom_data) VALUES ($1, $2, $3)",
		user.Username, user.Email, jsonData,
	)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to create user : %v", err))
		return err
	}
	return nil
}
