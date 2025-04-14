import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

const PlayerHand = ({ playerHand, cardWidth, handleCardClick, selectedCard, rotatation }) => {
    const handFanAngle = 10;

    return <Box sx={{
        position: "absolute",
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        bottom: 10,
        left: "35vw",
        rotate: `${rotatation ?? 0}deg`,
        width: "30vw",
        height: 180,
        border: "1px solid gray",
        borderRadius: "4px",
        backgroundColor: "#fff",
        overflow: "visible",
    }}>
        {playerHand && playerHand.map(([key, card], index) => {
            const midIndex = (playerHand.length - 1) / 2;
            const rotation = (index - midIndex) * handFanAngle;
            const offsetX = - ((index - midIndex) * (cardWidth / 3));
            const extraY = selectedCard === index ? -30 : 0;
            return (
                <Box
                    key={index}
                    onClick={() => handleCardClick(index)}
                    sx={{
                        position: "relative",
                        bottom: 5,
                        width: `${cardWidth}px`,
                        transform: `translateX(${offsetX}px) translateY(${extraY}px) rotate(${rotation}deg)`,
                        transformOrigin: "bottom center",
                        transition: "transform 0.3s",
                        cursor: "pointer",
                        zIndex: selectedCard === index ? 10 : 1,
                    }}
                >
                    <Card sx={{
                        maxWidth: 345,
                        margin: "auto",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
                        borderRadius: "10px",
                    }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={"https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Card_back_06.svg/1200px-Card_back_06.svg.png"}
                            alt={card.name}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5">
                                {card.name}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            );
        })}
    </Box>
}


export default PlayerHand