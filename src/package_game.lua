function createLoveFile(sourceDir, outputFile)
    local zipCommand
    if love.system.getOS() == "Windows" then
        zipCommand = string.format('powershell Compress-Archive -Path "%s\\*" -DestinationPath "%s.love"', sourceDir, outputFile)
    else
        zipCommand = string.format('zip -rj "%s.love" "%s"', outputFile, sourceDir)
    end
    local result = os.execute(zipCommand)
    if result ~= 0 then
        error("Failed to create .love file.")
    end
end

-- Function to package the game into a standalone executable
function packageGame()
    local loveBinaries = {
        windows = "love_binaries/windows/love.exe",
        macos = "love_binaries/macos/love.app/Contents/MacOS/love",
        linux = "love_binaries/linux/love"
    }

    local outputName = "HelloWorldGame"
    local sourceDir = "./game/"

    -- Create .love file
    createLoveFile(sourceDir, outputName)

    -- Package based on the operating system
    local osType = love.system.getOS()
    if osType == "Windows" then
        os.execute(string.format('copy /b "%s.exe"+"%s.love" "%s.exe"', loveBinaries.windows, outputName, outputName))
    elseif osType == "OS X" then
        os.execute(string.format('cat "%s" "%s.love" > "%s"', loveBinaries.macos, outputName, outputName))
    else -- Assume Linux
        os.execute(string.format('cat "%s" "%s.love" > "%s"', loveBinaries.linux, outputName, outputName))
        os.execute(string.format('chmod +x "%s"', outputName)) -- Make it executable
    end

    print("Game packaged successfully as " .. outputName)
end

return {
    packageGame = packageGame
}