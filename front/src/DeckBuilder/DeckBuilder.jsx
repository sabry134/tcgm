import React, { Component } from 'react';
import CardFilter from './Components/CardFilter';
import CardPreview from './Components/CardPreview';
import CardList from './Components/CardList';
import DeckPreview from './Components/DeckPreview';
import { mockCards } from './Components/mockData';
import './Components/styles.css';
import { getCardsByGameWithPropertiesRequest } from '../Api/cardsRequest';
import { saveCollectionWithCardsRequest, getCardsInCollectionRequest } from '../Api/collectionsRequest';
import { getCardCardType } from '../Api/cardsRequest';
import { getGroupsForCollectionType } from '../Api/gamesRequest';
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TopBarIconButton, TopBarTextButton } from "../Components/TopBar/TopBarButton";
import { unselectGame } from "../Utility/navigate";
import { Home } from "@mui/icons-material";
import { ROUTES } from "../Routes/routes";
import { TopBarButtonGroup } from "../Components/TopBar/TopBarButtonGroup";
import { Box } from "@mui/material";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";

class DeckBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: {},
      deckGroups: [],
      allCards: [],
      filteredCards: mockCards,
      hoveredCard: null,
      gotCards: false,
    };
  }

  async componentDidMount() {
    try {
      await this.getCardsWithProperties();

      const gameId = localStorage.getItem('gameSelected');
      const groupsResponse = await getGroupsForCollectionType(gameId, 'deck');
      this.setState({ deckGroups: groupsResponse });

      const initialDeck = {};
      groupsResponse.forEach((group) => {
        initialDeck[group.name] = [];
      });
      this.setState({ deck: initialDeck });

      await this.getCardsInDeck(initialDeck);
    } catch (error) {
      console.error('Error during deck initialization:', error);
    }
  }

  getCardsWithProperties = async () => {
    try {
      const gameId = localStorage.getItem('gameSelected');
      const response = await getCardsByGameWithPropertiesRequest(gameId);
      this.setState({ allCards: response });
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  getCardsInDeck = async (initializedDeck) => {
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
      this.setState({ deck: deckData, gotCards: true });
    } catch (error) {
      console.error('Error fetching deck cards:', error);
    }
  };

  addCardToDeck = (card) => {
    getCardCardType(card.id).then((cardType) => {
      const { deck, deckGroups } = this.state;
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
          this.setState((prevState) => ({
            deck: {
              ...prevState.deck,
              [groupName]: [...prevState.deck[groupName], card],
            },
          }));
        } else {
          alert(`You already have ${copies} copies of this card in the ${group.name} group!`);
        }
      }
    });
  };

  removeSingleCard = (cardToRemove) => {
    getCardCardType(cardToRemove.id).then((cardType) => {
      const { deck, deckGroups } = this.state;
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
          this.setState((prevState) => ({
            deck: {
              ...prevState.deck,
              [groupName]: newCasters,
            },
          }));
        }
      }
    });
  };

  saveDeck = () => {
    const { deck, deckGroups } = this.state;

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

    saveCollectionWithCardsRequest(localStorage.getItem("deckSelected"), { cards: formattedCards })
      .then(() => {
        alert('Deck saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving deck:', error);
        alert('Error saving deck!');
      });
  };

  render() {
    const { deck, deckGroups, allCards, filteredCards, hoveredCard } = this.state;

    return (
      <BaseLayout
        topBar={
          <TopBarButtonGroup>
            <TopBarIconButton
              event={() => {
                unselectGame(this.props.navigate);
              }}
              svgComponent={Home}
              altText="Return to home"
            />
            <TopBarTextButton
              title={"Create/Join Room"}
              altText={"Create or join a game room"}
              event={() => this.props.navigate(ROUTES.JOIN)}
            />
            <TopBarTextButton
              title={"Edit Deck"}
              altText={"Edit your decks"}
              event={() => this.props.navigate(ROUTES.EDIT_DECK)}
            />
          </TopBarButtonGroup>
        }

        centerPanel={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <CardFilter cards={allCards} onFilter={(cards) => this.setState({ filteredCards: cards })} />
            <CardPreview card={hoveredCard} />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <CardList
                cards={filteredCards}
                addCardToDeck={this.addCardToDeck}
                setHoveredCard={(card) => this.setState({ hoveredCard: card })}
              />
              <DeckPreview
                deck={deck}
                removeSingleCard={this.removeSingleCard}
                setHoveredCard={(card) => this.setState({ hoveredCard: card })}
                deckGroups={deckGroups}
              />
            </Box>

            <TCGMButton
              onClick={this.saveDeck}
              text="💾 Save Deck"
            />
          </Box>
        }
      />
    );
  }
}

export default DeckBuilder;