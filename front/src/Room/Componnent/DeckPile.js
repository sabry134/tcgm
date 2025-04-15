import { Box, } from "@mui/material"
import "../Room.css"
import GameCard from "./GameCard"
import { useDroppable } from "@dnd-kit/core";

const DeckPile = ({ opponent, deck, handlePiocheClick, cardBackImage }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'deck',
    });

    return <Box
        ref={setNodeRef}
        className={"container deck" + (opponent ? " opponent" : "")}
        sx={{
            backgroundColor: isOver ? "#a4ac86" : "#b6ad90;",
        }} onClick={handlePiocheClick}>
        {deck && deck.length > 0 && (
            <GameCard card={null} hidden={true} cardBackside={cardBackImage} draggable={false} />
        )}
    </Box>
}

export default DeckPile