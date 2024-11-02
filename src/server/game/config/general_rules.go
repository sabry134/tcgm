package config

type HandExceedAction struct {
	Name       string         `json:"name"`
	Parameters map[string]int `json:"parameters"`
}

type GeneralRulesConfig struct {
	PlayerCount          []int            `json:"player_count"`
	SharedBoard          bool             `json:"shared_board"`
	StartingHandSize     int              `json:"starting_hand_size"`
	MaximumHandSize      int              `json:"maximum_hand_size"`
	CanExceedMaxHandSize bool             `json:"can_exceed_max_hand_size"`
	WinConditions        []string         `json:"win_conditions"`
	ResponseMode         string           `json:"response_mode"`
	HandExceedAction     HandExceedAction `json:"hand_exceed_action"`
}
