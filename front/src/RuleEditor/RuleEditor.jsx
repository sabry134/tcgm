import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  Grid,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const styles = {
  navbar: {
    backgroundColor: '#5d3a00',
    color: '#fff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-around',
    userSelect: 'none'
  }
}

const RuleEditor = () => {
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/'
  const brown = '#5d3a00'
  const brownLight = '#7a541c'
  const whiteText = '#fff'

  const [gameRule, setGameRule] = useState({
    starting_hand_size: 0,
    max_hand_size: 0,
    draw_per_turn: 0,
    id: null
  })

  const [playerProps, setPlayerProps] = useState([])
  const [newPlayerPropName, setNewPlayerPropName] = useState('')
  const [newPlayerPropValue, setNewPlayerPropValue] = useState(0)
  const [editingPlayerPropId, setEditingPlayerPropId] = useState(null)
  const [editingPlayerPropName, setEditingPlayerPropName] = useState('')
  const [editingPlayerPropValue, setEditingPlayerPropValue] = useState(0)
  const [customRuleIds, setCustomRuleIds] = useState({})


  const [customRules, setCustomRules] = useState([])

  const [newRuleName, setNewRuleName] = useState('')
  const [newRuleValue, setNewRuleValue] = useState(0)

  const [editingCustomRuleId, setEditingCustomRuleId] = useState(null)
  const [editingCustomRuleName, setEditingCustomRuleName] = useState('')
  const [editingCustomRuleValue, setEditingCustomRuleValue] = useState(0)

  const [snackbar, setSnackbar] = useState({ open: false, message: '' })

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    content: '',
    onConfirm: null,
    onCancel: null
  })

  const gameId = localStorage.getItem('gameSelected')

  const fetchAndSetPlayerProps = async () => {
    try {
      const propsRes = await fetch(`${API_BASE}playerProperties`)
      if (!propsRes.ok) {
        throw new Error('Failed to fetch player properties')
      }
      const propsData = await propsRes.json()
      if (Array.isArray(propsData) && gameRule.id) {
        const filteredProps = propsData.filter(prop => prop.game_rule_id === gameRule.id)
        setPlayerProps(filteredProps)
      } else {
        setPlayerProps([])
      }
    } catch (error) {
      console.error(error)
      setPlayerProps([])
    }
  }

  const fetchCustomRules = async (currentGameRuleId) => {
    try {
      const rulesRes = await fetch(`${API_BASE}rules`)
      const rulesData = await rulesRes.json()
      const filteredCustomRules = rulesData.filter(
        r => r.game_rule_id !== currentGameRuleId && r.game_rule_id !== null
      )
      setCustomRules(filteredCustomRules)
    } catch (e) {
      console.error('Failed to fetch custom rules', e)
    }
  }

  useEffect(() => {
    if (!gameId) return;

    const loadGameRule = async () => {
      try {
        const res = await fetch(`${API_BASE}gameRules/gameRule/${gameId}`);
        const gameRulesData = await res.json();
        if (gameRulesData.length > 0) {
          const gr = gameRulesData[0];
          setGameRule(gr);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadGameRule();
  }, [gameId]);

  useEffect(() => {
    if (!gameRule.id) return;

    const fetchData = async () => {
      try {
        const propsRes = await fetch(`${API_BASE}playerProperties`);
        const propsData = await propsRes.json();
        const filteredProps = propsData.filter(p => p.game_rule_id === gameRule.id);
        setPlayerProps(filteredProps);

        const rulesRes = await fetch(`${API_BASE}rules`);
        const rulesData = await rulesRes.json();
        const filteredRules = rulesData.filter(r => r.game_rule_id !== gameRule.id && r.game_rule_id !== null);
        setCustomRules(filteredRules);
      } catch (e) {
        console.error(e);
        setPlayerProps([]);
        setCustomRules([]);
      }
    };

    fetchData();
  }, [gameRule.id]);


  const showSnackbar = (message) => {
    setSnackbar({ open: true, message })
  }

  const showConfirmDialog = ({ title, content, onConfirm, onCancel }) => {
    setConfirmDialog({
      open: true,
      title,
      content,
      onConfirm: () => {
        onConfirm()
        setConfirmDialog(prev => ({ ...prev, open: false }))
      },
      onCancel: () => {
        if (onCancel) onCancel()
        setConfirmDialog(prev => ({ ...prev, open: false }))
      }
    })
  }

  const handleGameRuleChange = (field, val) => {
    setGameRule(prev => ({
      ...prev,
      [field]: Number(val)
    }))
  }

  const saveGameRule = async () => {
    try {
      let res;
      let updatedGameRule = { ...gameRule };

      if (!gameRule.id) {
        res = await fetch(`${API_BASE}gameRules`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            gameRule: {
              ...gameRule,
              game_id: parseInt(gameId)
            }
          })
        });

        if (!res.ok) throw new Error('Failed to create game rule');
        const newGameRule = await res.json();

        setGameRule(newGameRule);
        updatedGameRule = newGameRule;
      } else {
        res = await fetch(`${API_BASE}gameRules/${gameRule.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameRule })
        });

        if (!res.ok) throw new Error('Failed to update game rule');
      }

      showSnackbar('Game Rule saved');
    } catch (e) {
      showSnackbar(e.message);
    }
  };


  const handleAddPlayerProperty = async () => {
    if (!newPlayerPropName.trim()) {
      showSnackbar('Enter a property name')
      return
    }
    try {
      const res = await fetch(`${API_BASE}playerProperties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerProperty: {
            property_name: newPlayerPropName,
            value: newPlayerPropValue,
            game_rule_id: gameRule.id
          }
        })
      })
      if (!res.ok) throw new Error('Failed to add player property')

      await fetchAndSetPlayerProps()

      setNewPlayerPropName('')
      setNewPlayerPropValue(0)
      showSnackbar('Player property added')
    } catch (e) {
      showSnackbar(e.message)
    }
  }

  const startEditPlayerProp = (prop) => {
    setEditingPlayerPropId(prop.id)
    setEditingPlayerPropName(prop.property_name)
    setEditingPlayerPropValue(prop.value)
  }

  const cancelEditPlayerProp = () => {
    setEditingPlayerPropId(null)
    setEditingPlayerPropName('')
    setEditingPlayerPropValue(0)
  }

  const saveEditedPlayerProp = async () => {
    if (!editingPlayerPropName.trim()) {
      showSnackbar('Property name cannot be empty')
      return
    }
    try {
      const res = await fetch(`${API_BASE}playerProperties/${editingPlayerPropId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerProperty: {
            property_name: editingPlayerPropName,
            value: editingPlayerPropValue,
            game_rule_id: gameRule.id
          }
        })
      })
      if (!res.ok) throw new Error('Failed to update player property')

      showSnackbar('Player property updated')
      cancelEditPlayerProp()
      fetchAndSetPlayerProps()
    } catch (e) {
      showSnackbar(e.message)
    }
  }

  const deletePlayerProp = async (id) => {
    showConfirmDialog({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this player property?',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}playerProperties/delete/${id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Failed to delete player property')

          showSnackbar('Player property deleted')
          fetchAndSetPlayerProps()
        } catch (e) {
          showSnackbar(e.message)
        }
      }
    })
  }

  const handleCreateCustomRule = async () => {
    if (!newRuleName.trim()) {
      showSnackbar('Enter a custom rule name');
      return;
    }

    try {
      const gameRuleRes = await fetch(`${API_BASE}gameRules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameRule: {
            starting_hand_size: 0,
            max_hand_size: 0,
            draw_per_turn: 0,
            game_id: parseInt(gameId)
          }
        })
      });

      const gameRuleData = await gameRuleRes.json();
      if (!gameRuleRes.ok) throw new Error('Failed to create game rule');

      const ruleRes = await fetch(`${API_BASE}rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rule: {
            rule_name: newRuleName,
            value: newRuleValue,
            game_rule_id: gameRuleData.id
          }
        })
      });

      const ruleData = await ruleRes.json();
      if (!ruleRes.ok) throw new Error('Failed to create custom rule');

      setCustomRuleIds(prev => ({ ...prev, [ruleData.rule_name]: ruleData.id }));

      setNewRuleName('');
      setNewRuleValue(0);
      showSnackbar('Custom rule added');
      fetchCustomRules(gameRule.id);
    } catch (e) {
      showSnackbar(e.message);
    }
  };



  const startEditCustomRule = rule => {
    setEditingCustomRuleId(rule.id)
    setEditingCustomRuleName(rule.rule_name)
    setEditingCustomRuleValue(rule.value)
  }

  const cancelEditCustomRule = () => {
    setEditingCustomRuleId(null)
    setEditingCustomRuleName('')
    setEditingCustomRuleValue(0)
  }

  const saveEditedCustomRule = async () => {
    if (!editingCustomRuleName.trim()) {
      showSnackbar('Rule name cannot be empty')
      return
    }
    try {
      console.log(gameRule.id)
      const ruleId = customRuleIds[editingCustomRuleName] || editingCustomRuleId;

      const res = await fetch(`${API_BASE}rules/${ruleId}`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rule: {
            rule_name: editingCustomRuleName,
            value: editingCustomRuleValue,
          }
        })
      })
      if (!res.ok) throw new Error('Failed to update custom rule')

      showSnackbar('Custom rule updated')
      cancelEditCustomRule()
      fetchCustomRules(gameRule.id)
    } catch (e) {
      showSnackbar(e.message)
    }
  }

  const deleteCustomRule = async id => {
    showConfirmDialog({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this custom rule?',
      onConfirm: async () => {
        try {
          const res = await fetch(`${API_BASE}rules/delete/${id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Failed to delete custom rule')

          showSnackbar('Custom rule deleted')
          fetchCustomRules(gameRule.id)
        } catch (e) {
          showSnackbar(e.message)
        }
      }
    })
  }

  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ ...styles.navbar, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', px: 2 }}>
        <Button
          onClick={() => window.history.back()}
          startIcon={<ArrowBackIcon />}
          sx={{ color: 'white', borderColor: 'white' }}
          variant="outlined"
        >
          Back
        </Button>

        <Typography
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '1.25rem',
            color: 'white',
          }}
        >
          Rule Manager
        </Typography>
      </Box>


      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: brown, color: whiteText, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Game Rule
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Starting Hand Size"
                  type="number"
                  fullWidth
                  value={gameRule.starting_hand_size}
                  onChange={e => handleGameRuleChange('starting_hand_size', e.target.value)}
                />
                <TextField
                  label="Max Hand Size"
                  type="number"
                  fullWidth
                  value={gameRule.max_hand_size}
                  onChange={e => handleGameRuleChange('max_hand_size', e.target.value)}
                />
                <TextField
                  label="Draw Per Turn"
                  type="number"
                  fullWidth
                  value={gameRule.draw_per_turn}
                  onChange={e => handleGameRuleChange('draw_per_turn', e.target.value)}
                />
                <Button variant="contained" sx={{ bgcolor: brownLight }} onClick={saveGameRule}>
                  Save Game Rule
                </Button>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: brown, color: whiteText, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Player Properties
              </Typography>
              <Stack spacing={2} mb={3}>
                <TextField
                  label="New Property Name"
                  value={newPlayerPropName}
                  onChange={e => setNewPlayerPropName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Value"
                  type="number"
                  value={newPlayerPropValue}
                  onChange={e => setNewPlayerPropValue(Number(e.target.value))}
                  fullWidth
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: brownLight }}
                  onClick={handleAddPlayerProperty}
                  disabled={!newPlayerPropName.trim()}
                >
                  Add Player Property
                </Button>
              </Stack>

              <List sx={{ bgcolor: '#3f2f00', borderRadius: 1 }}>
                {playerProps.map((prop) =>
                  editingPlayerPropId === prop.id ? (
                    <ListItem key={prop.id} sx={{ bgcolor: '#523f00' }}>
                      <TextField
                        label="Property Name"
                        value={editingPlayerPropName}
                        onChange={e => setEditingPlayerPropName(e.target.value)}
                        sx={{ mr: 2, bgcolor: 'white', borderRadius: 1, flexGrow: 1 }}
                        size="small"
                      />
                      <TextField
                        label="Value"
                        type="number"
                        value={editingPlayerPropValue}
                        onChange={e => setEditingPlayerPropValue(Number(e.target.value))}
                        sx={{ mr: 2, bgcolor: 'white', borderRadius: 1, width: 100 }}
                        size="small"
                      />
                      <Button
                        variant="contained"
                        onClick={saveEditedPlayerProp}
                        sx={{ mr: 1 }}
                        size="small"
                      >
                        Save
                      </Button>
                      <Button variant="outlined" onClick={cancelEditPlayerProp} size="small">
                        Cancel
                      </Button>
                    </ListItem>
                  ) : (
                    <ListItem
                      key={prop.id}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => startEditPlayerProp(prop)}
                            sx={{ color: whiteText }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deletePlayerProp(prop.id)}
                            sx={{ color: '#ff6666' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                      sx={{ bgcolor: '#3f2f00', mb: 1, borderRadius: 1 }}
                    >
                      <ListItemText
                        primary={`${prop.property_name} — ${prop.value}`}
                        primaryTypographyProps={{ color: whiteText }}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: brown, color: whiteText, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Custom Rules
              </Typography>
              <Stack spacing={2} mb={3}>
                <TextField
                  label="Custom Rule Name"
                  value={newRuleName}
                  onChange={e => setNewRuleName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Value"
                  type="number"
                  value={newRuleValue}
                  onChange={e => setNewRuleValue(Number(e.target.value))}
                  fullWidth
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: brownLight }}
                  onClick={handleCreateCustomRule}
                  disabled={!newRuleName.trim()}
                >
                  Add Custom Rule
                </Button>
              </Stack>

              <List sx={{ bgcolor: '#3f2f00', borderRadius: 1 }}>
                {customRules.map(rule =>
                  editingCustomRuleId === rule.id ? (
                    <ListItem key={rule.id} sx={{ bgcolor: '#523f00' }}>
                      <TextField
                        label="Rule Name"
                        value={editingCustomRuleName}
                        onChange={e => setEditingCustomRuleName(e.target.value)}
                        sx={{ mr: 2, bgcolor: 'white', borderRadius: 1, flexGrow: 1 }}
                        size="small"
                      />
                      <TextField
                        label="Value"
                        type="number"
                        value={editingCustomRuleValue}
                        onChange={e => setEditingCustomRuleValue(Number(e.target.value))}
                        sx={{ mr: 2, bgcolor: 'white', borderRadius: 1, width: 100 }}
                        size="small"
                      />
                      <Button
                        variant="contained"
                        onClick={saveEditedCustomRule}
                        sx={{ mr: 1 }}
                        size="small"
                      >
                        Save
                      </Button>
                      <Button variant="outlined" onClick={cancelEditCustomRule} size="small">
                        Cancel
                      </Button>
                    </ListItem>
                  ) : (
                    <ListItem
                      key={rule.id}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => startEditCustomRule(rule)}
                            sx={{ color: whiteText }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => deleteCustomRule(rule.id)}
                            sx={{ color: '#ff6666' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                      sx={{ bgcolor: '#3f2f00', mb: 1, borderRadius: 1 }}
                    >
                      <ListItemText
                        primary={`${rule.rule_name} — ${rule.value}`}
                        primaryTypographyProps={{ color: whiteText }}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDialog.onCancel || (() => setConfirmDialog(prev => ({ ...prev, open: false })))}>Cancel</Button>
          <Button onClick={confirmDialog.onConfirm} autoFocus color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RuleEditor
