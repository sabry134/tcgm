local login_handler = {}

local logger = require("logger")

function login_handler.HandleLoginResponse(code, data)
    if code == 200 then
        logger.info("Login success.")
        local message = data.message
        print(message)
    end
end

return login_handler
