import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  Collapse
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CreditCardIcon from '@mui/icons-material/CreditCard'

const styles = {
  navbar: {
    backgroundColor: '#5d3a00',
    color: '#fff',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-around',
    userSelect: 'none'
  },
  navButton: { borderRadius: 0, userSelect: 'none' },
  navText: { color: '#fff', fontSize: '1.25rem', userSelect: 'none' }
}

const toTitleCase = str =>
  str
    .replace(/_/g, ' ')
    .replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )

const RuleEditor = () => {
  let API_BASE = process.env.REACT_APP_API_URL
  if (!API_BASE) {
    API_BASE = 'http://localhost:4000/api/'
  }

  const [rules, setRules] = useState([])
  const [newRuleName, setNewRuleName] = useState('')
  const [newRuleValue, setNewRuleValue] = useState(0)
  const [expandedRuleId, setExpandedRuleId] = useState(null)
  const [ruleEdits, setRuleEdits] = useState({})
  const [newPropInputs, setNewPropInputs] = useState({})

  const handleNewPropInput = (ruleId, field, value) => {
    setNewPropInputs(prev => ({
      ...prev,
      [ruleId]: {
        ...prev[ruleId],
        [field]: value
      }
    }))
  }

  const handleAddPlayerProperty = ruleId => {
    const inputs = newPropInputs[ruleId]
    if (!inputs?.name || isNaN(inputs.value))
      setRuleEdits(prev => {
        const existingProps = prev[ruleId]?.playerProps || []
        return {
          ...prev,
          [ruleId]: {
            ...prev[ruleId],
            playerProps: [
              ...existingProps,
              {
                id: `new-${Date.now()}`,
                property_name: inputs.name,
                value: Number(inputs.value),
                isNew: true
              }
            ]
          }
        }
      })

    setNewPropInputs(prev => ({
      ...prev,
      [ruleId]: { name: '', value: 0 }
    }))
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const res = await fetch(`${API_BASE}rules`)
      const data = await res.json()
      setRules(data)
      setExpandedRuleId(null)
    } catch (e) {
      console.error('Failed to fetch rules:', e)
    }
  }

  const handleCreateRule = async () => {
    const gameId = localStorage.getItem('gameSelected')
    if (!gameId) return alert('Game not found')

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
      })

      const gameRuleData = await gameRuleRes.json()
      if (!gameRuleRes.ok) throw new Error('Failed to create game rule')

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
      })

      const ruleData = await ruleRes.json()
      if (!ruleRes.ok) throw new Error('Failed to create rule')

      const defaultProps = [
        { name: 'health', value: 0 },
        { name: 'power', value: 0 }
      ]

      for (const prop of defaultProps) {
        await fetch(`${API_BASE}playerProperties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerProperty: {
              property_name: prop.name,
              value: prop.value,
              game_rule_id: gameRuleData.id
            }
          })
        })
      }

      setNewRuleName('')
      setNewRuleValue(0)
      fetchRules()
    } catch (error) { }
  }

  const handleDeleteRule = async ruleId => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return
    try {
      await fetch(`${API_BASE}rules/delete/${ruleId}`, {
        method: 'DELETE'
      })
      fetchRules()
    } catch (e) {
      alert('Failed to delete rule')
    }
  }

  const toggleExpand = async id => {
    setExpandedRuleId(prev => (prev === id ? null : id))
    if (expandedRuleId === id) return

    const rule = rules.find(r => r.id === id)
    if (!rule) return

    try {
      const gameRulesRes = await fetch(
        `${API_BASE}gameRules/gameRule/${rule.game_rule_id}`
      )
      const gameRules = await gameRulesRes.json()
      const gameRule = gameRules[0]

      const playerPropsRes = await fetch(
        `${API_BASE}playerProperties/playerProperty/${rule.game_rule_id}`
      )
      const playerProps = await playerPropsRes.json()

      setRuleEdits(prev => ({
        ...prev,
        [id]: {
          gameRule,
          playerProps
        }
      }))
    } catch {
      alert('Failed to fetch rule details')
    }
  }

  const handleSaveEdit = async ruleId => {
    const edit = ruleEdits[ruleId]

    try {
      const gameRuleId = rules.find(r => r.id === ruleId).game_rule_id

      await fetch(`${API_BASE}gameRules/${gameRuleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameRule: edit.gameRule })
      })

      for (const prop of edit.playerProps) {
        const isNew = prop.isNew || typeof prop.id === 'string'
        const url = isNew
          ? `${API_BASE}playerProperties`
          : `${API_BASE}playerProperties/${prop.id}`

        await fetch(url, {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerProperty: {
              property_name: prop.property_name,
              value: prop.value,
              game_rule_id: gameRuleId
            }
          })
        })
      }

      fetchRules()
      setExpandedRuleId(null)
    } catch {
      alert('Failed to save edits')
    }
  }

  const updateGameRuleField = (ruleId, field, value) => {
    setRuleEdits(prev => ({
      ...prev,
      [ruleId]: {
        ...prev[ruleId],
        gameRule: {
          ...prev[ruleId].gameRule,
          [field]: Number(value)
        }
      }
    }))
  }

  const updatePlayerPropField = (ruleId, index, value) => {
    setRuleEdits(prev => {
      const updatedProps = [...prev[ruleId].playerProps]
      updatedProps[index] = { ...updatedProps[index], value: Number(value) }
      return {
        ...prev,
        [ruleId]: {
          ...prev[ruleId],
          playerProps: updatedProps
        }
      }
    })
  }

  const brown = '#5d3a00'
  const brownLight = '#7a541c'
  const whiteText = '#fff'
  const whiteBorder = '#fff'

  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', pb: 4 }}>
      <Box sx={{ ...styles.navbar, backgroundColor: brown, color: whiteText }}>
        <Typography sx={{ color: whiteText, fontSize: '1.25rem', userSelect: 'none' }}>
          Rule Manager
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 4,
          mb: 4,
          px: 2
        }}
      >
        <Card
          sx={{
            backgroundColor: brown,
            color: whiteText,
            border: `1px solid ${whiteBorder}`,
            boxShadow: `0px 4px 12px ${brownLight}`,
            p: 3,
            width: 400
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ textAlign: 'center', color: whiteText, mb: 2 }}
            >
              Add New Rule
            </Typography>

            <TextField
              label="Rule Name"
              fullWidth
              variant="outlined"
              value={newRuleName}
              onChange={e => setNewRuleName(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: whiteText,
                  '& fieldset': {
                    borderColor: whiteBorder
                  },
                  '&:hover fieldset': {
                    borderColor: whiteBorder
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: whiteBorder
                  }
                },
                '& .MuiInputLabel-root': {
                  color: whiteText
                },
                '& .MuiInputBase-input': {
                  color: whiteText
                }
              }}
            />
            <TextField
              label="Rule Value"
              fullWidth
              variant="outlined"
              type="number"
              value={newRuleValue}
              onChange={e => setNewRuleValue(Number(e.target.value))}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: whiteText,
                  '& fieldset': {
                    borderColor: whiteBorder
                  },
                  '&:hover fieldset': {
                    borderColor: whiteBorder
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: whiteBorder
                  }
                },
                '& .MuiInputLabel-root': {
                  color: whiteText
                },
                '& .MuiInputBase-input': {
                  color: whiteText
                }
              }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateRule}
              sx={{
                mt: 1,
                bgcolor: brown,
                color: whiteText,
                fontWeight: 'bold',
                '&:hover': { bgcolor: brownLight }
              }}
            >
              Create Rule
            </Button>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          px: 2
        }}
      >
        {rules.map(rule => (
          <Card
            key={rule.id}
            sx={{
              backgroundColor: brown,
              color: whiteText,
              mb: 3,
              border:
                expandedRuleId === rule.id
                  ? `1px solid ${whiteBorder}`
                  : `1px solid transparent`,
              boxShadow:
                expandedRuleId === rule.id ? `0 0 12px ${brownLight}` : 'none',
              transition: 'all 0.3s ease',
              p: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography variant="h6" sx={{ userSelect: 'none', color: whiteText }}>
                {rule.rule_name} — {rule.value}
              </Typography>
              <Box>
                <IconButton
                  color="inherit"
                  onClick={() => toggleExpand(rule.id)}
                  size="large"
                  aria-label={`Edit ${rule.rule_name}`}
                  sx={{ color: whiteText }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={() => handleDeleteRule(rule.id)}
                  size="large"
                  aria-label={`Delete ${rule.rule_name}`}
                  sx={{ color: '#ff6666' }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Collapse in={expandedRuleId === rule.id} timeout="auto" unmountOnExit>
              {ruleEdits[rule.id] && (
                <Box sx={{ mt: 3 }}>
                  <Typography sx={{ fontWeight: 'bold', mb: 1, color: whiteText }}>
                    Game Rule
                  </Typography>
                  {ruleEdits[rule.id]?.gameRule &&
                    Object.entries(ruleEdits[rule.id].gameRule).map(
                      ([key, val]) =>
                        key !== 'id' &&
                        key !== 'game_id' &&
                        key !== 'public_template' &&
                        key !== 'inserted_at' &&
                        key !== 'updated_at' && (
                          <TextField
                            key={key}
                            label={toTitleCase(key)}
                            value={val}
                            type="number"
                            onChange={e =>
                              updateGameRuleField(rule.id, key, e.target.value)
                            }
                            fullWidth
                            sx={{
                              mb: 1,
                              '& .MuiOutlinedInput-root': {
                                color: whiteText,
                                '& fieldset': {
                                  borderColor: whiteBorder
                                },
                                '&:hover fieldset': {
                                  borderColor: whiteBorder
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: whiteBorder
                                }
                              },
                              '& .MuiInputLabel-root': {
                                color: whiteText
                              },
                              '& .MuiInputBase-input': {
                                color: whiteText
                              }
                            }}
                            variant="outlined"
                          />
                        )
                    )}


                  <Typography sx={{ fontWeight: 'bold', mt: 3, mb: 1, color: whiteText }}>
                    Player Properties
                  </Typography>
                  {ruleEdits[rule.id].playerProps.map((prop, idx) => (
                    <TextField
                      key={prop.id}
                      label={toTitleCase(prop.property_name)}
                      value={prop.value}
                      type="number"
                      onChange={e =>
                        updatePlayerPropField(rule.id, idx, e.target.value)
                      }
                      fullWidth
                      sx={{
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                          color: whiteText,
                          '& fieldset': {
                            borderColor: whiteBorder
                          },
                          '&:hover fieldset': {
                            borderColor: whiteBorder
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: whiteBorder
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: whiteText
                        },
                        '& .MuiInputBase-input': {
                          color: whiteText
                        }
                      }}
                      variant="outlined"
                    />
                  ))}

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                      label="Property Name"
                      value={newPropInputs[rule.id]?.name || ''}
                      onChange={e =>
                        handleNewPropInput(rule.id, 'name', e.target.value)
                      }
                      sx={{ flex: 1 }}
                      variant="outlined"
                      InputLabelProps={{ style: { color: whiteText } }}
                      inputProps={{ style: { color: whiteText } }}
                    />
                    <TextField
                      label="Value"
                      type="number"
                      value={newPropInputs[rule.id]?.value || ''}
                      onChange={e =>
                        handleNewPropInput(rule.id, 'value', e.target.value)
                      }
                      sx={{ width: 100 }}
                      variant="outlined"
                      InputLabelProps={{ style: { color: whiteText } }}
                      inputProps={{ style: { color: whiteText } }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleAddPlayerProperty(rule.id)}
                      sx={{
                        bgcolor: brown,
                        '&:hover': { bgcolor: brownLight },
                        color: whiteText,
                        fontWeight: 'bold'
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSaveEdit(rule.id)}
                    fullWidth
                    sx={{
                      mt: 2,
                      bgcolor: brown,
                      color: whiteText,
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: brownLight }
                    }}
                  >
                    Save
                  </Button>
                </Box>
              )}
            </Collapse>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default RuleEditor
