package config

import "sync"

type Action struct {
	Name               string                 `json:"name"`
	ActionType         string                 `json:"action_type"`
	RequiredParameters map[string]interface{} `json:"required_parameters"`
}

type ActionsConfig struct {
	Actions []Action `json:"actions"`
}

var (
	actionsConfig    sync.Once
	ActionsConfigVar ActionsConfig
)

// GetActionsConfig allows to get the game configuration linked to actions globally.
func GetActionsConfig() ActionsConfig {
	return ActionsConfigVar
}
