package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"strings"
	"sync"
)

type Client struct {
	conn net.Conn
	name string
	room *Room
}

type Room struct {
	name     string
	clients  map[*Client]bool
	owner    *Client
	password string
	mu       sync.Mutex
}

type Server struct {
	rooms   map[string]*Room
	clients map[*Client]bool
	mu      sync.Mutex
}

func NewServer() *Server {
	return &Server{rooms: make(map[string]*Room)}
}

func (r *Room) checkAndCloseEmpty(s *Server) {
	if len(r.clients) == 0 {
		r.closeRoom(s)
	}
}

func (s *Server) createRoom(client *Client) string {
	if client.room != nil {
		return "You are already in a room. Leave it first to create a new one."
	}

	reader := bufio.NewReader(client.conn)

	client.conn.Write([]byte("Enter room name to create: \n"))
	roomName, _ := reader.ReadString('\n')
	roomName = strings.TrimSpace(roomName)

	if _, exists := s.rooms[roomName]; exists {
		return "Room name already exists."
	}

	client.conn.Write([]byte("Enter room password to create: \n"))
	roomPassword, _ := reader.ReadString('\n')
	roomPassword = strings.TrimSpace(roomPassword)

	newRoom := &Room{name: roomName, clients: make(map[*Client]bool), password: roomPassword}
	s.rooms[roomName] = newRoom
	client.room = newRoom
	newRoom.clients[client] = true
	newRoom.owner = client
	return fmt.Sprintf("Room '%s' created and joined.", roomName)
}

func (s *Server) viewRoomPassword(client *Client) string {
	if client.room == nil {
		return "You are not in a room."
	}

	if client.room.owner != client {
		return "You must be the room owner to view it's password."
	}

	return fmt.Sprintf("Room password is : '%s'.", client.room.password)
}

func (s *Server) setRoomPassword(client *Client) string {
	if client.room == nil {
		return "You are not in a room."
	}

	if client.room.owner != client {
		return "You must be the room owner to set it's password."
	}

	reader := bufio.NewReader(client.conn)

	client.conn.Write([]byte("Enter new room password: \n"))
	newPassword, _ := reader.ReadString('\n')
	newPassword = strings.TrimSpace(newPassword)

	client.room.password = newPassword
	return fmt.Sprintf("Changed room password.")
}

func (r *Room) closeRoom(s *Server) {
	for client := range r.clients {
		client.room = nil
		client.conn.Write([]byte("Room has been closed by owner\n"))
		delete(r.clients, client)
	}
	delete(s.rooms, r.name)
}

func (s *Server) joinRoom(client *Client) string {
	if client.room != nil {
		return "You are already in a room. Leave it first to join another."
	}

	reader := bufio.NewReader(client.conn)

	client.conn.Write([]byte("Enter room name to join: \n"))
	roomName, _ := reader.ReadString('\n')
	roomName = strings.TrimSpace(roomName)

	room, exists := s.rooms[roomName]
	if !exists {
		return "Room does not exist."
	}

	if room.password != "" {
		client.conn.Write([]byte("Enter room password: \n"))
		password, _ := reader.ReadString('\n')
		if strings.TrimSpace(password) != room.password {
			return "Incorrect password."
		}
	}

	client.room = room
	room.clients[client] = true
	return fmt.Sprintf("Joined room '%s'.", roomName)
}

func (s *Server) leaveRoom(client *Client) string {
	if client.room == nil {
		return "You are not in any room."
	}
	delete(client.room.clients, client)
	leftRoom := client.room.name
	client.room = nil
	return fmt.Sprintf("You have left the room '%s'.", leftRoom)
}

func (r *Room) kickUser(s *Server, clientToKick *Client) {
	if _, exists := r.clients[clientToKick]; exists {
		clientToKick.room = nil
		clientToKick.conn.Write([]byte("You have been kicked from the room.\n"))
		delete(r.clients, clientToKick)
	}
}

func (s *Server) listRooms() string {
	if len(s.rooms) == 0 {
		return "No rooms available."
	}
	roomsList := "Available rooms:\n"
	for name := range s.rooms {
		requires_password := ""
		if s.rooms[name].password != "" {
			requires_password = " requires password"
		}
		roomsList += name + requires_password + "\n"
	}
	return roomsList
}

func (s *Server) listUsers(client *Client) string {
	if client.room == nil {
		return "You are not in a room."
	}
	usersList := "Users in room '" + client.room.name + "':\n"
	for c := range client.room.clients {
		owner := ""
		if c == client.room.owner {
			owner = " (owner)"
		}
		usersList += c.name + owner + "\n"
	}
	usersList = usersList[:len(usersList)-1]
	return usersList
}

