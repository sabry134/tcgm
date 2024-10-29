package room

import (
	"fmt"
	"server/server/models"
	"server/server/response"
)

func CreateRoom(s *models.Server, client *models.Client, roomName string, roomPassword string) {
	newRoom := &models.Room{Name: roomName, Clients: make(map[*models.Client]bool), Password: roomPassword}
	s.Rooms[roomName] = newRoom
	client.Room = newRoom
	newRoom.Clients[client] = true
	newRoom.Owner = client
}

func CloseRoom(r *models.Room, s *models.Server) {
	for client := range r.Clients {
		client.Room = nil
		client.Conn.Write([]byte("Room has been closed by owner\n"))
		delete(r.Clients, client)
	}
	delete(s.Rooms, r.Name)
}

func JoinRoom(r *models.Room, client *models.Client) {
	client.Room = r
	r.Clients[client] = true
}

func LeaveRoom(r *models.Room, client *models.Client) {
	delete(client.Room.Clients, client)
	client.Room = nil
}

func KickUser(r *models.Room, s *models.Server, name string) bool {
	for c := range r.Clients {
		if c.Name == name+"\n" {
			c.Room = nil
			response.SendInfo(c, "You have been kicked from the room.")
			delete(r.Clients, c)
			return true
		}
	}
	return false
}

func ListUsersAsString(r *models.Room) string {
	usersList := "Users in room '" + r.Name + "': "
	for c := range r.Clients {
		owner := ""
		if c == r.Owner {
			owner = " (owner)"
		}
		usersList += c.Name + owner + ", "
	}
	usersList = usersList[:len(usersList)-2]
	return usersList
}

func BroadcastMessage(r *models.Room, client *models.Client, message string) {
	for c := range client.Room.Clients {
		if c != client {
			fmt.Println("Sending message " + message + " from client: " + client.Name + " to " + c.Name)
			response.SendMessage(c, client.Name+": "+message)
		}
	}
}

func SendPrivateMessage(r *models.Room, client *models.Client, name string) bool {
	for c := range r.Clients {
		if c != client && c.Name == name+"\n" {
			response.SendPrompt(client, "Enter message to send to user: ")

			message := response.ReceiveClientInput(client)
			message = message[:len(message)-1]
			fmt.Println("Sending private message " + message + " from client: " + client.Name + " to " + c.Name)
			response.SendMessage(c, client.Name+": "+message)
			return true
		}
	}
	return false
}

func AppointNewOwner(r *models.Room, name string) bool {
	for c := range r.Clients {
		if c.Name == name+"\n" {
			r.Owner = c
			return true
		}
	}
	return false
}
