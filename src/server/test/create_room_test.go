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

	clientLogin(client, "username")
	clientCreateRoom(client, "MyRoom", "SecretPassword")

	response := readResponse(client, 2)
	command := response.Command
	msgData := response.Data.(map[string]interface{})
	if !strings.Contains(command, "200") || !strings.Contains(msgData["message"].(string), "Room 'MyRoom' created and joined.") {
		t.Errorf("Expected room creation success, got: %s", response)
	}

	s.Mu.Lock()
	_, exists := s.Rooms["MyRoom"]
	s.Mu.Unlock()
	if !exists {
		t.Error("Room was not created on the server")
	}
}
