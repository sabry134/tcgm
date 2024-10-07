local assets = require("assets")

function createLoveFile(sourceDir, outputFile)
    local result
    if love.system.getOS() == "Windows" then
        result = os.execute(string.format('powershell Compress-Archive -Path "%s"\\* -DestinationPath "%s".zip', sourceDir, outputFile))
        if result ~= 0 then
            error("Failed to create .zip file")
        end
        result = os.execute(string.format('ren "%s".zip "%s".love'))
    else
        result = os.execute(string.format('cd "%s" && zip -r ../"%s".love ./*', sourceDir, outputFile))
        print(result)
    end
    --local result = os.execute(zipCommand)
    if result ~= 0 then
        --error("Failed to create .love file.")
    end
end


local function packageGameLinux(outputName, sourceDir)
    local loveBinary = "love_binaries/linux/love-11.5-x86_64.AppImage"

    os.execute(string.format('./"%s" --appimage-extract', loveBinary))
    os.execute(string.format('cat squashfs-root/bin/love "%s".love > squashfs-root/bin/"%s"', outputName, outputName))
    os.execute(string.format('chmod +x squashfs-root/bin/"%s"', outputName))
    os.execute("rm squashfs-root/bin/love")

    assets.MoveAssets(sourceDir)
    -- Create asset folder in binary location
    -- os.execute("mkdir squashfs-root/bin/assets")
    -- os.execute("mkdir squashfs-root/bin/assets/cards")
    -- os.execute("mkdir squashfs-root/bin/assets/effects")

    -- Will automate this later for clarity
    -- os.execute(string.format('find "%s"/cards -name "*.json" -exec cp {} squashfs-root/bin/assets/cards \\;', sourceDir))
    -- os.execute(string.format('find "%s"/effects -name "*.json" -exec cp {} squashfs-root/bin/assets/effects \\;', sourceDir))

    os.execute(string.format('mv squashfs-root "%s"', outputName))

    local runCommand = string.format('cd bin\npwd\n./"%s"', outputName)
    os.execute(string.format('echo "%s" > "%s"/"%s"', runCommand, outputName, outputName))
    os.execute(string.format('chmod +x "%s"/"%s"', outputName, outputName))

    os.execute(string.format('cd "%s"\ntar czvf ../"%s".tar.gz *', outputName, outputName))

    os.execute(string.format('rm "%s".love', outputName))
end


-- Function to package the game into a standalone executable
function PackageGame()
    local loveBinaries = {
        windows = "love_binaries/windows/love.exe",
        macos = "love_binaries/macos/love.app/Contents/MacOS/love",
    }

    local outputName = "HelloWorldGame"
    local sourceDir = "game"

    -- Create .love file
    createLoveFile(sourceDir, outputName)

    -- Package based on the operating system
    local osType = love.system.getOS()
    if osType == "Windows" then
        os.execute(string.format('copy /b "%s.exe"+"%s.love" "%s.exe"', loveBinaries.windows, outputName, outputName))
    elseif osType == "OS X" then
        os.execute(string.format('cat "%s" "%s.love" > "%s"', loveBinaries.macos, outputName, outputName))
    else -- Assume Linux
        packageGameLinux(outputName, sourceDir)
    end

    print("Game packaged successfully as " .. outputName)
end

return {
    PackageGame = PackageGame
}