package main_test

import (
	"strings"
	"testing"
)

func TestCreateRoom(t *testing.T) {
	s := startTestServer(t)
	defer func() {
		s.Quit <- struct{}{}
	}()

	client, cleanup := createMockClient(t, "127.0.0.1", "12345")
	defer cleanup()
	sendCommand(client, "Login username")

	sendCommand(client, "Create_room MyRoom SecretPassword")
	response := readResponse(client, 2)

	if !strings.Contains(response, "200 Room 'MyRoom' created and joined.") {
		t.Errorf("Expected room creation success, got: %s", response)
	}

	s.Mu.Lock()
	_, exists := s.Rooms["MyRoom"]
	s.Mu.Unlock()
	if !exists {
		t.Error("Room was not created on the server")
	}
}
