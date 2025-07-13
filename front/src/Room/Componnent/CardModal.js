import React from "react";
import "./CardModal.css"; // Import CSS for styling
import GameCard from "./GameCard";

const CardModal = ({ isOpen, onClose, cards, handleContextMenu }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <div className="card-container">
                    {cards.map((cardObject, index) => {
                        const [[key, card]] = Object.entries(cardObject)
                        return <GameCard key={index} card={card} index={index} draggable={false} selectedCard={null} src={null} cardName={key} opponent={false} setHoveredCard={() => { }} handleContextMenu={handleContextMenu} zone={null} />

                    })}
                </div>
            </div>
        </div>
    );
};

export default CardModal;