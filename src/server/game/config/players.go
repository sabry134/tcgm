package config

type Player struct {
	Values map[string]interface{} `json:"values"`
}

type PlayersConfig struct {
	Player Player `json:"player"`
}

var (
	playersConfig sync.Once
	PlayersConfigVar PlayersConfig
)

// GetPlayersConfig allows to get the game configuration linked to players globally.
func GetPlayersConfig() PlayersConfig {
	return PlayersConfigVar
}
