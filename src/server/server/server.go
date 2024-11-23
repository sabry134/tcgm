package server

import (
	"fmt"
	"log"
	"net"
	"server/server/client"
	"server/server/models"
)

func Start(s *models.Server) {
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", s.Port))
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
	defer listener.Close()

	fmt.Println("Server started on port 12345")

	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Printf("Failed to accept connection: %v", err)
			continue
		}

		c := client.CreateClient(s, conn)
		client.LoginClient(s, c)
	}
}
