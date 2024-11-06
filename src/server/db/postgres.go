package db

import (
	"context"
	"fmt"
	"os"
	"server/logger"

	"github.com/jackc/pgx/v5"
)

var PostgresDB *pgx.Conn

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

func ClosePostgres() {
	if PostgresDB != nil {
		PostgresDB.Close(context.Background())
	}
}
