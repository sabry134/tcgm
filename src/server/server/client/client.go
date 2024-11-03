package client

import (
	"fmt"
	"net"
	"server/logger"
	"server/server/models"
	"server/server/room"
)

func DisconnectClient(s *models.Server, client *models.Client) {
	if client.Room != nil {
		room.LeaveRoom(client.Room, client, s)
	}
	delete(s.Clients, client)
	client.Conn.Close()
}

func CreateClient(s *models.Server, conn net.Conn) *models.Client {
	client := &models.Client{
		Conn:   conn,
		Name:   "",
		Room:   nil,
		InGame: false,
	}

	return client
}

func CloseAllClients(s *models.Server) {
	s.Mu.Lock()
	defer s.Mu.Unlock()

	for client := range s.Clients {
		client.Conn.Close()
		delete(s.Clients, client)
	}
}

func LoginClient(s *models.Server, client *models.Client, username string) {
	client.Name = username

	s.WithLock(func(s *models.Server) {
		s.Clients[client] = true
	})

	logger.Info(fmt.Sprintf("New client connected: %v with username : %s", client.Conn.RemoteAddr(), client.Name))
}
