local colorTheme = {}
local Color = {}

function colorTheme.new(background, primaryButton, secondaryButton, inputBackground, primaryFont, secondaryFont)
	return setmetatable({
        background = background,
        primaryButton = primaryButton,
        secondaryButton = secondaryButton,
        inputBackground = inputBackground,
        primaryFont = primaryFont,
        secondaryFont = secondaryFont 
	}, colorTheme)
end


return colorTheme