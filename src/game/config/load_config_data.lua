
local ConfigLoader = {}

local json = require("libs.dkjson.dkjson")
local Card = require("cards.card")
local Effect = require("effects.effect")
local Action = require("actions.action")
local BattleRules = require("rules.battle_rules")
local Board = require("boards.board")
local CardType = require("cards.card_type")
local DeckType = require("decks.deck_types")
local Phase = require("phases.phases")
local Player = require("player.player")
local GeneralRules = require("rules.general_rules")
local WinCondition = require("rules.win_conditions")

local function loadJsonFile(filename)
    local file = io.open(filename, "r")
    if not file then
        error("Could not open file " .. filename)
    end
    local content = file:read("*a")
    file:close()
    return json.decode(content)
end

ConfigLoader.__index = ConfigLoader

function ConfigLoader:new()
    local loader = setmetatable({}, ConfigLoader)

    loader.cards = {}
    loader.actions = {}
    loader.battleRules = nil
    loader.boards = {}
    loader.cardTypes = {}
    loader.deckTypes = {}
    loader.phases = {}
    loader.player = nil
    loader.generalRules = nil
    loader.winConditions = {}

    return loader
end

function ConfigLoader:loadCards(filename)
    local cardConfigs = loadJsonFile(filename)
    for _, cardData in ipairs(cardConfigs.cards) do
        local effects = {}
        for _, effectData in ipairs(cardData.effects) do
            local effect = Effect:new(
                effectData.name,
                effectData.requirements,
                effectData.actions,
                effectData.action_resolution_order,
                effectData.speed,
                effectData.description,
                effectData.turn_usage_limit,
                effectData.game_usage_limit,
                effectData.turn_activation_limit,
                effectData.game_activation_limit
            )
            table.insert(effects, effect)
        end
        local card = Card:new(
            cardData.name,
            effects,
            cardData.types,
            cardData.limit_per_deck,
            cardData.limit_per_board,
            cardData.play_requirements,
            cardData.custom_values,
            cardData.keywords
        )
        table.insert(self.cards, card)
    end
end

function ConfigLoader:getAllCards()
    return self.cards
end

function ConfigLoader:getCardByName(name)
    for _, card in ipairs(self.cards) do
        if card.name == name then
            return card
        end
    end
    return nil
end

function ConfigLoader:getCardsByCustomValue(valueName, value)
    local cards = {}

    for _, card in ipairs(self.cards) do
        if card.custom_values and card.custom_values[valueName] == value then
            table.insert(cards, card)
        end
    end
    return cards
end

function ConfigLoader:getCardsByType(cardType)
    local cards = {}

    for _, card in ipairs(self.cards) do
        for _, type in ipairs(card.types) do
            if type == "cardType" then
                table.insert(cards, card)
            end
        end
    end
    return cards
end

function ConfigLoader:loadActions(filename)
    local actionConfig = loadJsonFile(filename)

    for _, actionData in ipairs(actionConfig.actions) do
        local action = Action:new(
            actionData.name,
            actionData.type,
            actionData.required_parameters
        )
        table.insert(self.action, action)
    end
end

function ConfigLoader:loadBattleRules(filename)
    local battleRulesData = loadJsonFile(filename)

    local battleRules = BattleRules:new(
        battleRulesData.attackers,
        battleRulesData.taunt_types,
        battleRulesData.blocking,
        battleRulesData.face_attackers,
        battleRulesData.attack_order
    )
    self.battleRules = battleRules
end

function ConfigLoader:loadBoards(filename)
    local boardsConfig = loadJsonFile(filename)

    for _, boardData in ipairs(boardsConfig.boards) do
        local board = Board:new(
            boardData.name,
            boardData.zones,
            boardData.area,
            boardData.ordered_zones
        )
        table.insert(self.boards, board)
    end
end

function ConfigLoader:loadCardTypes(filename)
    local cardTypesConfig = loadJsonFile(filename)

    for _, cardTypeData in ipairs(cardTypesConfig.card_types) do
        local cardType = CardType:new(
            cardTypeData.name,
            cardTypeData.play_requirements,
            cardTypeData.starting_location,
            cardTypeData.limit_per_deck,
            cardTypeData.limit_per_board,
            cardTypeData.starting_deck_type,
            cardTypeData.custom_values,
            cardTypeData.keywords,
            cardTypeData.parent_types
        )
        table.insert(self.cardTypes, cardType)
    end
end

function ConfigLoader:loadDeckTypes(filename)
    local deckTypesConfig = loadJsonFile(filename)

    for _, deckTypeData in ipairs(deckTypesConfig.deck_types) do
        local deckType = DeckType:new(
            deckTypeData.name,
            deckTypeData.card_limit_lower,
            deckTypeData.card_limit_upper,
            deckTypeData.public,
            deckTypeData.copies_limit,
            deckTypeData.shared_limit_with
        )
        table.insert(self.deckTypes, deckType)
    end
end

function ConfigLoader:loadPhases(filename)
    local phasesConfig = loadJsonFile(filename)

    for _, phaseData in ipairs(phasesConfig.phases) do
        local phase = Phase:new(
            phaseData.name,
            phaseData.start_actions,
            phaseData.end_actions,
            phaseData.allowed_actions,
            phaseData.allowed_effect_speeds
        )
        table.insert(self.phases, phase)
    end
end

function ConfigLoader:loadPlayer(filename)
    local playerData = loadJsonFile(filename)

    local player = Player:new(
        playerData.name,
        playerData.custom_values
    )
    self.player = player
end

function ConfigLoader:loadGeneralRules(filename)
    local generalRulesData = loadJsonFile(filename)

    local generalRules = GeneralRules:new(
        generalRulesData.player_count,
        generalRulesData.shared_board,
        generalRulesData.starting_hand_size,
        generalRulesData.maximum_hand_size,
        generalRulesData.can_exceed_max_hand_size,
        generalRulesData.win_conditions,
        generalRulesData.response_mode
    )
    self.generalRules = generalRules
end

function ConfigLoader:loadWinConditions(filename)
    local winConditionsConfig = loadJsonFile(filename)

    for _, winConditionData in ipairs(winConditionsConfig.win_conditions) do
        local winCondition = WinCondition:new(
            winConditionData.name,
            winConditionData.requirements
        )
        table.insert(self.winConditions, winCondition)
    end
end

return ConfigLoader
