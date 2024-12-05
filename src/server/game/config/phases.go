package config

import "sync"

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

var (
	phasesConfig    sync.Once
	PhasesConfigVar PhasesConfig
)

// GetPhasesConfig allows to get the game configuration linked to phases globally.
func GetPhasesConfig() PhasesConfig {
	return PhasesConfigVar
}
