local helpers = {}

function helpers:contains(list, v)
    for _, value in ipairs(list) do
        if value == v then
            return true
        end
    end
    return false
end

return helpers
