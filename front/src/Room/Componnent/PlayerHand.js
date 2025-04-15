import { Box, } from "@mui/material";
import '../Room.css'
import GameCard from "./GameCard";
import { useDroppable } from "@dnd-kit/core";


const PlayerHand = ({ playerHand, handleCardClick, selectedCard, hidden, cardBackside, opponent }) => {
    const handFanAngle = 10;
    const { isOver, setNodeRef } = useDroppable({
        id: 'hand',
    });

    return <Box
        ref={setNodeRef}
        className={opponent ? "container playerHand opponent" : "container playerHand"}
        sx={{
            backgroundColor: isOver ? "#a4ac86" : "#b6ad90",
        }}>
        {playerHand && playerHand.map(([key, card], index) => {
            const midIndex = (playerHand.length - 1) / 2;
            const rotation = (index - midIndex) * handFanAngle;
            const offsetX = - ((index - midIndex) * (180 / 3));

            return (
                <GameCard src={"hand"} key={index} cardName={key} card={card} hidden={hidden} cardBackside={cardBackside} draggable={true} index={index} handleCardClick={handleCardClick} rotation={rotation} offsetX={offsetX} selectedCard={selectedCard} />
            );
        })}
    </Box>
}


export default PlayerHand