package db

import (
	"context"
	"fmt"
	"os"
	"server/logger"

	"github.com/jackc/pgx/v5"
)

var PostgresDB *pgx.Conn

// InitPostgres initializes a connection with a postgres database.
// It takes the necessary parameters from environment variables.
func InitPostgres() error {
	var err error
	pgHost := os.Getenv("POSTGRES_HOST")
	pgPort := os.Getenv("POSTGRES_PORT")
	pgUser := os.Getenv("POSTGRES_USER")
	pgPass := os.Getenv("POSTGRES_PASSWORD")
	pgName := os.Getenv("POSTGRES_DB")
	pgUrl := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", pgUser, pgPass, pgHost, pgPort, pgName)

	PostgresDB, err = pgx.Connect(context.Background(), pgUrl)
	if err != nil {
		return err
	}
	logger.Info("Connected to PostgreSQL!")
	return nil
}

// ClosePostgres closes the connection to the postgres database.
func ClosePostgres() {
	if PostgresDB != nil {
		PostgresDB.Close(context.Background())
	}
}
