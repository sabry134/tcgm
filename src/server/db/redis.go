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

	ctx := context.Background()
	_, err := RedisClient.Ping(ctx).Result()
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

// GetRedisData retrieves data from Redis for a given key.
func GetRedisData(ctx context.Context, key string) ([]byte, error) {
	data, err := RedisClient.Get(ctx, key).Bytes()
	if err == redis.Nil {
		logger.Error(fmt.Sprintf("Key %s does not exist", key))
		return nil, nil // Return nil data for non-existing keys
	} else if err != nil {
		logger.Error(fmt.Sprintf("Error retrieving data for key %s: %v", key, err))
		return nil, err
	}
	return data, nil
}

// SetRedisData stores data in Redis for a given key.
func SetRedisData(ctx context.Context, key string, value []byte) error {
	err := RedisClient.Set(ctx, key, value, 0).Err()
	if err != nil {
		logger.Error(fmt.Sprintf("Error setting data for key %s: %v", key, err))
		return err
	}
	return nil
}
