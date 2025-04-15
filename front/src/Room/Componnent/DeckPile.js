import { Box, } from "@mui/material"
import "../Room.css"
import GameCard from "./GameCard"
import { useDroppable } from "@dnd-kit/core";

const DeckPile = ({ deck, handlePiocheClick, cardBackImage }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'deck',
    });

    return <Box
        ref={setNodeRef}
        sx={{
            position: "absolute",
            top: 10,
            left: 10,
            width: 180,
            height: 140,
            cursor: "pointer",
            backgroundColor: isOver ? "#a4ac86" : "#fff",
        }} onClick={handlePiocheClick}>
        {deck && deck.length > 0 && (
            <GameCard card={null} hidden={true} cardBackside={cardBackImage} draggable={false} />
        )}
    </Box>
}

export default DeckPile