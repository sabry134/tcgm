package models

import (
	"net"
	"sync"
)

type Client struct {
	Conn net.Conn
	Name string
	Room *Room
}

type Room struct {
	Name     string
	Clients  map[*Client]bool
	Owner    *Client
	Password string
	Mu       sync.Mutex
}

type Server struct {
	Rooms   map[string]*Room
	Clients map[*Client]bool
	Port    int
	Mu      sync.Mutex
}
