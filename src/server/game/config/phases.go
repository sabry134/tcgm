package config

type Phase struct {
	Name                string   `json:"name"`
	StartActions        []string `json:"start_actions"`
	EndActions          []string `json:"end_actions"`
	AllowedActionTypes  []string `json:"allowed_action_types"`
	AllowedEffectSpeeds []string `json:"allowed_effect_speeds"`
}

type PhasesConfig struct {
	Phases []Phase `json:"phases"`
}
