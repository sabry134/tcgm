package room

import (
	"fmt"
	"server/server/models"
	"server/server/response"
)

func CreateRoom(s *models.Server, client *models.Client, roomName string, roomPassword string) {
	newRoom := &models.Room{Name: roomName, Clients: make(map[*models.Client]bool), Password: roomPassword}

	s.WithLock(func(s *models.Server) {
		s.Rooms[roomName] = newRoom
	})

	client.Room = newRoom

	newRoom.WithLock(func(r *models.Room) {
		newRoom.Clients[client] = true
		newRoom.Owner = client
	})
}

func CloseRoom(r *models.Room, s *models.Server) {
	for client := range r.Clients {
		client.Room = nil
		response.SendInfo(client, "Room has been closed by owner")
		r.WithLock(func(r *models.Room) {
			delete(r.Clients, client)
		})
	}

	s.WithLock(func(s *models.Server) {
		delete(s.Rooms, r.Name)
	})
}

func JoinRoom(r *models.Room, client *models.Client) {
	client.Room = r
	r.WithLock(func(r *models.Room) {
		delete(r.Clients, client)
	})
}

func LeaveRoom(r *models.Room, client *models.Client, s *models.Server) {
	delete(client.Room.Clients, client)
	room := client.Room
	client.Room = nil
	if room.Owner == client || len(room.Clients) == 0 {
		CloseRoom(room, s)
	}
}

func KickUser(r *models.Room, s *models.Server, name string) bool {
	for c := range r.Clients {
		if c.Name == name {
			c.Room = nil
			response.SendInfo(c, "You have been kicked from the room.")
			r.WithLock(func(r *models.Room) {
				delete(r.Clients, c)
			})
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

func SendPrivateMessage(r *models.Room, client *models.Client, name string, message string) bool {
	for c := range r.Clients {
		if c != client && c.Name == name {
			response.SendPrompt(client, "Enter message to send to user: ")

			m := message[:len(message)-1]
			fmt.Println("Sending private message " + m + " from client: " + client.Name + " to " + c.Name)
			response.SendMessage(c, client.Name+": "+m)
			return true
		}
	}
	return false
}

func AppointNewOwner(r *models.Room, name string) bool {
	for c := range r.Clients {
		if c.Name == name {
			r.WithLock(func(r *models.Room) {
				r.Owner = c
			})
			return true
		}
	}
	return false
}
