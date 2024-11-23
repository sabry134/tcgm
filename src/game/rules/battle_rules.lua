local BattleRules = {}
BattleRules.__index = BattleRules

function BattleRules:new(attackers, taunt_types, blocking, face_attackers, attack_order)
    local battleRules = setmetatable({}, BattleRules)

    battleRules.attackers = attackers or {}
    battleRules.taunt_types = taunt_types or {}
    battleRules.blocking = blocking or false
    battleRules.face_attackers = face_attackers or {}
    battleRules.attack_order = attack_order or "OneByOne"

    return battleRules
end

return BattleRules
