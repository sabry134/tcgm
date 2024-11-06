package db

import (
	"context"
	"fmt"
	"os"
	"server/logger"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client

// InitRedis initializes a connection to a redis service.
// It takes the necessary parameters from environment variables.
func InitRedis() error {
	redisHost := os.Getenv("REDIS_HOST")
	redisPort := os.Getenv("REDIS_PORT")

	RedisClient = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", redisHost, redisPort),
	})

	_, err := RedisClient.Ping(context.Background()).Result()
	if err != nil {
		return err
	}

	logger.Info("Connected to Redis!")
	return nil
}

// CloseRedis closes the connection to a redis service.
func CloseRedis() {
	if RedisClient != nil {
		RedisClient.Close()
	}
}
