import React from "react";
import { callMoveCard, callDrawCard, shuffleCard, updateCard, passTurn } from "../../game_commands";

const ContextMenu = ({ x, y, type, onClose, card, zone, channel, playerId, cardName, gameState, openModal }) => {
    // Calculate the position to ensure the menu is always visible
    const menuHeight = 300; // Approximate height of the menu
    const menuWidth = 150; // Approximate width of the menu
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const adjustedX = x + menuWidth > viewportWidth ? viewportWidth - menuWidth - 10 : x;
    const adjustedY = y + menuHeight > viewportHeight ? viewportHeight - menuHeight - 10 : y;

    return (
        <div
            style={{
                position: "absolute",
                top: adjustedY,
                left: adjustedX,
                backgroundColor: "white",
                border: "1px solid #ccc",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 1000,
                padding: "10px",
                borderRadius: "4px",
            }}
            onMouseLeave={onClose}
        >
            {type === "card" && <CardContext card={card} channel={channel} playerId={playerId} cardName={cardName} zone={zone} gameState={gameState} openModal={openModal} />}
            {type === "zone" && <ZoneContext zone={zone} channel={channel} playerId={playerId} gameState={gameState} openModal={openModal} />}
            {type === "nothing" && <GeneralContext channel={channel} playerId={playerId} gameState={gameState} />}
        </div>
    );
};

const ContextLine = ({ label, onClick }) => {
    return (
        <div
            style={{ padding: "8px", cursor: "pointer" }}
            onClick={onClick}
        >
            {label}
        </div>
    );
};

// Card context menu actions
const playCard = (channel, playerId, cardName, source) => {
    if (channel && playerId && cardName) {
        callMoveCard(channel, playerId, cardName, source, "field"); // Move card to the field
    }
};

const moveCard = (channel, playerId, cardName, source, dest) => {
    if (channel && playerId && cardName) {
        callMoveCard(channel, playerId, cardName, source, dest); // Move card to a specific destination
    }
};

const addHp = (channel, playerId, location, card, cardName) => {
    if (channel && playerId && card) {
        updateCard(channel, playerId, location, cardName, "defense", card.properties.defense + 1); // Increment HP
    }
};

const removeHp = (channel, playerId, location, card, cardName) => {
    if (channel && playerId && card) {
        updateCard(channel, playerId, location, cardName, "defense", card.properties.defense - 1); // Decrement HP
    }
};

const addAtk = (channel, playerId, location, card, cardName) => {
    if (channel && playerId && card) {
        updateCard(channel, playerId, location, cardName, "attack", card.properties.attack + 1); // Increment ATK
    }
};

const removeAtk = (channel, playerId, location, card, cardName) => {
    if (channel && playerId && card) {
        updateCard(channel, playerId, location, cardName, "attack", card.properties.attack - 1); // Decrement ATK
    }
};

// Card context menu
const CardContext = ({ card, channel, playerId, cardName, zone, gameState, openModal }) => {
    return (
        <div>
            <ContextLine label={"Play Card"} onClick={() => playCard(channel, playerId, cardName, zone)} />
            <ContextLine label={"Move Card"} onClick={() => moveCard(channel, playerId, cardName, "hand", "graveyard")} />
            <ContextLine label={"Add Hp"} onClick={() => addHp(channel, playerId, zone, card, cardName)} />
            <ContextLine label={"Remove Hp"} onClick={() => removeHp(channel, playerId, zone, card, cardName)} />
            <ContextLine label={"Add Atk"} onClick={() => addAtk(channel, playerId, zone, card, cardName)} />
            <ContextLine label={"Remove Atk"} onClick={() => removeAtk(channel, playerId, zone, card, cardName)} />
            <ContextLine label={"View details"} onClick={() => viewDetails(zone, gameState, playerId, openModal)} />
            <ContextLine label={"Shuffle Zone"} onClick={() => shuffleCard(channel, playerId, zone)} />
        </div>
    );
};

// Zone context menu actions
const drawTopCard = (channel, playerId, zone) => {
    if (channel && playerId) {
        callDrawCard(channel, playerId, 1); // Draw one card from the zone
    }
};

const shuffleZone = (channel, playerId, zone) => {
    if (channel && playerId) {
        shuffleCard(channel, playerId, zone); // Shuffle the zone
    }
};

const viewDetails = (zone, gameState, playerId, openModal) => {
    openModal(gameState.players[playerId][zone]);
};

// Zone context menu
const ZoneContext = ({ zone, channel, playerId, gameState, openModal }) => {
    return (
        <div>
            <ContextLine label={"Draw Top Card"} onClick={() => drawTopCard(channel, playerId, zone)} />
            <ContextLine label={"Shuffle"} onClick={() => shuffleZone(channel, playerId, zone)} />
            <ContextLine label={"View details"} onClick={() => viewDetails(zone, gameState, playerId, openModal)} />
        </div>
    );
};

// General context menu actions
const endTurn = (channel, playerId, gameState) => {
    if (gameState.turn !== playerId) {
        console.warn("It's not your turn to end!");
        return;
    }
    if (channel && playerId && gameState) {
        Object.entries(gameState.players).maps(([key, value]) => {
            if (key !== gameState.turn) {
                passTurn(channel, key);
            }
        });
    }
};

// General context menu
const GeneralContext = ({ channel, playerId, gameState }) => {
    return (
        <div>
            <ContextLine label={"End Turn"} onClick={() => endTurn(channel, playerId, gameState)} />
        </div>
    );
};

export default ContextMenu;