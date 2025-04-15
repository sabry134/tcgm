import { useDroppable } from '@dnd-kit/core';
import '../Room.css'
import GameCard from './GameCard';

const CasterZone = ({ opponent, cards, handleCardClick, selectedCard }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'caster',
    });
    return <div style={{ backgroundColor: isOver ? "#a4ac86" : "#b6ad90" }} ref={setNodeRef} className={"container casterZone" + (opponent ? " opponent" : "")}>
        {cards && cards.map(([key, card], index) => {
            return <GameCard key={index} card={card} cardName={key} hidden={false} index={index} draggable={true} handleCardClick={handleCardClick} selectedCard={selectedCard} src={"caster"} />
        })}
    </div>
}

export default CasterZone