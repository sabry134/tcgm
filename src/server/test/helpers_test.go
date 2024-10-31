package main_test

import (
	"bufio"
	"encoding/json"
	"log"
	"net"
	"server/server/response"
)

func sendCommand(conn net.Conn, command string, data interface{}) {
	response := response.ServerMessage{
		Command: command,
		Data:    data,
	}
	jsonMessage, err := json.Marshal(response)
	if err != nil {
		log.Println("Error encoding JSON:", err)
		return
	}
	conn.Write(append(jsonMessage, '\n'))
}

/*func sendCommand(conn net.Conn, command interface{}) {
	_, err := conn.Write([]byte(command + "\n"))
	if err != nil {
		panic("Failed to send command: " + err.Error())
	}
}*/

func skipResponses(reader *bufio.Reader, response_count int) {
	for i := 0; i < response_count-1; i++ {
		reader.ReadString('\n')
	}
}

func readResponse(conn net.Conn, response_count int) response.ClientMessage {
	reader := bufio.NewReader(conn)

	skipResponses(reader, response_count)

	message, err := reader.ReadBytes('\n')
	if err != nil {
		panic("Failed to read response: " + err.Error())
	}
	var msg response.ClientMessage
	err = json.Unmarshal(message, &msg)
	if err != nil {
		panic("Error decoding JSON" + err.Error())
	}
	return msg
}
