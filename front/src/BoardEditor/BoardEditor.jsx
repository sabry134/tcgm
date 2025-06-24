import React, { Component } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import debounce from "lodash/debounce";
import { withRouterProps } from "../Utility/hocNavigation";
import { BaseLayout } from "../Components/Layouts/BaseLayout";
import { TopBarIconButton, TopBarTextButton } from "../Components/TopBar/TopBarButton";
import { Close } from "@mui/icons-material";
import { ROUTES } from "../Routes/routes";
import { TopBarButtonGroup } from "../Components/TopBar/TopBarButtonGroup";
import { TCGMButton } from "../Components/RawComponents/TCGMButton";
import { unselectGame } from "../Utility/navigate";

const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
const CANVAS_MARGIN = 10;
const MAX_NAME_LENGTH = 30;
const LIVE_FIELDS = ["name", "x", "y", "borderRadius"];

class BoardEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scenes: [],
      selectedScene: "",
      cards: [],
      buttons: [],
      zones: [],
      selectedZoneId: null,
      isDragging: false,
      tableBackground: null,
      inputs: {
        name: "",
        width: "",
        height: "",
        x: "",
        y: "",
        borderRadius: "",
      },
    };

    this.dragOffset = { x: 0, y: 0 };
    this.canvasRef = React.createRef();
    this.frameRef = null;
    this.pendingRef = {};
    this.persist = debounce(this.persistData, 500);
    this.fileInputRef = React.createRef();
  }

  componentDidMount() {
    const scenes = JSON.parse(localStorage.getItem("scenes")) || [];
    if (scenes.length) {
      this.setState({ scenes, selectedScene: scenes[0] });
    }
    document.title = "JCCE";
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  componentDidUpdate(_, prevState) {
    const { scenes, selectedScene, cards, buttons, zones, tableBackground } = this.state;

    if (prevState.scenes !== scenes) {
      localStorage.setItem("scenes", JSON.stringify(scenes));
    }

    if (prevState.selectedScene !== selectedScene && selectedScene) {
      const saved = JSON.parse(sessionStorage.getItem(selectedScene)) || {};
      this.setState({
        cards: saved.cards || [],
        buttons: saved.buttons || [],
        zones: saved.zones || [],
        tableBackground: saved.tableBackground || null,
      });
    }

    if (
      prevState.cards !== cards ||
      prevState.buttons !== buttons ||
      prevState.zones !== zones ||
      prevState.tableBackground !== tableBackground
    ) {
      this.persist(selectedScene, { cards, buttons, zones, tableBackground });
    }

    if (prevState.selectedZoneId !== this.state.selectedZoneId) {
      const selectedZone = this.state.zones.find((z) => z.id === this.state.selectedZoneId);
      if (selectedZone) {
        this.setState({
          inputs: {
            name: selectedZone.name,
            width: String(selectedZone.width),
            height: String(selectedZone.height),
            x: String(selectedZone.x),
            y: String(selectedZone.y),
            borderRadius: String(selectedZone.borderRadius),
          },
        });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleButtonClick = () => {
    this.fileInputRef.current.click();
  }

  persistData = (sceneKey, data) => {
    sessionStorage.setItem(sceneKey, JSON.stringify(data));
  };

  handleMouseDown = (e, zone) => {
    e.stopPropagation();
    const rect = this.canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    this.setState({ selectedZoneId: zone.id, isDragging: true });
    this.dragOffset = {
      x: e.clientX - rect.left - zone.x,
      y: e.clientY - rect.top - zone.y,
    };
  };

  handleMouseMove = (e) => {
    const { isDragging, selectedZoneId, zones } = this.state;
    if (!isDragging || selectedZoneId == null) return;
    const rect = this.canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const origin = zones.find((z) => z.id === selectedZoneId);
    if (!origin) return;

    const rawX = e.clientX - rect.left - this.dragOffset.x;
    const rawY = e.clientY - rect.top - this.dragOffset.y;
    this.pendingRef = {
      x: clamp(rawX, 0, rect.width - origin.width - CANVAS_MARGIN),
      y: clamp(rawY, 0, rect.height - origin.height - CANVAS_MARGIN),
    };
    if (!this.frameRef) {
      this.frameRef = requestAnimationFrame(() => {
        this.updateSymmetric(selectedZoneId, this.pendingRef);
        this.frameRef = null;
      });
    }
  };

  handleMouseUp = () => {
    this.setState({ isDragging: false });
  };

  updateSymmetric = (id, newProps) => {
    this.setState((prevState) => {
      const zones = [...prevState.zones];
      const origin = zones.find((z) => z.id === id);
      if (!origin) return { zones };
      const twin = zones.find((z) => z.pairId === origin.pairId && z.id !== id);
      const rect = this.canvasRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
      if (!twin) return { zones };

      let x = clamp(
        newProps.x ?? origin.x,
        0,
        rect.width - (newProps.width ?? origin.width) - CANVAS_MARGIN
      );
      let y = clamp(
        newProps.y ?? origin.y,
        0,
        rect.height - (newProps.height ?? origin.height) - CANVAS_MARGIN
      );
      let width = clamp(
        newProps.width ?? origin.width,
        100,
        rect.width - x - CANVAS_MARGIN
      );
      let height = clamp(
        newProps.height ?? origin.height,
        100,
        rect.height - y - CANVAS_MARGIN
      );

      const br = newProps.borderRadius ?? origin.borderRadius;
      const name = newProps.name ?? origin.name;

      const half = rect.height / 2;
      const isBottom = origin.id < twin.id;
      if (isBottom) y = Math.max(y, half + 1);
      else y = Math.min(y, half - height - 1);

      const mirrorY = clamp(
        rect.height - y - height,
        0,
        rect.height - height - CANVAS_MARGIN
      );

      const updatedOrigin = { ...origin, x, y, width, height, borderRadius: br, name };
      const updatedTwin = {
        ...twin,
        x: rect.width - x - width,
        y: mirrorY,
        width,
        height,
        borderRadius: br,
        name: twin.name,
      };

      return {
        zones: zones.map((z) =>
          z.id === updatedOrigin.id ? updatedOrigin : z.id === updatedTwin.id ? updatedTwin : z
        ),
      };
    });
  };

  addZone = () => {
    const rect = this.canvasRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
    const dx = clamp(rect.width / 2 - 50, 0, rect.width - 100 - CANVAS_MARGIN);
    const half = rect.height / 2;
    const offset = 50;
    const bottomY = clamp(half + offset, 0, rect.height - 100 - CANVAS_MARGIN);
    const topY = clamp(half - offset - 100, 0, rect.height - 100 - CANVAS_MARGIN);
    const pairId = Date.now();
    const idx = Math.floor(this.state.zones.length / 2) + 1;

    const bottom = {
      id: pairId,
      pairId,
      name: `Zone ${idx}`,
      x: dx,
      y: bottomY,
      width: 100,
      height: 100,
      borderRadius: 0,
      background: null
    };
    const top = {
      id: pairId + 1,
      pairId,
      name: `[OPPONENT] Zone ${idx}`,
      x: dx,
      y: topY,
      width: 100,
      height: 100,
      borderRadius: 0,
      background: null
    };
    this.setState((prevState) => ({
      zones: [...prevState.zones, bottom, top],
      selectedZoneId: bottom.id,
    }));
  };

  deleteZone = () => {
    const { selectedZoneId, zones } = this.state;
    if (!selectedZoneId) return;
    const pid = zones.find((z) => z.id === selectedZoneId)?.pairId;
    if (pid == null) return;
    this.setState((prevState) => ({
      zones: prevState.zones.filter((z) => z.pairId !== pid),
      selectedZoneId: null,
    }));
  };

  handleFieldChange = (field, raw) => {
    this.setState((prevState) => ({
      inputs: { ...prevState.inputs, [field]: raw },
    }));
    const selectedZone = this.state.zones.find((z) => z.id === this.state.selectedZoneId);
    if (!selectedZone) return;
    if (LIVE_FIELDS.includes(field)) {
      if (field === "name") {
        const name = raw.slice(0, MAX_NAME_LENGTH);
        this.updateSymmetric(this.state.selectedZoneId, { name });
      } else {
        const v = parseInt(raw, 10);
        if (isNaN(v)) return;
        this.updateSymmetric(this.state.selectedZoneId, { [field]: v });
      }
    }
  };

  handleFieldBlur = (field) => {
    const selectedZone = this.state.zones.find((z) => z.id === this.state.selectedZoneId);
    if (!selectedZone) return;
    if (LIVE_FIELDS.includes(field)) return;
    const rect = this.canvasRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
    let props = {};
    const v = parseInt(this.state.inputs[field], 10);
    if (isNaN(v)) {
      this.setState((prevState) => ({
        inputs: { ...prevState.inputs, [field]: String(selectedZone[field]) },
      }));
      return;
    }
    if (field === "width") props.width = clamp(v, 100, rect.width - selectedZone.x - CANVAS_MARGIN);
    else if (field === "height") props.height = clamp(v, 100, rect.height - selectedZone.y - CANVAS_MARGIN);
    this.updateSymmetric(this.state.selectedZoneId, props);
  };

  handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (this.state.selectedZoneId) {
      this.setState((prevState) => ({
        zones: prevState.zones.map((z) => {
          if (z.id === prevState.selectedZoneId) {
            if (z.background) URL.revokeObjectURL(z.background);
            return { ...z, background: url };
          }
          return z;
        }),
      }));
    } else {
      if (this.state.tableBackground) URL.revokeObjectURL(this.state.tableBackground);
      this.setState({ tableBackground: url });
    }
  };

  handleDeleteBackground = () => {
    if (this.state.selectedZoneId) {
      this.setState((prevState) => ({
        zones: prevState.zones.map((z) =>
          z.id === prevState.selectedZoneId ? { ...z, background: null } : z
        ),
      }));
    } else {
      if (this.state.tableBackground) URL.revokeObjectURL(this.state.tableBackground);
      this.setState({ tableBackground: null });
    }
  };

  render() {
    const { zones, selectedZoneId, tableBackground, inputs } = this.state;
    const selectedZone = zones.find((z) => z.id === selectedZoneId);

    return (
      <BaseLayout
        topBar={
          <TopBarButtonGroup>
            <TopBarIconButton
              event={() => unselectGame(this.props.navigate)}
              svgComponent={Close}
              altText="Unselect Game"
            />
            <TopBarTextButton
              title="Edit Card"
              altText="Edit card"
              event={() => this.props.navigate(ROUTES.CARD_EDITOR)}
            />
            <TopBarTextButton
              title="Edit Type"
              altText="Edit card type"
              event={() => this.props.navigate(ROUTES.TYPE_EDITOR)}
            />
          </TopBarButtonGroup>
        }

        centerPanel={
          <Box
            ref={this.canvasRef}
            sx={{
              flex: 1,
              position: "relative",
              bgcolor: tableBackground ? undefined : "neutral",
              backgroundImage: tableBackground ? `url(${tableBackground})` : undefined,
              backgroundSize: "cover",
              touchAction: "none",
            }}
            onMouseDown={() => this.setState({ selectedZoneId: null })}
          >
            {zones.map((z) => (
              <Box
                key={z.id}
                onMouseDown={(e) => this.handleMouseDown(e, z)}
                sx={{
                  position: "absolute",
                  left: z.x,
                  top: z.y,
                  width: z.width,
                  height: z.height,
                  border: z.id === selectedZoneId ? "2px solid #ff5722" : "2px dashed #333",
                  bgcolor: z.background ? undefined : "rgba(255,255,255,0.3)",
                  backgroundImage: z.background ? `url(${z.background})` : undefined,
                  backgroundSize: "cover",
                  borderRadius: z.borderRadius,
                  cursor: "move",
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    userSelect: "none",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    maxWidth: "100%",
                  }}
                >
                  {z.name}
                </Typography>
              </Box>
            ))}
          </Box>
        }

        rightPanel={
          <>
            <Typography variant="h6" color={"primary.contrastText"}>
              Zones Editor
            </Typography>

            <TCGMButton
              onClick={this.handleButtonClick}
              text={selectedZoneId ? "Upload Zone Background" : "Upload Table Background"}
            />
            <input
              type="file"
              ref={this.fileInputRef}
              hidden
              onChange={this.handleBackgroundUpload}
            />

            <TCGMButton
              onClick={this.handleDeleteBackground}
              text={selectedZoneId ? "Delete Zone Background" : "Delete Table Background"}
            />

            <TCGMButton
              onClick={this.addZone}
              text="Add Zone Pair"
            />

            {
              selectedZone && (
                <Button variant="outlined" color="error" onClick={this.deleteZone}>
                  Delete Zone Pair
                </Button>
              )
            }

            {
              selectedZone ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {["name", "width", "height", "x", "y", "borderRadius"].map((field) => (
                    <TextField
                      key={field}
                      label={field}
                      variant="filled"
                      size="small"
                      value={inputs[field]}
                      onChange={(e) => this.handleFieldChange(field, e.target.value)}
                      onBlur={() => this.handleFieldBlur(field)}
                      type={LIVE_FIELDS.includes(field) ? (field === "name" ? "text" : "number") : "number"}
                      slotProps={{
                        input: {
                          maxLength: field === "name" ? MAX_NAME_LENGTH : undefined,
                          style: {
                            background : "#fff",
                            userSelect: field === "name" ? "text" : "none",
                          }
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <Typography color={"primary.contrastText"}>
                  Select a zone to edit
                </Typography>
              )
            }
          </>
        }
      />
    );
  }
}

export default withRouterProps(BoardEditor);