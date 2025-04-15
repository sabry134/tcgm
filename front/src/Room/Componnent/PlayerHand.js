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
        sx={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            top: top,
            right: right,
            bottom: bottom,
            left: left,
            rotate: `${rotation ?? 0}deg`,
            width: "30vw",
            height: 180,
            border: "1px solid gray",
            borderRadius: "4px",
            backgroundColor: isOver ? "#a4ac86" : "#fff",
            overflow: "visible",
        }}>
        {playerHand && playerHand.map(([key, card], index) => {
            const midIndex = (playerHand.length - 1) / 2;
            const rotation = (index - midIndex) * handFanAngle;
            const offsetX = - ((index - midIndex) * (180 / 3));
            const extraY = selectedCard === index ? -30 : 0;
            return (
                <GameCard src={"hand"} key={index} card={card} hidden={hidden} cardBackside={cardBackside} draggable={!hidden} index={index} handleCardClick={handleCardClick} rotation={rotation} offsetX={offsetX} extraY={extraY} />
            );
        })}
    </Box>
}


export default PlayerHand