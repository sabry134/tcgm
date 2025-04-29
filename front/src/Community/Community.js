import { React, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MainNavigationBar } from "../NavigationBar/MainNavigationBar";
import { LeftPanel } from "./Components/LeftPanel";
import { RightPanel } from "./Components/RightPanel";
import { CommunityGamePicker } from "./Components/CommunityGamePicker";
import { Popup } from "../Components/Popup/Popup";

const Community = () => {
    const navigate = useNavigate();
    const [anchor, setAnchor] = useState(null);
    const spanRef = useRef()

    const openPopup = () => {
        setAnchor(anchor ? null : spanRef);
    };

    const closePopup = () => {
        setAnchor(null)
    }

    const open = Boolean(anchor);
    const id = open ? 'simple-popper' : undefined;

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <MainNavigationBar navigate={navigate} />

            <Box display="flex" flexGrow={1} bgcolor="#fff">
                <LeftPanel popupCallback={openPopup} />
                <Box
                    ref={spanRef}
                    className="main-area"
                    flexGrow={1}
                    bgcolor="#c4c4c4"
                    position="relative"
                >
                    <Popup
                      id={id}
                      open={open}
                      anchorEl={anchor}
                      closeCallback={closePopup}
                    />
                    <CommunityGamePicker />
                </Box>

                <RightPanel />
            </Box>
        </Box>
    );
};

export default Community