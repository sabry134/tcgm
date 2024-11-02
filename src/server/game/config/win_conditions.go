package config

type WinCondition struct {
	Name         string        `json:"name"`
	Requirements []Requirement `json:"requirements"`
}

type WinConditionsConfig struct {
	WinConditions []WinCondition `json:"win_conditions"`
}
