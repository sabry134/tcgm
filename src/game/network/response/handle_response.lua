local login_handler = require("network.response.handle_login_response")

local response_handler = {}

response_handler.ServerResponseHandlers = {
    Login = login_handler.HandleLoginResponse
}

return response_handler
