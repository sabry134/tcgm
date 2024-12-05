package main_test

import (
	"strings"
	"testing"
)

func TestClientLogin(t *testing.T) {
	s := startTestServer(t)
	defer func() {
		s.Quit <- struct{}{}
	}()

	client, cleanupCreator := createMockClient(t, "127.0.0.1", "12345")
	defer cleanupCreator()

	clientLogin(client, "username")

	response := readResponse(client, 1)
	command := response.Command
	msgData := response.Data.(map[string]interface{})
	if !strings.Contains(command, "200") || !strings.Contains(msgData["message"].(string), "Welcome username!") {
		t.Errorf("Expected welcome, got: %s", response)
	}
}
