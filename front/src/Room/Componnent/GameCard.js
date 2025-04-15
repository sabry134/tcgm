import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material"
import "./../Room.css"
import { useDraggable } from "@dnd-kit/core";



const GameCard = ({ card, hidden = false, cardBackside, index, draggable, handleCardClick, offsetX = 0, rotation = 0, selectedCard, src, cardName }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: src + "/" + index?.toString(),
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10
    } : {

    };

    const cardWidth = 180;

    return <div ref={draggable ? setNodeRef : undefined} style={draggable ? style : undefined} {...(draggable ? listeners : undefined)} {...(draggable ? attributes : undefined)}>
        <Box
            style={{
                position: "relative",
                cursor: "pointer",
                transform: `translateX(${offsetX}px) translateY(${selectedCard && (selectedCard[0] === cardName) ? -30 : 0}px) rotate(${rotation}deg)`,
                transformOrigin: "bottom center",
                transition: "transform 0.3s",
                zIndex: selectedCard && (selectedCard[0] === cardName) ? 10 : 1,
            }}

            onContextMenu={(event) => handleCardClick(event, cardName, src)}
        > <Card className="card" >
                {!hidden ?
                    <>    <CardMedia
                        component="img"
                        height="140"
                        image={card.image}
                        alt={card.name}
                    />
                        <CardContent>
                            <Typography gutterBottom variant="h5">
                                {card.name}
                            </Typography>
                        </CardContent></> :
                    <CardMedia
                        component="img"
                        height="140"
                        image={cardBackside}
                        alt="Backside"
                    />}
            </Card>
        </Box>
    </div>
}
export default GameCard