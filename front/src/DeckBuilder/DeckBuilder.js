import React, { useState, useEffect } from 'react';
import CardFilter from './CardFilter';
import CardPreview from './CardPreview';
import CardList from './CardList';
import DeckPreview from './DeckPreview';
import { mockCards } from './mockData';
import { JoinRoomNavigationBar } from "../NavigationBar/JoinRoomNavigationBar";
import './styles.css';
import { getCardsByGameWithPropertiesRequest } from '../Api/cardsRequest';
import { saveCollectionWithCardsRequest } from '../Api/collectionsRequest';
import { getCardCardType } from '../Api/cardsRequest';
import { getCardsInCollectionRequest } from '../Api/collectionsRequest';

const MAX_CASTER_CARDS = 2;
const MAX_NORMAL_CARDS = 30;
const MAX_NORMAL_COPIES = 3;
const REQUIRED_CASTER_CARDS = 1;

const Deckbuilder = () => {
  const [deck, setDeck] = useState({
    casters: [],
    deck: []
  });
  const [allCards, setAllCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState(mockCards);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [gotCards, setGotCards] = useState(false);

  async function getCardsWithProperties() {
    try {
      const gameId = localStorage.getItem('gameSelected');
      const response = await getCardsByGameWithPropertiesRequest(gameId);
      setAllCards(response);
      console.log('Cards with properties:', response);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  }

  async function getCardsInDeck() {
    try {
      const deckId = localStorage.getItem('deckSelected');
      const response = await getCardsInCollectionRequest(deckId);
      console.log('Deck cards:', response);
      const deckData = {
        casters: [],
        deck: []
      };
      response.forEach(card => {
        if (card.group === 'casters') {
          for (let i = 0; i < card.quantity; i++) {
            deckData.casters.push(card);
          }
        } else {
          for (let i = 0; i < card.quantity; i++) {
            deckData.deck.push(card);
          }
        }
      });
      setDeck(deckData);
      setGotCards(true);
    } catch (error) {
      console.error('Error fetching deck cards:', error);
    }
  }

  useEffect(() => {
    getCardsWithProperties();
    if (!gotCards) {
      getCardsInDeck();
    }
  }, []);

  const addCardToDeck = (card) => {
    getCardCardType(card.id).then((cardType) => {
      console.log('Card type:', cardType);
      if (cardType.name === 'caster') {
        const copies = deck.casters.filter(c => c.id === card.id).length;
        if (copies < 1 && deck.casters.length < MAX_CASTER_CARDS) {
          setDeck(prev => ({
            ...prev,
            casters: [...prev.casters, card]
          }));
        }
      } else {
        const copies = deck.deck.filter(c => c.id === card.id).length;
        if (copies < MAX_NORMAL_COPIES && deck.deck.length < MAX_NORMAL_CARDS) {
          setDeck(prev => ({
            ...prev,
            deck: [...prev.deck, card]
          }));
        }
      }
    });
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
      const index = deck.deck.findIndex(c => c.id === cardToRemove.id);
      if (index !== -1) {
        const newNormal = [...deck.deck];
        newNormal.splice(index, 1);
        setDeck(prev => ({ ...prev, deck: newNormal }));
      }
    }
  };

  const saveDeck = () => {
    if (deck.deck.length === 0) {
      alert('Your deck is empty!');
      return;
    }
  
    if (deck.casters.length !== REQUIRED_CASTER_CARDS) {
      alert('You must have exactly 2 casters!');
      return;
    }
  
    // Format the cards for the API request
    const formattedCards = [];
  
    // Add normal cards
    const normalCardCount = deck.deck.reduce((acc, card) => {
      acc[card.id] = (acc[card.id] || 0) + 1;
      return acc;
    }, {});
  
    for (const [id, quantity] of Object.entries(normalCardCount)) {
      formattedCards.push({
        card_id: parseInt(id, 10),
        quantity,
        group: 'deck'
      });
    }
  
    deck.casters.forEach((card) => {
      formattedCards.push({
        card_id: card.id,
        quantity: 1,
        group: 'casters'
      });
    });
  
    saveCollectionWithCardsRequest( localStorage.getItem("deckSelected"), { cards: formattedCards })
      .then((response) => {
        console.log('Deck saved:', response);
        alert('Deck saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving deck:', error);
        alert('Error saving deck!');
      });
  };
  

  return (
  <div className="deck-builder-container">
    <JoinRoomNavigationBar />
    <div className="deck-builder">
      <CardFilter cards={allCards} onFilter={setFilteredCards} />
      <CardPreview card={hoveredCard} />
      
      <div className="deck-content">
        <CardList cards={filteredCards} addCardToDeck={addCardToDeck} setHoveredCard={setHoveredCard} />
        <DeckPreview deck={deck} removeSingleCard={removeSingleCard} setHoveredCard={setHoveredCard} />
      </div>
      <div className="deck-save">
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
