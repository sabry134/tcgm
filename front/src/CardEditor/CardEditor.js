import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TCGMCard } from "./components/TCGMCard";
import { NavigationBar } from "./../NavigationBar";
import { LeftPanel } from "./components/LeftPanel";
import { RightPanel } from "./components/RightPanel";
import defaultData from "./data/TestBack.json"

const CardEditor = () => {
    const navigate = useNavigate();



    useEffect(() => {
        document.title = "JCCE";

        if (!localStorage.getItem("currentEditedCard")) {
            localStorage.setItem("currentEditedCard", JSON.stringify(defaultData));
        }
    }, []);

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <NavigationBar navigate={navigate} />

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