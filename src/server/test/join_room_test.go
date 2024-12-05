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
	clientLogin(creator, "username")
	clientCreateRoom(creator, "MyRoom", "SecretPassword")

	client, cleanupClient := createMockClient(t, "127.0.0.1", "12345")
	defer cleanupClient()
	clientLogin(client, "username2")
	clientJoinRoom(client, "MyRoom", "SecretPassword")

	response := readResponse(client, 2)
	command := response.Command
	msgData := response.Data.(map[string]interface{})
	if !strings.Contains(command, "200") || !strings.Contains(msgData["message"].(string), "Joined room 'MyRoom'.") {
		t.Errorf("Expected join room success, got: %s", response)
	}
}
