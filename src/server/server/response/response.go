package response

import (
	"bufio"
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

func SendResponse(client *models.Client, response string) {
	client.Conn.Write([]byte(response + "\n"))
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
