import { Box, Typography } from "@mui/material"

const CardInfo = ({ selectedCard, playerHand }) => {
    return <Box sx={{
        position: "absolute",
        top: 70,
        left: 10,
        width: 300,
        padding: "8px",
        border: "1px solid gray",
        borderRadius: "4px",
        backgroundColor: "#fff",
    }}>
        {selectedCard !== null && playerHand && playerHand[selectedCard] && (
            <Box>
                <Typography variant="h6">
                    {playerHand[selectedCard][1].name}
                </Typography>
            </Box>
        )}
    </Box >
}

export default CardInfo