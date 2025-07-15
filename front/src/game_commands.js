export const callSetDeck = (channel, playerId, deck) => {
  console.log("setDeck called with channel:", channel, "playerId:", playerId, "deck:", deck);
  if (channel && playerId) {
    channel.push("set_deck", { player_id: playerId, deck: deck })
      .receive("ok", response => {
        console.log("set_deck", response);
        return true;
      })
      .receive("error", response => {
        console.error("Error inserting card:", response);
        return false;
      });
  }
  return false;
};

export const callDrawCard = (channel, playerId, amount) => {
  console.log("drawCard called with channel:", channel, "playerId:", playerId, "amount:", amount);
  if (channel && playerId) {
    channel.push("draw_card", { player_id: playerId, amount: amount })
      .receive("ok", response => {
        console.log("draw_card", response);
        return true;
      })
      .receive("error", response => {
        console.error("Error inserting card:", response);
        return false;
      })
  }
  return false;
};

export const callInsertCard = (channel, playerId, card, location) => {
  console.log("insertCard called with channel:", channel, "playerId:", playerId, "card:", card, "location:", location);
  if (channel && playerId) {
    channel.push("insert_card", { player_id: playerId, card: card, location: location })
      .receive("ok", response => {
        console.log("insert_card", response);
        return true;
      })
      .receive("error", response => {
        console.error("Error inserting card:", response);
        return false;
      });
  }
  return false;
};

export const callMoveCard = (channel, playerId, card, source, dest) => {
  if (source === dest)
    return false

  console.log("moveCard called with channel:", channel, "playerId:", playerId, "card:", card, "source:", source, "dest:", dest);
  if (channel && playerId) {
    channel.push("move_card", { player_id: playerId, card: card, source: source, dest: dest })
      .receive("ok", response => {
        console.log("move_card", response);
        return true;
      })
      .receive("error", response => {
        console.error("Error inserting card:", response);
        return false;
      });
  }
  return false;
};

export const updateCard = (channel, playerId, location, card, key, value) => {
  console.log("updateCard called with channel:", channel, "playerId:", playerId, "card:", card);
  if (channel && playerId) {
    channel.push("update_card", { player_id: playerId, location: location, card: card, key: key, value: value })
      .receive("ok", response => {
        console.log("update_card", response);
        return true;
      })
      .receive("error", response => {
        console.error("Error updating card:", response);
        return false;
      });
  }
  return false;
}

export const shuffleCard = (channel, playerId, location) => {
  if (channel && playerId) {
    channel.push("shuffle_card", { player_id: playerId, location: location })
      .receive("ok", response => {
        console.log("shuffle_card", response);
        return true;
      })
      .receive("error", response => {
        console.error("Error shuffling card:", response);
        return false;
      });
  }
  return false;
}

export const passTurn = (channel, playerId) => {
  if (channel && playerId) {
    channel.push("pass_turn", { player_id: playerId })
      .receive("ok", response => {
        console.log("pass_turn", response);
        return true;
      })
      .receive("error", response => {
        console.error("Error passingTurn:", response);
        return false;
      });
  }
  return false;
}

export const callStartGame = (channel, gameId) => {
  if (channel && gameId) {
    channel.push("start_game", { game_id: gameId })
      .receive("ok", response => {
        console.log("start_game", response);
        return true;
      })
      .receive("error", response => {
        console.error("Error starting game:", response);
        return false;
      });
  }
  return false;
}