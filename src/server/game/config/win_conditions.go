package config

type WinCondition struct {
	Name         string        `json:"name"`
	Requirements []Requirement `json:"requirements"`
}

type WinConditionsConfig struct {
	WinConditions []WinCondition `json:"win_conditions"`
}

var (
	winConditionsConfig sync.Once
	WinConditionsConfigVar WinConditionsConfig
)

// GetWinConditionsConfig allows to get the game configuration linked to win conditions globally.
func GetWinConditionsConfig() WinConditionsConfig {
	return WinConditionsConfigVar
}
