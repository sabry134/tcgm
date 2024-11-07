package config

import "sync"

type HandExceedAction struct {
	Name       string                 `json:"name"`
	Parameters map[string]interface{} `json:"parameters"`
}

type GeneralRules struct {
	PlayerCount          []int            `json:"player_count"`
	SharedBoard          bool             `json:"shared_board"`
	StartingHandSize     int              `json:"starting_hand_size"`
	MaximumHandSize      int              `json:"maximum_hand_size"`
	CanExceedMaxHandSize bool             `json:"can_exceed_max_hand_size"`
	WinConditions        []string         `json:"win_conditions"`
	ResponseMode         string           `json:"response_mode"`
	HandExceedAction     HandExceedAction `json:"hand_exceed_action"`
}

type GeneralRulesConfig struct {
	GeneralRules GeneralRules `json:"general_rules"`
}

var (
	generalRulesConfig    sync.Once
	GeneralRulesConfigVar GeneralRulesConfig
)

// GetGeneralRulesConfig allows to get the game configuration linked to the general rules globally.
func GetGeneralRulesConfig() GeneralRulesConfig {
	return GeneralRulesConfigVar
}
