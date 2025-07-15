import { useDroppable } from "@dnd-kit/core";
import GameCard from "./GameCard";
import "../Room.css"
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import CardInfo from "./CardInfo";


const CardZone = ({ opponent, cards, cardBackImage, handleZoneClick, handleCardClick, selectedCard, boardLocation, cssName, style, opponentStyle, hoverStyle, hidden, draggable, offsetXHandler, offsetYHandler, rotationHandler, stackZone, handleContextMenu }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: boardLocation + '/' + opponent.toString(),
    });
    const [hoveredCard, setHoveredCard] = useState(null);
    const cssHandler = () => {
        return ("container " + cssName + (opponent ? " opponent" : "")) + (isOver ? " droppable" : '')
    }
    return <> {hoveredCard && (
        <CardInfo hoveredCard={hoveredCard} />
    )
    }

        <div ref={setNodeRef} className={cssHandler()} style={{ ...(opponent ? style : opponentStyle), ...(isOver && hoverStyle) }} onClick={handleZoneClick} onContextMenu={(event) => handleContextMenu(event, 'zone', null, boardLocation)}>
            {cards && cards.length >= 1 && (!stackZone ? (cards.map((cardObject, index) => {
                const [[key, card]] = Object.entries(cardObject)
                const offsetX = offsetXHandler ? offsetXHandler(card, index, cards.length) : null
                const offsetY = offsetYHandler ? offsetYHandler(card, index, cards.length) : null
                const rotation = rotationHandler ? rotationHandler(card, index, cards.length) : null

                return <GameCard setHoveredCard={setHoveredCard} cardName={key} key={index} opponent={opponent} card={card} cardBackside={cardBackImage} hidden={hidden} index={index} draggable={draggable} handleCardClick={handleCardClick} selectedCard={selectedCard} src={boardLocation} offsetX={offsetX} offsetY={offsetY} rotation={rotation} handleContextMenu={handleContextMenu} zone={boardLocation} />
            })) : <GameCard setHoveredCard={setHoveredCard} opponent={opponent} card={Object.entries(cards[cards.length - 1])[0][1]} cardBackside={cardBackImage} hidden={hidden} index={cards.length - 1} draggable={draggable} handleCardClick={handleCardClick} selectedCard={selectedCard} src={boardLocation} offsetX={offsetXHandler ? offsetXHandler() : null} offsetY={offsetYHandler ? offsetYHandler() : null} rotation={rotationHandler ? rotationHandler() : null} handleContextMenu={handleContextMenu} zone={boardLocation} />
            )}
        </div>
    </>
}

export default CardZone