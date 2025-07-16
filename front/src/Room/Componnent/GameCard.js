import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material"
import "./../Room.css"
import { useDraggable } from "@dnd-kit/core";



const GameCard = ({ card, hidden = false, cardBackside, index, draggable = true, handleCardClick, offsetX = 0, rotation = 0, selectedCard, src, cardName, opponent = true, offsetY = 0, setHoveredCard, handleContextMenu, zone }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: src + "/" + index?.toString() + "/" + opponent.toString()
    });
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 10
    } : {

    };

    const cardWidth = 180;

    return <div ref={draggable && !opponent ? setNodeRef : undefined} style={draggable && !opponent ? style : undefined} {...(draggable && !opponent ? listeners : undefined)} {...(draggable && !opponent ? attributes : undefined)}>
        <Box
            style={{
                position: "relative",
                cursor: "pointer",
                transform: `translateX(${offsetX}px) translateY(${(selectedCard && (selectedCard[0] === cardName) ? -30 : 0) + offsetY}px) rotate(${rotation}deg)`,
                transformOrigin: "bottom center",
                transition: "transform 0.3s",
                zIndex: selectedCard && (selectedCard[0] === cardName) ? 10 : 1,
            }}
            onContextMenu={(event) => handleContextMenu(event, 'card', cardName, card, zone)}
            onMouseEnter={(event) => { !hidden && setHoveredCard(card) }}
            onMouseLeave={(event) => { !hidden && setHoveredCard(null) }}
        >
            <Card className="card" >
                {!hidden ?
                    <>    <CardMedia
                        component="img"
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
                        image={cardBackside}
                        sx={{ objectFit: "cover" }}
                        alt="Backside"
                    />}
            </Card>
        </Box>
    </div>
}
export default GameCard