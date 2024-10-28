
local Effect = {}
Effect.__index = Effect

local ActionManager = require("actions.action_manager")

function Effect:new(name, requirements, actions, action_resolution_order, speed, description, turn_usage_limit, game_usage_limit, turn_activation_limit, game_activation_limit)
    local effect = setmetatable({}, Effect)

    effect.name = name
    effect.requirements = requirements or {}
    effect.actions = actions or {}
    effect.action_resolution_order = action_resolution_order or "simultaneous"
    effect.speed = speed
    effect.description = description
    effect.turn_usage_limit = turn_usage_limit or { type = "unlimited", value = - 1 }
    effect.game_usage_limit = game_usage_limit or { type = "unlimited", value = - 1 }
    effect.turn_activation_limit = turn_activation_limit or { type = "unlimited", value = - 1 }
    effect.game_activation_limit = game_activation_limit or { type = "unlimited", value = - 1 }
    effect.turn_usage_count = 0
    effect.game_usage_count = 0
    effect.turn_activation_count = 0
    effect.game_activation_count = 0
    return effect
end

function Effect:printEffect()
    print("    Effect Name: " .. self.name)

    print("    Requirement:")
    for _, requirement in ipairs(self.requirements) do
        print("      * Requirement Name: " .. requirement.name)
        print("      * Requirement parameters:")
        for key, value in pairs(requirement.parameters) do
            print("        * " .. key .. ": " .. tostring(value))
        end
    end

    print("    Actions:")
    for _, action in ipairs(self.actions) do
        print("      * Action Name: " .. action.name)
        print("      * Action parameters:")
        for key, value in pairs(action.parameters) do
            print("        * " .. key .. ": " .. tostring(value))
        end
    end

    print("    Speed: " .. self.speed)
    print("    Description: " .. (self.description or "N/A"))
    print("    Turn usage Limit: " .. (self.turn_usage_limit or "N/A"))
    print("    Game usage Limit: " .. (self.game_usage_limit or "N/A"))
end

function Effect:requirementsMet(game_state)
    for _, requirement in ipairs(self.requirements) do
        local requirementFunc = ActionManager[requirement.name]
        if requirementFunc and not requirement(requirement.parameters, game_state) then
            return false
        end
    end
    return true
end

function Effect:executeActions(game_state)
    for _, action in ipairs(self.actions) do
        local actionFunc = ActionManager[action.name]
        if actionFunc then
            local success = actionFunc(action.parameters, game_state)
            if not success and self.action_resolution_order == "sequential" then
                print("Action failed, stopping sequence.")
                return false
            end
        else
            print("Action not found:", action.name)
            return false
        end
    end
    return true
end

local function checkActivationAndUsage(effect)
    if effect.turn_usage_limit.type ~= "unlimited" and effect.turn_usage.count >= effect.turn_usage_limit then
        print("Turn usage limit reached for effect:", effect.name)
        return false
    end
    if effect.game_usage_limit.type ~= "unlimited" and effect.game_usage.count >= effect.game_usage_limit then
        print("Turn usage limit reached for effect:", effect.name)
        return false
    end
    if effect.turn_activation_limit.type ~= "unlimited" and effect.turn_usage.count >= effect.turn_usage_limit then
        print("Turn usage limit reached for effect:", effect.name)
        return false
    end
    if effect.game_activation_limit.type ~= "unlimited" and effect.game_usage.count >= effect.game_usage_limit then
        print("Turn usage limit reached for effect:", effect.name)
        return false
    end
    return true
end

function Effect:activate(game_state)
    if not checkActivationAndUsage(self) then
        return false
    end

    if self:requirementsMet(game_state) then
        self.turn_activation_count = self.turn_activation_count + 1
        self.game_activation_count = self.game_activation_count + 1
        local success = self:executeActions(game_state)
        if success then
            self.turn_usage_count = self.turn_usage_count + 1
            self.game_usage_count = self.game_usage_count + 1
            return true
        end
    else
        print("Requirements not met for effect:", self.name)
    end
    return false
end

return Effect
