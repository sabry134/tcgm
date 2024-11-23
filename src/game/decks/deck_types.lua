local DeckType = {}
DeckType.__index = DeckType

function DeckType:new(name, card_limit_lower, card_limit_upper, public, copies_limit, shared_limit_with)
    local deckType = setmetatable({}, DeckType)

    deckType.name = name
    deckType.card_limit_lower = card_limit_lower
    deckType.card_limit_upper = card_limit_upper
    deckType.public = public or false
    deckType.copies_limit = copies_limit or 1
    deckType.shared_limit_with = shared_limit_with or {}

    return deckType
end

return DeckType
