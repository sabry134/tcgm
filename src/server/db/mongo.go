package db

import (
	"context"
	"os"
	"server/logger"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

// InitMongo initializes the mongo database used by the server.
// It gets the mongo URI from environment variables and uses it for the initialization.
func InitMongo() error {
	mongoURI := os.Getenv("MONGO_URI")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	MongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		return err
	}

	logger.Info("Connected to MongoDB!")
	return nil
}

// CloseMongo closes the connection to the mongo database.
func CloseMongo() {
	if MongoClient != nil {
		MongoClient.Disconnect(context.Background())
	}
}

// GetMongoCollection gets a collection of data matching a collection stored in the mongo database.
func GetMongoCollection(database, collection string) *mongo.Collection {
	return MongoClient.Database(database).Collection(collection)
}
