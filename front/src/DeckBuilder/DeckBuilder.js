import React, { useState, useEffect } from 'react';
import CardFilter from './CardFilter';
import CardPreview from './CardPreview';
import CardList from './CardList';
import DeckPreview from './DeckPreview';
import { mockCards } from './mockData';
import { JoinRoomNavigationBar } from "../NavigationBar/JoinRoomNavigationBar";
import './styles.css';

const MAX_CASTER_CARDS = 2;
const MAX_NORMAL_CARDS = 30;
const MAX_NORMAL_COPIES = 3;
const REQUIRED_CASTER_CARDS = 2;

const Deckbuilder = () => {
  const [deck, setDeck] = useState({
    casters: [],
    normal: []
  });
  const [deckName, setDeckName] = useState('');
  
  const [filteredCards, setFilteredCards] = useState(mockCards);
  const [hoveredCard, setHoveredCard] = useState(null);

  const addCardToDeck = (card) => {
    if (card.type === 'Caster') {
      const copies = deck.casters.filter(c => c.id === card.id).length;
      if (copies < 1 && deck.casters.length < MAX_CASTER_CARDS) {
        setDeck(prev => ({
          ...prev,
          casters: [...prev.casters, card]
        }));
      }
    } else {
      const copies = deck.normal.filter(c => c.id === card.id).length;
      if (copies < MAX_NORMAL_COPIES && deck.normal.length < MAX_NORMAL_CARDS) {
        setDeck(prev => ({
          ...prev,
          normal: [...prev.normal, card]
        }));
      }
    }
  };
  
  const removeSingleCard = (cardToRemove) => {
    if (cardToRemove.type === 'Caster') {
      const index = deck.casters.findIndex(c => c.id === cardToRemove.id);
      if (index !== -1) {
        const newCasters = [...deck.casters];
        newCasters.splice(index, 1);
        setDeck(prev => ({ ...prev, casters: newCasters }));
      }
    } else {
      const index = deck.normal.findIndex(c => c.id === cardToRemove.id);
      if (index !== -1) {
        const newNormal = [...deck.normal];
        newNormal.splice(index, 1);
        setDeck(prev => ({ ...prev, normal: newNormal }));
      }
    }
  };

  const saveDeck = () => {
    if (deck.normal.length === 0) {
      alert('Your deck is empty!');
      return;
    }

    if (deck.casters.length !== REQUIRED_CASTER_CARDS) {
      alert('You must have exactly 2 casters!');
      return;
    }
  
    const cardCount = deck.normal.reduce((acc, card) => {
      acc[card.id] = (acc[card.id] || 0) + 1;
      return acc;
    }, {});
  
    const casterStatus = {};
    deck.casters.forEach((card, index) => {
      casterStatus[card.id] = index === 0;
    });
  
    const deckData = [
      {
        cards: cardCount,
        casters: casterStatus,
        id: Math.floor(Math.random() * 100000), // Placeholder deck ID
        name: deckName,
        quantity: deck.normal.length,
        type: "deck",
        active: true
      }
    ];
  
    console.log("Deck saved:", JSON.stringify(deckData, null, 2));
    alert("Deck saved to console in correct format!");
  };
  

  return (
  <div className="deck-builder-container">
    <JoinRoomNavigationBar />
    <div className="deck-builder">
      <CardFilter cards={mockCards} onFilter={setFilteredCards} />
      <CardPreview card={hoveredCard} />
      
      <div className="deck-content">
        <CardList cards={filteredCards} addCardToDeck={addCardToDeck} setHoveredCard={setHoveredCard} />
        <DeckPreview deck={deck} removeSingleCard={removeSingleCard} setHoveredCard={setHoveredCard} />
      </div>
      <div className="deck-save">
        <input
          className='deck-name-input'
          type="text"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder="Enter deck name"
        />
        <button 
          onClick={saveDeck}
        >
          💾 Save Deck
        </button>
      </div>
    </div>
  </div>
);

};

export default Deckbuilder;
