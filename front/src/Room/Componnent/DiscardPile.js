import { Box, Card, CardMedia } from "@mui/material";
import '../Room.css'
import { useDroppable } from "@dnd-kit/core";

const DiscardPile = ({ discardPile }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: 'graveyard',
    });
    return <Box ref={setNodeRef} sx={{
        position: "absolute",
        bottom: 10,
        right: 10,
        width: 120,
        height: 120,
        backgroundColor: isOver ? "#a4ac86" : "#fff"
    }}>
        {discardPile && discardPile.map(([key, card], index) => {
            const offset = index * 2;
            return (
                <Box
                    key={index}
                    sx={{
                        position: "absolute",
                        top: `${offset}px`,
                        left: `${offset}px`,
                    }}
                >
                    <Card className="card" sx={{ width: 100 }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={card.card_image}
                            alt="Discarded card"
                        />
                    </Card>
                </Box>
            );
        })}
    </Box>
}

export default DiscardPile