local Card = {}
Card.__index = Card

function Card:new(name, effects, types, limit_per_deck, limit_per_board, play_requirements, custom_values, keywords)
    local card = setmetatable({}, Card)

    card.name = name
    card.effects = effects or {}
    card.types = types or {}
    card.limit_per_deck = limit_per_deck
    card.limit_per_board = limit_per_board
    card.play_requirements = play_requirements or {}
    card.custom_values = custom_values or {}
    card.keywords = keywords or {}

    return card
end

function Card:activateEffect(effectName, params)
    for _, effect in ipairs(self.effects) do
        if effect.name == effectName then
            return effect:activate(params)
        end
    end
    print("Effect not found:", effectName)
    return false
end

return Card
