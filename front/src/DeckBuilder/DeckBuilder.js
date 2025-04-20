import React, { useState, useEffect } from 'react';
import CardFilter from './CardFilter';
import CardPreview from './CardPreview';
import CardList from './CardList';
import DeckPreview from './DeckPreview';
import { mockCards } from './mockData';
import { JoinRoomNavigationBar } from "../NavigationBar/JoinRoomNavigationBar";
import './styles.css';
import { getCardsByGameWithPropertiesRequest } from '../Api/cardsRequest';
import { saveCollectionWithCardsRequest, getCardsInCollectionRequest, getGroupsInCardCollection } from '../Api/collectionsRequest';
import { getCardCardType } from '../Api/cardsRequest';

const Deckbuilder = () => {
  const [deck, setDeck] = useState({});
  const [deckGroups, setDeckGroups] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState(mockCards);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [gotCards, setGotCards] = useState(false);

  async function getCardsWithProperties() {
    try {
      const gameId = localStorage.getItem('gameSelected');
      const response = await getCardsByGameWithPropertiesRequest(gameId);
      setAllCards(response);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  }

  async function getCardsInDeck(initializedDeck) {
    try {
      const deckId = localStorage.getItem('deckSelected');
      const response = await getCardsInCollectionRequest(deckId);

      const deckData = { ...initializedDeck };
      response.forEach((card) => {
        if (deckData[card.group]) {
          for (let i = 0; i < card.quantity; i++) {
            deckData[card.group].push(card);
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
    async function initializeDeck() {
      try {
        // Fetch cards with properties first (independent of deck initialization)
        await getCardsWithProperties();
  
        // Fetch deck groups and initialize the deck
        const deckId = localStorage.getItem('deckSelected');
        const groupsResponse = await getGroupsInCardCollection(deckId);
        setDeckGroups(groupsResponse);
  
        const initialDeck = {};
        groupsResponse.forEach((group) => {
          initialDeck[group.name] = [];
        });
        setDeck(initialDeck);
  
        // Fetch cards in the deck using the initialized deck structure
        await getCardsInDeck(initialDeck);
      } catch (error) {
        console.error('Error during deck initialization:', error);
      }
    }
  
    initializeDeck();
  }, []);
  
  const addCardToDeck = (card) => {
    getCardCardType(card.id).then((cardType) => {
      let groupName = '';
      for (const g of deckGroups) {
        if (g.allowed_card_types.includes(cardType.id)) {
          groupName = g.name;
          break;
        }
      }
      const group = deckGroups.find(g => g.name === groupName);
      if (deck[groupName]) {
        const copies = deck[groupName].filter(c => c.id === card.id).length;
        if (deck[groupName].length >= group.max_cards) {
          alert(`You have too many cards in the ${group.name} group!`);
          return;
        }
        if (copies < group.max_copies) {
          setDeck(prev => ({
            ...prev,
            [groupName]: [ ...prev[groupName], card]
          }));
        } else {
          alert(`You already have ${copies} copies of this card in the ${group.name} group!`);
        }
      }
    });
  };
  
  const removeSingleCard = (cardToRemove) => {
    getCardCardType(cardToRemove.id).then((cardType) => {
      let groupName = '';
      for (const g of deckGroups) {
        if (g.allowed_card_types.includes(cardType.id)) {
          groupName = g.name;
          break;
        }
      }
      const group = deckGroups.find(g => g.name === groupName);
      if (deck[groupName]) {
        const index = deck[groupName].findIndex(c => c.id === cardToRemove.id);
        if (index !== -1) {
          const newCasters = [...deck[groupName]];
          newCasters.splice(index, 1);
          setDeck(prev => ({ ...prev, [groupName]: newCasters }));
        }
      }
    });
  };

  const saveDeck = () => {
    for (const group of deckGroups) {
      if (deck[group.name].length < group.min_cards) {
        alert(`You need at least ${group.min_cards} cards in the ${group.name} group!`);
        return;
      }
    }
  
    const formattedCards = [];

    Object.entries(deck).forEach(([groupName, cards]) => {
      const cardCount = cards.reduce((acc, card) => {
        acc[card.id] = (acc[card.id] || 0) + 1;
        return acc;
      }, {});

      for (const [id, quantity] of Object.entries(cardCount)) {
        formattedCards.push({
          card_id: parseInt(id, 10),
          quantity,
          group: groupName,
        });
      }
    });
  
    saveCollectionWithCardsRequest( localStorage.getItem("deckSelected"), { cards: formattedCards })
      .then((response) => {
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
        <DeckPreview deck={deck} removeSingleCard={removeSingleCard} setHoveredCard={setHoveredCard} deckGroups={deckGroups} />
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
