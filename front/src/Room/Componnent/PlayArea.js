import { useDroppable } from '@dnd-kit/core';
import '../Room.css'
import GameCard from './GameCard';

const PlayArea = ({ cards, handleCardClick, selectedCard, opponent }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'field' + '/' + opponent.toString(),
    });
    return <div ref={setNodeRef} className={(isOver ? "container playArea droppable" : "container playArea") + (opponent ? " opponent" : "")}>
        {cards && cards.map(([key, card], index) => {
            return <GameCard key={index} opponent={opponent} card={card} cardName={key} hidden={false} index={index} draggable={true} handleCardClick={handleCardClick} selectedCard={selectedCard} src={"field"} />
        })}
    </div>
}

export default PlayArea