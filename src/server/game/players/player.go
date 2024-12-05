package players

import (
	"server/game/config"
)

type Player struct {
	Username     string
	PlayerValues map[string]interface{}
	//cardContainers map[string]*cards.CardContainer
}

func InitPlayer(username string) *Player {
	player := &Player{
		Username: username,
	}

	for key, value := range config.PlayersConfigVar.Player.Values {
		player.PlayerValues[key] = value
	}

	return player
}
