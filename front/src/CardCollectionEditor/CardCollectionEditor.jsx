import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from "@mui/material";
import {
  createCardCollectionGroupRequest,
  updateCardCollectionGroupRequest,
  getCardCollectionGroupsForGameRequest,
  getCardCollectionGroupTypesRequest,
  deleteCardCollectionGroupRequest
} from "../Api/cardCollectionGroupRequests";
import { getCardTypesByGameRequest } from "../Api/cardTypesRequest";

const CardCollectionEditor = () => {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    id: null,
    name: "",
    max_cards: "",
    min_cards: "",
    max_copies: "",
    allowed_card_types: [],
    collection_type: "",
    game_id: 0,
    share_max_copies: false
  });
  const [cardTypes, setCardTypes] = useState([]);
  const [collectionTypes, setCollectionTypes] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    //const game_id = localStorage.getItem("gameSelected");
    const game_id = 527; // For testing purposes, replace with actual game ID
    if (!game_id) {
      console.error("Game ID not found in local storage");
      return;
    }
  
    try {
      const response = await getCardCollectionGroupsForGameRequest(game_id);
    
      if (!response) {
        console.error("Response is undefined. No data received.");
        setItems([]);
        return;
      }
    
      if (response.status === 404) {
        console.warn("No card collection groups found for this game.");
        setItems([]);
        return;
      }
    
      console.log("Fetched items:", response);
      setItems(response);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  async function fetchCollectionTypes() {
    try {
      const response = await getCardCollectionGroupTypesRequest();
      console.log("Fetched collection types:", response);
      setCollectionTypes(response);
    } catch (error) {
      console.error("Error fetching collection types:", error);
    }
  };

  async function fetchCardTypes() {
    try {
        //const game_id = localStorage.getItem("gameSelected");
        const game_id = 527; // For testing purposes, replace with actual game ID
        if (!game_id) {
          console.error("Game ID not found in local storage");
          return;
        }
        if (!cardTypes.length) {
          const response = await getCardTypesByGameRequest(game_id);
          console.log("Fetched card types:", response);
          setCardTypes(response);
          return;
        }
    } catch (error) {
        console.error("Error fetching card types:", error);
        return;
    }
  };

  const openModal = async (item = {
    id: null,
    name: "",
    max_cards: "",
    min_cards: "",
    max_copies: "",
    allowed_card_types: [],
    collection_type: "",
    share_max_copies: false
  }) => {
    setIsEditing(!!item.id);
    setCurrentItem(item);

    await fetchCardTypes();
    await fetchCollectionTypes();

    setModalOpen(true);
  };

  const closeModal = () => {
    setCurrentItem({
      id: null,
      name: "",
      max_cards: "",
      min_cards: "",
      max_copies: "",
      allowed_card_types: [],
      collection_type: ""
    });
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    // const game_id = localStorage.getItem("gameSelected");
    currentItem.game_id = 527; // For testing purposes, replace with actual game ID
    const submission = {
      group: currentItem,
    }
    if (isEditing) {
      await updateCardCollectionGroupRequest(currentItem.id, submission);
    } else {
      await createCardCollectionGroupRequest(submission);
    }
    fetchItems();
    closeModal();
  };

  const handleDelete = async (id) => {
    await deleteCardCollectionGroupRequest(id);
    alert("Item deleted successfully");
    fetchItems();
    closeModal();
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Card Collection Groups</Typography>
        <Button variant="contained" onClick={() => openModal()}>Create</Button>
      </Box>
  
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Box mt={2} display="flex" gap={1}>
                  <Button size="small" variant="outlined" onClick={() => openModal(item)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
  
      {/* Modal for creating or editing card collection groups */}
      <Dialog open={modalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{isEditing ? "Edit Card Collection Group" : "Create Card Collection Group"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={currentItem.name}
            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Max Cards"
            type="number"
            value={currentItem.max_cards}
            onChange={(e) => setCurrentItem({ ...currentItem, max_cards: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Min Cards"
            type="number"
            value={currentItem.min_cards}
            onChange={(e) => setCurrentItem({ ...currentItem, min_cards: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Max Copies"
            type="number"
            value={currentItem.max_copies}
            onChange={(e) => setCurrentItem({ ...currentItem, max_copies: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!currentItem.share_max_copies} // Ensure `checked` is always a boolean
                onChange={(e) => setCurrentItem({ ...currentItem, share_max_copies: e.target.checked })}
              />
            }
            label="Share Max Copies"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Collection Type</InputLabel>
            <Select
              value={currentItem.collection_type}
              onChange={(e) => setCurrentItem({ ...currentItem, collection_type: e.target.value })}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {collectionTypes.map((type, index) => (
                <MenuItem key={index} value={type.name}>{type.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>Allowed Card Types:</Typography>
            {cardTypes.map((type) => (
              <FormControlLabel
              key={type.id}
              control={
                <Checkbox
                  checked={currentItem.allowed_card_types.includes(type.id)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...currentItem.allowed_card_types, type.id]
                      : currentItem.allowed_card_types.filter((id) => id !== type.id);
                    setCurrentItem({ ...currentItem, allowed_card_types: updated });
                  }}
                />
              }
              label={type.name} // Display the name as the label
            />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CardCollectionEditor;
