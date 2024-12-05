package response

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
	"server/logger"
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

// GetErrorResponse returns a json response containing the proper code and message.
func GetErrorResponse(code string, reason string) (string, interface{}) {
	message := map[string]interface{}{
		"reason": reason, // Should rename to reason when better handled client side
	}

	return code, message
}

// SendResponse sends a json response to a target connection.
func SendResponse(conn net.Conn, command string, data interface{}) {
	response := ServerMessage{
		Command: command,
		Data:    data,
	}
	jsonMessage, err := json.Marshal(response)
	if err != nil {
		logger.Error(fmt.Sprint("Error encoding JSON ", err))
		return
	}
	conn.Write(append(jsonMessage, '\n'))
}

// SendInfo sends a json response to a target connection with code Info.
func SendInfo(client *models.Client, data interface{}) {
	response := ServerMessage{
		Command: CodeInfo,
		Data:    data,
	}
	jsonMessage, err := json.Marshal(response)
	if err != nil {
		logger.Error(fmt.Sprint("Error encoding JSON ", err))
		return
	}
	client.Conn.Write(append(jsonMessage, '\n'))
}

// SendMessage sends a json response to a target connection with code Message.
func SendMessage(client *models.Client, data interface{}) {
	response := ServerMessage{
		Command: CodeMessage,
		Data:    data,
	}
	jsonMessage, err := json.Marshal(response)
	if err != nil {
		logger.Error(fmt.Sprint("Error encoding JSON ", err))
		return
	}
	client.Conn.Write(append(jsonMessage, '\n'))
}

// ReceiveClientInput is used to receive requests from clients.
func ReceiveClientInput(client *models.Client) string {
	reader := bufio.NewReader(client.Conn)

	input, _ := reader.ReadString('\n')
	input = strings.TrimSpace(input)

	return input
}

// CheckForData checks if all required fields are present within a data object.
func CheckForData(msgData interface{}, requiredFields []string) bool {
	data, ok := msgData.(map[string]interface{})
	if !ok {
		logger.Error("Error: data is not a valid map")
		return false
	}

	for _, field := range requiredFields {
		_, fieldExists := data[field].(string)
		if !fieldExists {
			logger.Error(fmt.Sprintf("Error : Missing  or invalid '%s' field", field))
			return false
		}
	}

	return true
}

// GetMsgDataByName gets the value of a field within json data based on the key.
func GetMsgDataByName(msgData interface{}, fieldName string) string {
	return msgData.(map[string]interface{})[fieldName].(string)
}
