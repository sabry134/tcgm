import { Box, Card, CardContent, Typography } from "@mui/material"

const CardInfo = ({ hoveredCard }) => {
    return <Box
        sx={{
            position: 'absolute',
            left: 16,
            top: 'calc(var(--navigator-bar-heigth) + 20px)',
            zIndex: 1000,
            mt: 2,
        }}
    >
        <Card
            sx={{
                width: 300,
                minHeight: 150,
                borderRadius: 3,
                boxShadow: 6,
                backgroundColor: '#5d3a00',
                color: '#ffffff',
                overflow: 'visible',
            }}
        >
            <CardContent sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'inherit' }}>
                    {hoveredCard.name}
                </Typography>
                {hoveredCard.properties &&
                    Object.entries(hoveredCard.properties).map(([prop, value]) => (
                        <Typography key={prop} variant="body2" sx={{ color: 'inherit' }}>
                            {prop.charAt(0).toUpperCase() + prop.slice(1)}: {value}
                        </Typography>
                    ))}
            </CardContent>
        </Card>
    </Box>
}

export default CardInfo