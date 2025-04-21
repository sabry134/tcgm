import React, { createContext, useState, useContext } from 'react';
import defaultGameState from "./Room/Data/GameState.json"


const ChannelContext = createContext();

export const ChannelProvider = ({ children }) => {
    const [channel, setChannel] = useState(null);
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState(defaultGameState);

    const weakResetConnection = () => {
        if (channel) {
            channel.leave()
        }
        if (socket) {
            socket.disconnect()
        }
        setGameState(defaultGameState)
    }
    const resetConnection = () => {
        if (channel) {
            channel.leave()
        }
        if (socket) {
            socket.disconnect()
        }
        localStorage.removeItem("playerUsername");
        localStorage.removeItem("room_id");
        setGameState(defaultGameState)
    }

    return (
        <ChannelContext.Provider value={{ channel, setChannel, socket, setSocket, gameState, setGameState, resetConnection, weakResetConnection }}>
            {children}
        </ChannelContext.Provider>
    );
};

export const useChannel = () => useContext(ChannelContext);