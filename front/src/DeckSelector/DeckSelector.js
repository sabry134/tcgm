import { React, useRef, useState } from "react";
import { Box, Popper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { JoinRoomNavigationBar } from "../NavigationBar/JoinRoomNavigationBar";
import { LeftPanel } from "./Components/LeftPanel";
import { RightPanel } from "./Components/RightPanel";
import { DeckPicker } from "./Components/DeckPicker";
import { CreateGamePopupBody } from "./Components/CreateGamePopupBody";

const DeckSelector = () => {
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
            <JoinRoomNavigationBar navigate={navigate}/>

            <Box display="flex" flexGrow={1} bgcolor="#fff">
                <LeftPanel popupCallback={openPopup} />
                <Box
                    ref={spanRef}
                    className="main-area"
                    flexGrow={1}
                    bgcolor="#c4c4c4"
                    position="relative"
                >
                    <Popper id={id} open={open} anchorEl={anchor}>
                        <CreateGamePopupBody closeCallback={closePopup} />
                    </Popper>
                    <DeckPicker />
                </Box>

                <RightPanel />
            </Box>
        </Box>
    );
};

export default DeckSelector;