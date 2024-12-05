package main

import (
	"fmt"
	"server/db"
	"server/logger"
	"server/server"
	"server/server/models"
)

func main() {
	err := db.InitDatabases()

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to initialize database: %v", err))
	}
	defer db.CloseDatabases()

	s := &models.Server{
		Rooms:   make(map[string]*models.Room),
		Clients: make(map[*models.Client]bool),
		Port:    12345,
		Quit:    make(chan struct{}),
	}
	server.Start(s)
}
