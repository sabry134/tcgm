import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TCGMCard } from "./Components/TCGMCard";
import { NavigationBar } from "../NavigationBar/NavigationBar";
import { LeftPanel } from "./Components/LeftPanel";
import { RightPanel } from "./Components/RightPanel";
import defaultData from "./Data/TestBack.json"

const CardEditor = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook



    useEffect(() => {
        document.title = "JCCE";

        // Check if localStorage already has Data
        if (!localStorage.getItem("currentEditedCard")) {
            localStorage.setItem("currentEditedCard", JSON.stringify(defaultData));
        }
    }, []);

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {/* Brown Banner with Menu */}
            <NavigationBar navigate={navigate} />

            {/* Main Content Area */}
            <Box display="flex" flexGrow={1} bgcolor="#fff">
                <LeftPanel />

                <Box
                    className="main-area"
                    flexGrow={1}
                    bgcolor="#c4c4c4"
                    position="relative"
                >
                    <TCGMCard />
                </Box>

                <RightPanel />
            </Box>
        </Box>
    );
};

export default CardEditor