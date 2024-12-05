package config

import "sync"

type BattleRules struct {
	Attackers     []string `json:"attackers"`
	TauntTypes    []string `json:"taunt_types"`
	Blocking      bool     `json:"blocking"`
	FaceAttackers []string `json:"face_attackers"`
	AttackOrder   string   `json:"attack_order"`
}

type BattleRulesConfig struct {
	BattleRules BattleRules `json:"battle_rules"`
}

var (
	battleRulesConfig    sync.Once
	BattleRulesConfigVar BattleRulesConfig
)

// GetBattleRulesConfig allows to get the game configuration linked to battle rules globally.
func GetBattleRulesConfig() BattleRulesConfig {
	return BattleRulesConfigVar
}
