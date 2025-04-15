import { useDroppable } from '@dnd-kit/core';
import '../Room.css'

const CasterZone = () => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'caster',
    });
    return <div ref={setNodeRef} className={isOver ? "casterZoneContainer droppable" : "casterZoneContainer"}>
    </div>
}

export default CasterZone