func (s *Server) broadcastMessage(client *Client) string {
	if client.room == nil {
		return "You are not in a room."
	}

	reader := bufio.NewReader(client.conn)

	client.conn.Write([]byte("Enter message to send: \n"))
	message, _ := reader.ReadString('\n')

	for c := range client.room.clients {
		if c != client {
			fmt.Println("Sending message " + message + " from client: " + client.name + " to " + c.name)
			c.conn.Write([]byte(client.name + ": " + message + "\n"))
		}
	}
	return "Message sent to room."
}

func (s *Server) sendPrivateMessage(client *Client) string {
	if client.room == nil {
		return "You are not in a room."
	}

	reader := bufio.NewReader(client.conn)

	client.conn.Write([]byte("Enter username of user to send message to: \n"))
	name, _ := reader.ReadString('\n')
	name = name[:len(name)-1]

	for c := range client.room.clients {
		if c != client && c.name == name {
			client.conn.Write([]byte("Enter message to send to user: \n"))

			message, _ := reader.ReadString('\n')
			message = message[:len(message)-1]
			fmt.Println("Sending private message " + message + " from client: " + client.name + " to " + c.name)
			c.conn.Write([]byte(client.name + ": " + message + "\n"))
			return "Message successfully sent."
		}
	}
	return "No such user in this room."
}

func (s *Server) kickUserFromRoom(client *Client) string {
	if client.room == nil {
		return "You are not in a room."
	}
	if client != client.room.owner {
		return "Only the owner can kick users from the room."
	}

	reader := bufio.NewReader(client.conn)

	client.conn.Write([]byte("Enter username of user to be kicked: \n"))
	name, _ := reader.ReadString('\n')
	name = name[:len(name)-1]

	for c := range client.room.clients {
		if c.name == name {
			client.room.kickUser(s, c)
			return fmt.Sprintf("%s has been kicked from the room.", name)
		}
	}
	return "User not found in the room."
}

func (s *Server) appointNewOwner(client *Client) string {
	if client.room == nil {
		return "You are not in a room."
	}
	if client != client.room.owner {
		return "Only the owner can appoint a new owner."
	}

	reader := bufio.NewReader(client.conn)

	client.conn.Write([]byte("Enter username of user to be made room owner: \n"))
	name, _ := reader.ReadString('\n')
	name = name[:len(name)-1]

	for c := range client.room.clients {
		if c.name == name {
			client.room.owner = c
			return fmt.Sprintf("%s is now the owner of the room.", name)
		}
	}
	return "User not found in the room."
}

func (s *Server) closeRoomCommand(client *Client) string {
	if client.room == nil {
		return "You are not in a room."
	}
	if client != client.room.owner {
		return "Only the owner can close the room."
	}
	roomName := client.room.name
	client.room.closeRoom(s)
	return fmt.Sprintf("Room '%s' has been closed.", roomName)
}

func (s *Server) handleClient(client *Client) {
	defer client.conn.Close()
	reader := bufio.NewReader(client.conn)

	for {
		command, err := reader.ReadString('\n')
		if err != nil {
			break
		}
		command = strings.TrimSpace(command)
		var response string

		switch command {
		case "C":
			response = s.createRoom(client)
		case "J":
			response = s.joinRoom(client)
		case "E":
			response = s.leaveRoom(client)
		case "Q":
			response = "Goodbye!"
			s.disconnectClient(client)
			return
		case "L":
			response = s.listRooms()
		case "U":
			response = s.listUsers(client)
		case "M":
			response = s.broadcastMessage(client)
		case "P":
			response = s.sendPrivateMessage(client)
		case "K":
			response = s.kickUserFromRoom(client)
		case "O":
			response = s.appointNewOwner(client)
		case "X":
			response = s.closeRoomCommand(client)
		case "S":
			response = s.setRoomPassword(client)
		case "V":
			response = s.viewRoomPassword(client)
		default:
			response = "Unknown command"
		}

		client.conn.Write([]byte(response + "\n"))
	}
}

func (s *Server) disconnectClient(client *Client) {
	if client.room != nil {
		s.leaveRoom(client)
	}
	delete(s.clients, client)
	client.conn.Close()
}

func (s *Server) start() {
	listener, err := net.Listen("tcp", ":12345")
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
	defer listener.Close()

	fmt.Println("Server started on port 12345")

	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Printf("Failed to accept connection: %v", err)
			continue
		}

		client := &Client{
			conn: conn,
			name: "",
			room: nil,
		}

		reader := bufio.NewReader(client.conn)

		client.conn.Write([]byte("Enter your username: \n"))
		username, _ := reader.ReadString('\n')
		username = strings.TrimSpace(username)

		client.name = username

		s.clients[client] = true

		fmt.Printf("New client connected: %v with username : %s\n", conn.RemoteAddr(), client.name)
		client.conn.Write([]byte("Welcome " + client.name + "!\n"))

		go s.handleClient(client)
	}
}

func main() {
	server := &Server{
		rooms:   make(map[string]*Room),
		clients: make(map[*Client]bool),
	}
	server.start()
}
