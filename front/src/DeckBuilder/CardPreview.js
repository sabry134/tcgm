import React from 'react';

const CardPreview = ({ card }) => {
  if (!card) {
    return (
      <div className="card-preview">
        <p>Hover over a card to preview.</p>
      </div>
    );
  }

  const cardProperties = card.properties || [];

  return (
    <div className="card-preview">
      <h2>{card.name}</h2>
      <img src={card.image} alt={card.name} className="card-preview-image" />
      <div className="card-properties">
        {cardProperties.map((property, index) => (
          <p key={index}>
            <strong>{property.name.charAt(0).toUpperCase() + property.name.slice(1)}:</strong> {String(property.value)}
          </p>
        ))}
      </div>
    </div>
  );
};

export default CardPreview;
