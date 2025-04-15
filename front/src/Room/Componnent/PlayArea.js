import { useDroppable } from '@dnd-kit/core';
import '../Room.css'

const PlayArea = ({ cards }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'field',
    });
    return <div ref={setNodeRef} className={isOver ? "playAreaContainer droppable" : "playAreaContainer"}>
    </div>
}

export default PlayArea