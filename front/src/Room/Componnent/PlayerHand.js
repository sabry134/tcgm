import React, { useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import '../Room.css';
import GameCard from './GameCard';
import { useDroppable } from '@dnd-kit/core';

const PlayerHand = ({ playerHand, handleCardClick, selectedCard, hidden, cardBackside, opponent }) => {
  const handFanAngle = 10;
  const { isOver, setNodeRef } = useDroppable({
    id: `hand/${opponent}`,
  });

  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <>
      {hoveredCard && (
        <Box
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
      )}

      <Box
        ref={setNodeRef}
        className={opponent ? 'container playerHand opponent' : 'container playerHand'}
        sx={{ backgroundColor: isOver ? '#a4ac86' : '#b6ad90' }}
      >
        {playerHand &&
          playerHand.map(([key, card], index) => {
            const midIndex = (playerHand.length - 1) / 2;
            const rotation = (index - midIndex) * handFanAngle;
            const offsetX = -((index - midIndex) * (180 / 3));

            return (
              <div
                key={key + index}
                onMouseEnter={() => setHoveredCard({ name: card.name || key, properties: card.properties })}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ position: 'relative', display: 'inline-block' }}
              >
                <GameCard
                  src="hand"
                  opponent={opponent}
                  cardName={key}
                  card={card}
                  hidden={hidden}
                  cardBackside={cardBackside}
                  draggable
                  index={index}
                  handleCardClick={handleCardClick}
                  rotation={rotation}
                  offsetX={offsetX}
                  selectedCard={selectedCard}
                />
              </div>
            );
          })}
      </Box>
    </>
  );
};

export default PlayerHand;
