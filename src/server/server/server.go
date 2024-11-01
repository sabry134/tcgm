package server

import (
	"fmt"
	"log"
	"net"
	"server/logger"
	"server/server/client"
	"server/server/handler"
	"server/server/models"
)

func Start(s *models.Server) {
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", s.Port))
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
	s.Listener = listener

	logger.Info(fmt.Sprintf("Server started on port %d", s.Port))

	go func() {
		<-s.Quit
		logger.Info("Shutting down server")
		s.Listener.Close()        // Close the listener
		client.CloseAllClients(s) // Close all active client connections
	}()

	for {
		conn, err := listener.Accept()
		if err != nil {
			if opErr, ok := err.(*net.OpError); ok && opErr.Op == "accept" {
				break
			}
			logger.Error(fmt.Sprintf("Failed to accept connection: %v", err))
			continue
		}

		go func() {
			c := client.CreateClient(s, conn)
			handler.HandleClient(s, c)
		}()
	}
}

func Close(s *models.Server) error {
	close(s.Quit)          // Signal the server to stop
	if s.Listener != nil { // Close the listener
		s.Listener.Close()
	}
	client.CloseAllClients(s) // Disconnect all clients
	return nil
}
