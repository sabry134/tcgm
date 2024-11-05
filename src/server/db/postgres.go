package db

import (
	"context"
	"server/logger"

	"github.com/jackc/pgx/v5"
)

var PostgresDB *pgx.Conn

func InitPostgres(connectionString string) error {
	var err error
	PostgresDB, err = pgx.Connect(context.Background(), connectionString)
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
