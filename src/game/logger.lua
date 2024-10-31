local logger = {}

-- We define log levels and corresponding colors
logger.levels = {
    INFO = { name = "INFO", color = "\27[32m" },       -- Green
    WARNING = { name = "WARNING", color = "\27[33m" }, -- Yellow
    ERROR = { name = "ERROR", color = "\27[31m" },     -- Red
    DEBUG = { name = "DEBUG", color = "\27[34m" },     -- Blue
}

logger.current_level = logger.levels.ERROR

-- This function determines if the log should be output to console
local function should_log(level)
    local priority = { INFO = 1, WARNING = 2, ERROR = 3, DEBUG = 4 }
    return priority[level.name] <= priority[logger.current_level.name]
end

function logger.log(level, message)
    if should_log(level) then
        local timestamp = os.date("%Y-%m-%d %H:%M:%S")
        local reset_color = "\27[0m"  -- ANSI code to reset color
        print(string.format("%s[%s] %s%s: %s%s", 
            level.color,            -- Color for the level
            timestamp,              -- Timestamp
            level.name,             -- Log level name (INFO, WARNING, etc.)
            reset_color,            -- Reset color after level name
            message,
            reset_color             -- Reset color at the end
        ))
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
