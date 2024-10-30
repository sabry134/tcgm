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
	sendCommand(client, "Login username")

	response := readResponse(client, 1)
	if !strings.Contains(response, "200 Welcome username!") {
		t.Errorf("Expected welcome, got: %s", response)
	}
}
