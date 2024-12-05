package client

import (
	"fmt"
	"net"
	"server/logger"
	"server/server/models"
	"server/server/room"
)

// DisconnectClient is used to disconnect a client from server, closing it's connection in the process.
func DisconnectClient(s *models.Server, client *models.Client) {
	if client.Room != nil {
		room.LeaveRoom(client.Room, client, s)
	}
	delete(s.Clients, client)
	client.Conn.Close()
}

// CreateClient is used to create an object from the Client struct.
func CreateClient(s *models.Server, conn net.Conn) *models.Client {
	client := &models.Client{
		Conn:   conn,
		Name:   "",
		Room:   nil,
		InGame: false,
	}

	return client
}

// CloseAllClients is used to close connections to all client at once.
func CloseAllClients(s *models.Server) {
	s.Mu.Lock()
	defer s.Mu.Unlock()

	for client := range s.Clients {
		client.Conn.Close()
		delete(s.Clients, client)
	}
}

// Login Client is used to log the client into the server service.
// The username parameter is used to set the client's name.
func LoginClient(s *models.Server, client *models.Client, username string) {
	client.Name = username

	s.WithLock(func(s *models.Server) {
		s.Clients[client] = true
	})

	logger.Info(fmt.Sprintf("New client connected: %v with username : %s", client.Conn.RemoteAddr(), client.Name))
}
