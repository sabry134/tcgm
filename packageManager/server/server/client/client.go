package client

import (
	"bufio"
	"fmt"
	"net"
	"server/server/handler"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

func DisconnectClient(s *models.Server, client *models.Client) {
	if client.Room != nil {
		room.LeaveRoom(client.Room, client, s)
	}
	delete(s.Clients, client)
	client.Conn.Close()
}

func HandleClient(s *models.Server, client *models.Client) {
	defer client.Conn.Close()
	reader := bufio.NewReader(client.Conn)

	for {
		command, err := reader.ReadString('\n')
		if err != nil {
			break
		}

		handler.HandleCommand(s, client, command)
	}
}

func LoginClient(s *models.Server, client *models.Client) {
	response.SendPrompt(client, "Enter your username: ")
	username := response.ReceiveClientInput(client)

	client.Name = username

	s.Clients[client] = true

	fmt.Printf("New client connected: %v with username : %s\n", client.Conn.RemoteAddr(), client.Name)
	client.Conn.Write([]byte(response.CodeSuccess + " Welcome " + client.Name + "!\n"))

	go HandleClient(s, client)
}

func CreateClient(s *models.Server, conn net.Conn) *models.Client {
	client := &models.Client{
		Conn: conn,
		Name: "",
		Room: nil,
	}

	return client
}
