import { Box, Card, CardMedia } from "@mui/material"
import "../Room.css"

const DeckPile = ({ deck, handlePiocheClick, cardBackImage }) => {
    return <Box sx={{
        position: "absolute",
        top: 10,
        left: 10,
        width: 180,
        height: 140,
        cursor: "pointer",
    }} onClick={handlePiocheClick}>
        {deck && deck.length > 0 && (
            <Card className="card">
                <CardMedia
                    component="img"
                    height="140"
                    image={cardBackImage}
                    alt="Card Back"
                />
            </Card>
        )}
    </Box>
}

export default DeckPile