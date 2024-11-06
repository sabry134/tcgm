package db

import (
	"server/logger"
)

// InitDatabases calls all initializer functions linked to different databases used.
func InitDatabases() error {
	if err := InitPostgres(); err != nil {
		return err
	}

	if err := InitMongo(); err != nil {
		ClosePostgres()
		return err
	}

	if err := InitRedis(); err != nil {
		ClosePostgres()
		CloseMongo()
		return err
	}

	logger.Info("All databases initialized successfully!")
	return nil
}

func CloseDatabases() {
	ClosePostgres()
	CloseMongo()
	CloseRedis()
}
