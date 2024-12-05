package main_test

import (
	"net"
	"server/server"
	"server/server/models"
	"testing"
	"time"
)

func startTestServer(t *testing.T) *models.Server {
	s := &models.Server{
		Rooms:   make(map[string]*models.Room),
		Clients: make(map[*models.Client]bool),
		Port:    12345,
		Quit:    make(chan struct{}),
	}
	go server.Start(s)
	time.Sleep(100 * time.Millisecond)
	return s
}

func createMockClient(t *testing.T, address string, port string) (net.Conn, func()) {
	//conn, err := net.Dial("tcp", address+":"+port)
	conn, err := net.Dial("tcp", "127.0.0.1:12345")
	if err != nil {
		t.Fatalf("Failed to connect to server: %v", err)
	}

	cleanup := func() {
		conn.Close()
	}

	return conn, cleanup
}
