package main_test

import (
	"bufio"
	"net"
	"strings"
)

func sendCommand(conn net.Conn, command string) {
	_, err := conn.Write([]byte(command + "\n"))
	if err != nil {
		panic("Failed to send command: " + err.Error())
	}
}

func skipResponses(reader *bufio.Reader, response_count int) {
	for i := 0; i < response_count-1; i++ {
		reader.ReadString('\n')
	}
}

func readResponse(conn net.Conn, response_count int) string {
	reader := bufio.NewReader(conn)

	skipResponses(reader, response_count)

	response, err := reader.ReadString('\n')
	if err != nil {
		panic("Failed to read response: " + err.Error())
	}
	return strings.TrimSpace(response)
}
