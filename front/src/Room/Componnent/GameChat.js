import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import SendIcon from "@mui/icons-material/Send";



const GameChat = ({ playerId }) => {

    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");


    const handleSendMessage = () => {
        if (chatInput.trim() !== "") {
            setChatMessages([...chatMessages, { sender: playerId, text: chatInput }]);
            setChatInput("");
        }
    };

    const handleChatKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    return <Box sx={{
        position: "absolute",
        top: 70,
        right: 10,
        width: 300,
        height: 500,
        border: "1px solid gray",
        borderRadius: "4px",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
    }}>
        <Box sx={{ height: "70%", overflowY: "auto", padding: "8px" }}>
            {chatMessages.map((msg, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                        {msg.sender}:
                    </Typography>
                    <Typography variant="body2">{msg.text}</Typography>
                </Box>
            ))}
        </Box>
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderTop: "1px solid #ccc",
                padding: "4px 8px",
                marginTop: "auto",
            }}
        >
            <TextField
                fullWidth
                placeholder="Enter your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
                size="small"
                variant="outlined"
            />
            <IconButton onClick={handleSendMessage} color="primary">
                <SendIcon />
            </IconButton>
        </Box>
    </Box>
}
export default GameChat