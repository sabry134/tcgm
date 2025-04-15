import { Box, } from "@mui/material";
import '../Room.css'
import GameCard from "./GameCard";
import { useDroppable } from "@dnd-kit/core";


const PlayerHand = ({ playerHand, cardWidth, handleCardClick, selectedCard, rotation, bottom, top, left, right, hidden, cardBackside }) => {
    const handFanAngle = 10;
    const { isOver, setNodeRef } = useDroppable({
        id: 'hand',
    });

    return <Box
        ref={setNodeRef}
        className={"container playerHand"}
        sx={{
            top: top,
            right: right,
            bottom: bottom,
            left: left,
            rotate: `${rotation ?? 0}deg`,
            backgroundColor: isOver ? "#a4ac86" : "#b6ad90",
        }}>
        {playerHand && playerHand.map(([key, card], index) => {
            const midIndex = (playerHand.length - 1) / 2;
            const rotation = (index - midIndex) * handFanAngle;
            const offsetX = - ((index - midIndex) * (180 / 3));

            return (
                <GameCard src={"hand"} key={index} cardName={key} card={card} hidden={hidden} cardBackside={cardBackside} draggable={true} index={index} handleCardClick={handleCardClick} rotation={rotation} offsetX={offsetX} />
            );
        })}
    </Box>
}


export default PlayerHand