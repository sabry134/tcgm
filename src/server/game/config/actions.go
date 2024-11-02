package config

type Action struct {
	Name               string                 `json:"name"`
	ActionType         string                 `json:"action_type"`
	RequiredParameters map[string]interface{} `json:"required_parameters"`
}

type ActionsConfig struct {
	Actions []Action `json:"actions"`
}
