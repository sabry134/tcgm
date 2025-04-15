import { Box, Card, CardMedia } from "@mui/material";
import '../Room.css'
import { useDroppable } from "@dnd-kit/core";
import GameCard from "./GameCard";

const DiscardPile = ({ opponent, discardPile, handleCardClick, selectedCard }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'graveyard',
    });
    return <Box ref={setNodeRef} className={"container discard" + (opponent ? " opponent" : "")} sx={{
        backgroundColor: isOver ? "#a4ac86" : "#b6ad90"
    }}>
        {discardPile && discardPile.map(([key, card], index) => {
            const offset = index * 2;
            return <GameCard key={index} card={card} hidden={false} index={index} draggable={true} handleCardClick={handleCardClick} selectedCard={selectedCard} src={"graveyard"} cardName={key} />
        })}
    </Box>
}

export default DiscardPile