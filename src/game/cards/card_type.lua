local CardType = {}
CardType.__index = CardType

function CardType:new(name, play_requirements, starting_location, limit_per_deck, limit_per_board, starting_deck_type, custom_values, keywords, parent_types)
    local cardType = setmetatable({}, CardType)

    cardType.name = name
    cardType.play_requirements = play_requirements or {}
    cardType.starting_location = starting_location or "MainDeck"
    cardType.limit_per_deck = limit_per_deck
    cardType.limit_per_board = limit_per_board
    cardType.starting_deck_type = starting_deck_type or "MainDeck"
    cardType.custom_values = custom_values or {}
    cardType.keywords = keywords or {}
    cardType.parent_types = parent_types or {}

    return cardType
end

return CardType
