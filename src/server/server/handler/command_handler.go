package handler

import (
	"bufio"
	"server/server/client"
	"server/server/commands"
	"server/server/models"
	"server/server/response"
	"strings"
)

type CommandHandler func(*models.Server, *models.Client, []string) (string, interface{})

var commandHandlers = map[string]CommandHandler{
	"Login":                   commands.LogInCommand,
	"Create_room":             commands.CreateRoomCommand,
	"Join_room":               commands.JoinRoomCommand,
	"Leave_room":              commands.LeaveRoomCommand,
	"List_rooms":              commands.ListRoomsCommand,
	"List_users_in_room":      commands.ListUsersCommand,
	"Message_to_room":         commands.BroadcastMessageCommand,
	"Private_message_to_user": commands.SendPrivateMessageCommand,
	"Kick_user_from_room":     commands.KickUserFromRoomCommand,
	"Appoint_new_room_owner":  commands.AppointNewOwnerCommand,
	"Close_room":              commands.CloseRoomCommand,
	"Set_room_password":       commands.SetRoomPasswordCommand,
	"View_room_password":      commands.ViewRoomPasswordCommand,
	// Other commands can be added as needed
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

func HandleCommand(s *models.Server, c *models.Client, command string, params []string) {
	command = strings.TrimSpace(command)

	if command != "Login" && c.Name == "" {
		c.Conn.Write([]byte(response.CodeForbidden + " Must be logged in to send commands\n"))
		return
	}

	if command == "Disconnect" {
		client.DisconnectClient(s, c)
	}

	if handler, exists := commandHandlers[command]; exists {
		responseCode, responseData := handler(s, c, params)
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
		fullCommand, err := reader.ReadString('\n')
		if err != nil {
			break
		}

		command, params := parseCommand(fullCommand)

		HandleCommand(s, client, command, params)
	}
}
