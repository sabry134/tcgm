local logger = {}

-- We define log levels and corresponding colors
logger.levels = {
    INFO = { name = "INFO", color = "\27[32m" },       -- Green
    WARNING = { name = "WARNING", color = "\27[33m" }, -- Yellow
    ERROR = { name = "ERROR", color = "\27[31m" },     -- Red
    DEBUG = { name = "DEBUG", color = "\27[34m" },     -- Blue
}

logger.current_level = logger.levels.DEBUG

local function should_log(level)
    local priority = { INFO = 1, WARNING = 2, ERROR = 3, DEBUG = 4 }
    return priority[level.name] <= priority[logger.current_level.name]
end

local function ensure_log_directory()
    local logs_dir = "logs"
    os.execute("mkdir -p " .. logs_dir)
    return logs_dir
end

local function get_log_file_name()
    local logs_dir = ensure_log_directory()
    return logs_dir .. "/" .. os.date("%Y-%m-%d") .. ".log"
end

-- Function to write log message to file
local function write_to_file(message)
    local file_name = get_log_file_name()
    local file = io.open(file_name, "a")
    if file then
        file:write(message .. "\n")
        file:close()
    else
        print("Error: Could not open log file for writing.")
    end
end

function logger.log(level, message)
    if should_log(level) then
        local timestamp = os.date("%Y-%m-%d %H:%M:%S")
        local reset_color = "\27[0m"
        local formatted_message = string.format("%s[%s] %s%s: %s%s", 
            level.color,
            timestamp,
            level.name,
            reset_color,
            message,
            reset_color
        )
        
        print(formatted_message)
        
        local plain_message = string.format("[%s] %s: %s", timestamp, level.name, message)
        write_to_file(plain_message)
    end
end

function logger.info(message)
    logger.log(logger.levels.INFO, message)
end

function logger.warning(message)
    logger.log(logger.levels.WARNING, message)
end

function logger.error(message)
    logger.log(logger.levels.ERROR, message)
end

function logger.debug(message)
    logger.log(logger.levels.DEBUG, message)
end

return logger
