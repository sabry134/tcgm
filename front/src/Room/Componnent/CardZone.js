import { useDroppable } from "@dnd-kit/core";
import GameCard from "./GameCard";
import "../Room.css"


const CardZone = ({ opponent, cards, cardBackImage, handleZoneClick, handleCardClick, selectedCard, boardLocation, cssName, style, opponentStyle, hoverStyle, hidden, draggable, offsetXHandler, offsetYHandler, rotationHandler, stackZone }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: boardLocation + '/' + opponent.toString(),
    });

    const cssHandler = () => {
        return ("container " + cssName + (opponent ? " opponent" : "")) + (isOver ? " droppable" : '')
    }

    return <div ref={setNodeRef} className={cssHandler()} style={{ ...(opponent ? style : opponentStyle), ...(isOver && hoverStyle) }} onClick={handleZoneClick}>
        {cards && cards.length >= 1 && (!stackZone ? (cards.map(([key, card], index) => {
            const offsetX = offsetXHandler ? offsetXHandler(key, card, index, cards.length) : null
            const offsetY = offsetYHandler ? offsetYHandler(key, card, index, cards.length) : null
            const rotation = rotationHandler ? rotationHandler(key, card, index, cards.length) : null
            console.log(offsetY, boardLocation)
            return <GameCard key={index} opponent={opponent} card={card} cardBackside={cardBackImage} cardName={key} hidden={hidden} index={index} draggable={draggable} handleCardClick={handleCardClick} selectedCard={selectedCard} src={boardLocation} offsetX={offsetX} offsetY={offsetY} rotation={rotation} />
        })) : <GameCard opponent={opponent} card={cards[cards.length - 1][1]} cardBackside={cardBackImage} cardName={cards[cards.length - 1][0]} hidden={hidden} index={cards.length - 1} draggable={draggable} handleCardClick={handleCardClick} selectedCard={selectedCard} src={boardLocation} offsetX={offsetXHandler ? offsetXHandler() : null} offsetY={offsetYHandler ? offsetYHandler() : null} rotation={rotationHandler ? rotationHandler() : null} />
        )}
    </div>
}

export default CardZone