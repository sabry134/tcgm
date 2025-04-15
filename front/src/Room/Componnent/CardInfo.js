import { Box, Typography } from "@mui/material"

const CardInfo = ({ selectedCard, cardList }) => {
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
        {selectedCard !== null && cardList && cardList[selectedCard] && (
            <Box>
                <Typography variant="h6">
                    {cardList[selectedCard].name}
                </Typography>
            </Box>
        )}
    </Box >
}

export default CardInfo