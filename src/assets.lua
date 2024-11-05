local Assets = {}

function Assets.MoveAssets(sourceDir)
    local assetPaths = { "", "cards", "effects" }

    local basePath = "squashfs-root/bin/assets"
    for index, path in ipairs(assetPaths) do
        -- Create asset folders in binary location
        os.execute(string.format('mkdir "%s"/"%s"', basePath, path))
        if string.len(path) > 1 then
            -- Move asset files into corresponding directories
            os.execute(string.format('find "%s"/"%s" -name "*.json" -exec cp {} "%s"/"%s" \\;', sourceDir, path, basePath, path))
        end
    end
end

return Assets
