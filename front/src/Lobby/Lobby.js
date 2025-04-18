import React, { useEffect, useState } from "react";
import "./Lobby.css"
import { Socket } from "phoenix";
import { callSetDeck } from "../game_commands";
import defaultGameState from '../Room/Data/GameState.json'
import { useNavigate } from "react-router-dom";
import { useChannel } from "../ChannelContext"; // Import the context hook
import { RoomNavigationBar } from "../NavigationBar/RoomNavigationBar";

const Lobby = () => {
    const navigate = useNavigate();
    const { setChannel, setSocket, gameState, setGameState, resetConnection } = useChannel(); // Use the context

    const testDeck = {
        "Card X": {
            "name": "king",
            "properties": {
                "attack": 15,
                "defense": 10
            }
        },
        "Card Y": {
            "name": "queen",
            "properties": {
                "attack": 12,
                "defense": 8
            }
        },
        "Card Z": {
            "name": "jack",
            "properties": {
                "attack": 10,
                "defense": 5
            }
        },
        "Card A": {
            "name": "jack",
            "properties": {
                "attack": 10,
                "defense": 5
            }
        },
        "Card B": {
            "name": "jack",
            "properties": {
                "attack": 10,
                "defense": 5
            }
        },
        "Card C": {
            "name": "jack",
            "properties": {
                "attack": 10,
                "defense": 5
            }
        },
        "Card D": {
            "name": "jack",
            "properties": {
                "attack": 10,
                "defense": 5
            }
        }
    };


    const connectionRef = React.useRef({
        socket: null,
        channel: null,
        isMounted: false,
        isLaunching: false
    });
    const [playerId, setPlayerId] = useState("");

    useEffect(() => {
        if (connectionRef.current.isMounted)
            return
        let username = localStorage.getItem("playerUsername");
        const roomId = localStorage.getItem("room_id");

        if (!roomId) {
            console.error("No room_id found in localStorage");
            navigate("/join");
            return;
        }

        if (!username) {
            const counter = parseInt(localStorage.getItem("playerCounter") || "1", 10);
            username = `Player ${counter}`;
            localStorage.setItem("playerUsername", username);
        }
        setPlayerId(username);

        let socketURL = process.env.REACT_WS_URL;
        if (!socketURL) {
            socketURL = "ws://localhost:4000/socket";
        }

        // Store socket and channel in refs rather than component state
        connectionRef.current.socket = new Socket(socketURL);
        connectionRef.current.socket.connect();
        connectionRef.current.channel = connectionRef.current.socket.channel(`room:${roomId}`, {});
        connectionRef.current.channel
            .join()
            .receive("ok", (resp) => {
                console.log("WebSocket connection established", resp);
            })
            .receive("error", (resp) => {
                console.error("WebSocket connection failed", resp);
            });

        console.log("channel and socket = ", connectionRef.current.socket, connectionRef.current.channel)

        connectionRef.current.channel.on("game_update", (payload) => {
            console.log("Received game update:", payload);
            setGameState(payload.state);
        });

        // Store in context for use across components
        setSocket(connectionRef.current.socket);
        setChannel(connectionRef.current.channel);

        return () => {
            if (!connectionRef.current.isLaunching && connectionRef.current.isMounted) {
                resetConnection()
            } else {
                connectionRef.current.isMounted = true
            }
        };
    }, [navigate, setChannel, setSocket]);


    const handleLaunch = () => {
        connectionRef.current.channel.off("game_update");
        connectionRef.current.isLaunching = true;
        navigate("/room");
    }

    const handleLeave = () => {
        connectionRef.current.channel.off("game_update");
        navigate("/join");
    }

    const handleSetDeck = () => {
        console.log("About to set deck", connectionRef.current.channel, playerId, testDeck);
        callSetDeck(connectionRef.current.channel, playerId, testDeck);
    }

    return <div className="lobbyContainer">
        <RoomNavigationBar roomId={gameState.id} />
        <div className="lobby">
            <ul className="playerList">
                {!gameState.players & Object.entries(gameState.players).map(
                    (player, index) => {
                        <div>
                            {player[0]}
                        </div>
                    }
                )}
            </ul>
            <div>
                <button onClick={handleLeave}>Leave</button>
                <button onClick={handleSetDeck}>Set Deck</button>
                <button onClick={handleLaunch}>Launch</button>
            </div>
        </div>
    </div>
}

export default Lobby