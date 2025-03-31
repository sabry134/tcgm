export const callSetDeck = (channel, playerId, deck) => {
    console.log("setDeck called with channel:", channel, "playerId:", playerId, "deck:", deck);
    if (channel && playerId) {
      channel.push("set_deck", { player_id: playerId, deck: deck })
        .receive("ok", response => {
          console.log("set_deck", response);
        })
        .receive("error", response => {
          console.error("Error inserting card:", response);
        });
    }
  };
  