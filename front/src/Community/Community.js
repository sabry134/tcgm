import React from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NavigationBar } from "./../NavigationBar";
import { LeftPanel } from "./Components/LeftPanel";
import { RightPanel } from "./Components/RightPanel";
import { CommunityGamePicker } from "./Components/CommunityGamePicker";

const Community = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

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
                    <CommunityGamePicker />
                </Box>

                <RightPanel />
            </Box>
        </Box>
    );
};

export default Community