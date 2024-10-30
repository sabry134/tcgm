package main

import (
	"server/server"
	"server/server/models"
)

func main() {
	s := &models.Server{
		Rooms:   make(map[string]*models.Room),
		Clients: make(map[*models.Client]bool),
		Port:    12345,
		Quit:    make(chan struct{}),
	}
	server.Start(s)
}
