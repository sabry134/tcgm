package db

import (
	"context"
	"fmt"
	"server/logger"

	"go.mongodb.org/mongo-driver/bson"
)

type Card struct {
	ID         string                 `bson:"_id"`
	Name       string                 `bson:"name"`
	CustomData map[string]interface{} `bson:"custom_data"` // JSON data for custom values
	// More card fields to add here
}

func InsertCard(ctx context.Context, card *Card) error {
	collection := GetMongoCollection("game", "cards")
	_, err := collection.InsertOne(ctx, card)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to insert card: %v", err))
		return err
	}
	return nil
}

func GetCardByID(ctx context.Context, id string) (*Card, error) {
	collection := GetMongoCollection("game", "cards")
	var card Card
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(&card)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to retrieve card: %v", err))
		return nil, err
	}
	return &card, nil
}
