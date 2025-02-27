import React, { useState, useEffect } from "react";
import {
    Button,
    Box,
    Paper,
    Card,
    IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { NavigationBar } from "../Components/NavigationBar/NavigationBar";
const Templates = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const [scenes, setScenes] = useState([]);
    const [selectedScene, setSelectedScene] = useState("");
    const [cards, setCards] = useState([]);
    const [buttons, setButtons] = useState([]);

    // Load scenes and their respective data (cards and buttons) from localStorage and sessionStorage
    useEffect(() => {
        const savedScenes = JSON.parse(localStorage.getItem("scenes")) || [];
        if (savedScenes.length > 0) {
            setScenes(savedScenes);
            setSelectedScene(savedScenes[0]); // Default to the first scene
        }
    }, []);

    useEffect(() => {
        if (selectedScene) {
            const savedSceneData = JSON.parse(
                sessionStorage.getItem(selectedScene)
            ) || { cards: [], buttons: [] };
            setCards(savedSceneData.cards);
            setButtons(savedSceneData.buttons);
        }
    }, [selectedScene]);

    // Save scene data (cards and buttons) for the selected scene to sessionStorage
    useEffect(() => {
        if (selectedScene) {
            sessionStorage.setItem(selectedScene, JSON.stringify({ cards, buttons }));
        }
    }, [cards, buttons, selectedScene]);

    // Save scenes to localStorage whenever they change
    useEffect(() => {
        if (scenes.length > 0) {
            localStorage.setItem("scenes", JSON.stringify(scenes));
        }
    }, [scenes]);

    useEffect(() => {
        document.title = "JCCE";
    }, []);

    const handleCardMouseDown = (event, id) => {
        const card = cards.find((c) => c.id === id);
        const offsetX = event.clientX - card.x;
        const offsetY = event.clientY - card.y;

        const mainArea = document.querySelector(".main-area");
        const mainAreaRect = mainArea.getBoundingClientRect();

        const handleMouseMove = (moveEvent) => {
            let newX = moveEvent.clientX - offsetX;
            let newY = moveEvent.clientY - offsetY;

            newX = Math.max(0, Math.min(newX, mainAreaRect.width - 150));
            newY = Math.max(0, Math.min(newY, mainAreaRect.height - card.height));

            setCards((prevCards) =>
                prevCards.map((card) =>
                    card.id === id ? { ...card, x: newX, y: newY } : card
                )
            );
        };

        const handleMouseUp = () => {
            sessionStorage.setItem(selectedScene, JSON.stringify({ cards, buttons }));
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleButtonMouseDown = (event, id) => {
        const button = buttons.find((b) => b.id === id);
        const offsetX = event.clientX - button.x;
        const offsetY = event.clientY - button.y;

        const mainArea = document.querySelector(".main-area");
        const mainAreaRect = mainArea.getBoundingClientRect();

        const handleMouseMove = (moveEvent) => {
            let newX = moveEvent.clientX - offsetX;
            let newY = moveEvent.clientY - offsetY;

            newX = Math.max(0, Math.min(newX, mainAreaRect.width - 150));
            newY = Math.max(0, Math.min(newY, mainAreaRect.height - 50));

            const updatedButtons = buttons.map((button) =>
                button.id === id ? { ...button, x: newX, y: newY } : button
            );

            setButtons(updatedButtons);
            sessionStorage.setItem(
                selectedScene,
                JSON.stringify({ cards, buttons: updatedButtons })
            );
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const deleteCard = (id) => {
        setCards(cards.filter((card) => card.id !== id));
    };

    const deleteButton = (id) => {
        setButtons(buttons.filter((button) => button.id !== id));
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {/* Brown Banner with Menu */}
            <NavigationBar navigate={navigate}></NavigationBar>


            {/* Main Content Area */}
            <Box display="flex" flexGrow={1} bgcolor="#fff">
                <Paper
                    className="sidebar"
                    sx={{
                        width: 250,
                        p: 2,
                        bgcolor: "#5d3a00",
                        color: "white",
                        borderRadius: 0,
                    }}
                >
                </Paper>

                <Box
                    className="main-area"
                    flexGrow={1}
                    bgcolor="#c4c4c4"
                    position="relative"
                >
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            sx={{
                                width: 150,
                                height: card.height,
                                position: "absolute",
                                left: card.x,
                                top: card.y,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                cursor: "grab",
                                p: 2,
                                bgcolor: "white",
                                borderRadius: 0,
                            }}
                            onMouseDown={(e) => handleCardMouseDown(e, card.id)}
                        >
                            <Box sx={{ flexGrow: 1 }} />
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => deleteCard(card.id)}
                                sx={{ mt: 2, borderRadius: 0 }}
                            >
                                Delete Card
                            </Button>
                        </Card>
                    ))}

                    {buttons.map((button) => (
                        <Box
                            key={button.id}
                            sx={{
                                position: "absolute",
                                left: button.x,
                                top: button.y,
                                borderRadius: 0,
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{
                                    marginBottom: 2,
                                    borderRadius: 0,
                                }}
                                onMouseDown={(e) => handleButtonMouseDown(e, button.id)} // Enable dragging for buttons
                            >
                                {button.label}
                            </Button>
                            <IconButton
                                onClick={() => deleteButton(button.id)}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    borderRadius: 0,
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <Paper
                    className="settings"
                    sx={{
                        width: 250,
                        p: 2,
                        bgcolor: "#5d3a00",
                        color: "white",
                        borderRadius: 0,
                    }}
                >
                </Paper>
            </Box>
        </Box>
    );
};

export default Templates;
