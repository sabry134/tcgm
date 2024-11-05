package db

import "server/logger"

func InitDatabases(pgConnStr, mongoConnStr, redisAddr, redisPass string, redisDB int) error {
	if err := InitPostgres(pgConnStr); err != nil {
		return err
	}

	if err := InitMongo(mongoConnStr); err != nil {
		ClosePostgres()
		return err
	}

	if err := InitRedis(redisAddr, redisPass, redisDB); err != nil {
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
