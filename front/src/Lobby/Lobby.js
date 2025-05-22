import React, { useEffect, useState } from "react";
import "./Lobby.css"
import { Socket } from "phoenix";
import { callSetDeck } from "../game_commands";
import { useNavigate } from "react-router-dom";
import { useChannel } from "../ChannelContext"; // Import the context hook
import { RoomNavigationBar } from "../Components/NavigationBar/RoomNavigationBar";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";

const Lobby = () => {
    const navigate = useNavigate();
    const { channel, setChannel, setSocket, gameState, setGameState, resetConnection } = useChannel(); // Use the context

    const testDeck = [
        {
            'CARD A': {
                "name": "king",
                "properties": {
                    "attack": 15,
                    "defense": 10
                }
            }
        },
        {
            'CARD B': {
                "name": "queen",
                "properties": {
                    "attack": 12,
                    "defense": 8
                }
            }
        },
        {
            'CARD C': {
                "name": "jack",
                "properties": {
                    "attack": 10,
                    "defense": 5
                }
            }
        },
        {
            "CARD D": {
                "name": "jack",
                "properties": {
                    "attack": 10,
                    "defense": 5
                }
            }
        },
        {
            "CARD E": {
                "name": "jack",
                "properties": {
                    "attack": 10,
                    "defense": 5
                }
            }
        },
        {
            "CARD F": {
                "name": "jack",
                "properties": {
                    "attack": 10,
                    "defense": 5
                }
            }
        },
        {
            "CARD Z": {
                "name": "jack",
                "properties": {
                    "attack": 10,
                    "defense": 5
                }
            }
        }
    ];


    const connectionRef = React.useRef({
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
        handleConnection(roomId)

        return () => {
            if (!connectionRef.current.isLaunching && connectionRef.current.isMounted) {
                resetConnection()
            } else {
                connectionRef.current.isMounted = true
            }
        };
    }, [navigate, setChannel, setSocket]);


    const handleConnection = async (roomId) => {
        try {
            let socketURL = process.env.REACT_WS_URL;
            if (!socketURL) {
                socketURL = "ws://localhost:4000/socket";
            }
            const tmpSocket = new Socket(socketURL)
            // Store socket and channel in refs rather than component state
            tmpSocket.connect();
            const tmpChannel = tmpSocket.channel(`room:${roomId}`, {})
            tmpChannel
                .join()
                .receive("ok", (resp) => {
                    console.log("WebSocket connection established", resp);
                })
                .receive("error", (resp) => {
                    console.error("WebSocket connection failed", resp);
                });

            console.log("channel and socket = ", tmpSocket, tmpChannel)

            tmpChannel.on("game_update", (payload) => {
                console.log("Received game update:", payload);
                setGameState(payload.state);
            });

            setChannel(tmpChannel);
            setSocket(tmpSocket);
        } catch (error) {
            console.log(error)
        }
    }

    const handleLaunch = () => {
        navigate("/room");
    }

    const handleLeave = () => {
        resetConnection();
        navigate("/join");
    }

    const handleSetDeck = () => {
        console.log("About to set deck", channel, playerId, testDeck);
        callSetDeck(channel, playerId, testDeck);
    }

    return <div className="lobbyContainer">
        <RoomNavigationBar roomId={gameState.id} />
        <div className="center">
            <div className="lobby">
                <div className="playerListContainer">
                    <div className="titleLobby" >
                        Player List
                    </div>
                    <div className="playerList">
                        {gameState.players && Object.entries(gameState.players).map(
                            (player, index) => (
                                <div key={index} className="playerContainer">
                                    {player[0]}
                                </div>
                            ))}
                    </div>
                </div>
                <div className="buttonList">
                    <TCGMButton onClick={handleSetDeck}>Set Deck</TCGMButton>
                    <TCGMButton onClick={handleLaunch}>Launch</TCGMButton>
                    <TCGMButton onClick={handleLeave}>Leave</TCGMButton>

                </div>
            </div>
        </div>
    </div >
}

export default Lobby