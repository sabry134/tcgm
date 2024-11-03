package handler

import (
	"bufio"
	"encoding/json"
	"fmt"
	"server/logger"
	"server/server/client"
	"server/server/commands"
	"server/server/models"
	"server/server/response"
	"strings"
)

type CommandHandler func(*models.Server, *models.Client, interface{}) (string, interface{})

var commandHandlers = map[string]CommandHandler{
	"Login":                commands.LogInCommand,
	"CreateRoom":           commands.CreateRoomCommand,
	"JoinRoom":             commands.JoinRoomCommand,
	"LeaveRoom":            commands.LeaveRoomCommand,
	"ListRooms":            commands.ListRoomsCommand,
	"ListUsersInRoom":      commands.ListUsersCommand,
	"MessageToRoom":        commands.BroadcastMessageCommand,
	"PrivateMessageToUser": commands.SendPrivateMessageCommand,
	"KickUserFromRoom":     commands.KickUserFromRoomCommand,
	"AppointNewRoomOwner":  commands.AppointNewOwnerCommand,
	"CloseRoom":            commands.CloseRoomCommand,
	"SetRoomPassword":      commands.SetRoomPasswordCommand,
	"ViewRoomPassword":     commands.ViewRoomPasswordCommand,
	"CreateGame":           commands.CreateGameCommand,
	"JoinGame":             commands.JoinGameCommand,
	"LeaveGame":            commands.LeaveGameCommand,
	"ListGames":            commands.ListGamesCommand,
	// Other commands can be added as needed
}

func HandleMessage(s *models.Server, c *models.Client, message []byte) {
	var msg response.ClientMessage
	err := json.Unmarshal(message, &msg)
	if err != nil {
		logger.Error(fmt.Sprint("Error decoding JSON ", err))
		return
	}
	HandleCommand(s, c, msg)
}

func parseCommand(input string) (string, []string) {
	parts := strings.Fields(input)
	if len(parts) == 0 {
		return "", nil
	}
	command := parts[0]
	params := parts[1:]

	return command, params
}

func HandleCommand(s *models.Server, c *models.Client, message response.ClientMessage) {
	command := strings.TrimSpace(message.Command)

	if command != "Login" && c.Name == "" {
		code, data := response.GetErrorResponse(response.CodeError, "Must be logged in to send commands\n")
		response.SendResponse(c.Conn, code, data)
		return
	}

	if command == "Disconnect" {
		client.DisconnectClient(s, c)
	}

	if handler, exists := commandHandlers[command]; exists {
		responseCode, responseData := handler(s, c, message.Data)
		if responseData != "" {
			response.SendResponse(c.Conn, responseCode, responseData)
		}
	} else {
		responseCode, responseData := response.GetErrorResponse(response.CodeError, "Unknown command")
		response.SendResponse(c.Conn, responseCode, responseData)
	}
}

func HandleClient(s *models.Server, client *models.Client) {
	defer client.Conn.Close()
	reader := bufio.NewReader(client.Conn)

	for {
		message, err := reader.ReadBytes('\n')
		if err != nil {
			break
		}

		HandleMessage(s, client, message)
	}
}
