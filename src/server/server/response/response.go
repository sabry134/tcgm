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

type ClientMessage struct {
	Command string      `json:"command"`
	Data    interface{} `json:"data"`
}

func GetErrorResponse(code string, reason string) (string, interface{}) {
	message := map[string]interface{}{
		"reason": reason, // Should rename to reason when better handled client side
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

func SendInfo(client *models.Client, data interface{}) {
	response := ServerMessage{
		Command: CodeInfo,
		Data:    data,
	}
	jsonMessage, err := json.Marshal(response)
	if err != nil {
		log.Println("Error encoding JSON:", err)
		return
	}
	client.Conn.Write(append(jsonMessage, '\n'))
}

func SendMessage(client *models.Client, data interface{}) {
	response := ServerMessage{
		Command: CodeMessage,
		Data:    data,
	}
	jsonMessage, err := json.Marshal(response)
	if err != nil {
		log.Println("Error encoding JSON:", err)
		return
	}
	client.Conn.Write(append(jsonMessage, '\n'))
}

func ReceiveClientInput(client *models.Client) string {
	reader := bufio.NewReader(client.Conn)

	input, _ := reader.ReadString('\n')
	input = strings.TrimSpace(input)

	return input
}

func CheckForData(msgData interface{}, requiredFields []string) bool {
	data, ok := msgData.(map[string]interface{})
	if !ok {
		log.Println("Error: data is not a valid map")
		return false
	}

	for _, field := range requiredFields {
		_, fieldExists := data[field].(string)
		if !fieldExists {
			log.Printf("Error : Missing  or invalid '%s' field\n", field)
			return false
		}
	}

	return true
}

func GetMsgDataByName(msgData interface{}, fieldName string) string {
	return msgData.(map[string]interface{})[fieldName].(string)
}
