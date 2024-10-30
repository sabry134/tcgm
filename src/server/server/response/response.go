package response

import (
	"bufio"
	"encoding/json"
	"log"
	"net"
	"server/server/models"
	"strings"
)

const (
	CodeSuccess         = "200"
	CodePrompt          = "300"
	CodeError           = "400"
	CodeForbidden       = "403"
	CodeNotFound        = "404"
	CodeInvalidPassword = "401"
	CodeMessage         = "500"
	CodeInfo            = "501"
)

type ServerMessage struct {
	Command string      `json:"command"`
	Data    interface{} `json:"data"`
}

func GetErrorResponse(code string, reason string) (string, interface{}) {
	message := map[string]interface{}{
		"data": reason, // Should rename to reason when better handled client side
	}

	return code, message
}

func SendResponse(conn net.Conn, command string, data interface{}) {
	response := ServerMessage{
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

func SendPrompt(client *models.Client, prompt string) {
	client.Conn.Write([]byte(CodePrompt + " " + prompt + "\n"))
}

func SendInfo(client *models.Client, info string) {
	client.Conn.Write([]byte(CodeInfo + " " + info + "\n"))
}

func SendMessage(client *models.Client, message string) {
	client.Conn.Write([]byte(CodeMessage + " " + message + "\n"))
}

func ReceiveClientInput(client *models.Client) string {
	reader := bufio.NewReader(client.Conn)

	input, _ := reader.ReadString('\n')
	input = strings.TrimSpace(input)

	return input
}
