import { useDroppable } from '@dnd-kit/core';
import '../Room.css'
import GameCard from './GameCard';

const CasterZone = ({ cards, handleCardClick, selectedCard }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'caster',
    });
    return <div ref={setNodeRef} className={isOver ? "container casterZone droppable" : "container casterZone"}>
        {cards && cards.map(([key, card], index) => {
            return <GameCard key={index} card={card} cardName={key} hidden={false} index={index} draggable={true} handleCardClick={handleCardClick} selectedCard={selectedCard} src={"caster"} />
        })}
    </div>
}

export default CasterZone