import React, { Component } from "react";
import { Box, Stack } from "@mui/material";
import { SidePanel } from "../RawComponents/SidePanel";
import { BaseTopBar } from "../NavigationBar/BaseTopBar";

type Props = {
  spanRef?: React.RefObject<HTMLSpanElement>;
  topBar: React.ReactNode;
  leftPanel?: React.ReactNode;
  centerPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
};

/**
 * BaseLayout component for displaying the default layout of the application
 * It wraps the topBar, leftPanel, centerPanel and rightPanel
 * @param {Object} props - The properties passed to the component
 * @param {React.RefObject<HTMLSpanElement>} [props.spanRef] - Optional reference used with the Popup component
 * @param {React.ReactNode} props.topBar - The top bar component
 * @param {React.ReactNode} [props.leftPanel] - The components to be displayed in the left panel (optional)
 * @param {React.ReactNode} [props.centerPanel] - The components to be displayed in the center panel (optional)
 * @param {React.ReactNode} [props.rightPanel] - The components to be displayed in the right panel (optional)
 *
 * @returns {JSX.Element} The rendered BaseLayout component
 * @example
 * <BaseLayout
 *  topBar={<MyTopBar />}
 *  leftPanel={<MyLeftPanel />}
 *  centerPanel={<MyCenterPanel />}
 *  rightPanel={<MyRightPanel />}
 * />
 */

export class BaseLayout extends Component<Props> {
  render() {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          bgcolor: "neutral.main",
        }}
      >
        {this.props.spanRef && <span ref={this.props.spanRef}/>}
        <BaseTopBar>
          {this.props.topBar}
        </BaseTopBar>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexGrow: 1,
            p: 1,
            bgcolor: "neutral.dark",
            overflowY: "auto",
          }}
        >

          {this.props.leftPanel && (
            <SidePanel>
              {this.props.leftPanel}
            </SidePanel>
          )}

          <Box
            sx={{
              boxShadow: 5,
              borderRadius: 2,
              bgcolor: "neutral.light",
              flexGrow: 1,
            }}
          >
            {this.props.centerPanel}
          </Box>

          {this.props.rightPanel && (
            <SidePanel>
              {this.props.rightPanel}
            </SidePanel>
          )}

        </Stack>
      </Box>
    );
  }
}