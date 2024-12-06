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

// CommandHandler is the bridge between each command and their corresponding handler.
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

// HandleMessage deserializes the json obejct sent by the client to be interpreted as a command.
func HandleMessage(s *models.Server, c *models.Client, message []byte) {
	var msg response.ClientMessage
	err := json.Unmarshal(message, &msg)
	if err != nil {
		logger.Error(fmt.Sprint("Error decoding JSON ", err))
		return
	}
	HandleCommand(s, c, msg)
}

// HandleCommand send the command data to the corresponding command handler.
func HandleCommand(s *models.Server, c *models.Client, message response.ClientMessage) {
	command := strings.TrimSpace(message.Command)
	logger.Debug(fmt.Sprint("Received command %s", command))

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
