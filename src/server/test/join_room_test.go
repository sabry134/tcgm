package main_test

import (
	"strings"
	"testing"
)

func TestJoinRoom(t *testing.T) {
	s := startTestServer(t)
	defer func() {
		s.Quit <- struct{}{}
	}()

	creator, cleanupCreator := createMockClient(t, "127.0.0.1", "12345")
	defer cleanupCreator()
	sendCommand(creator, "Login username")
	sendCommand(creator, "Create_room MyRoom SecretPassword")

	client, cleanupClient := createMockClient(t, "127.0.0.1", "12345")
	defer cleanupClient()
	sendCommand(client, "Login username2")
	sendCommand(client, "Join_room MyRoom SecretPassword")

	response := readResponse(client, 2)
	if !strings.Contains(response, "200 Joined room 'MyRoom'.") {
		t.Errorf("Expected join room success, got: %s", response)
	}
}
