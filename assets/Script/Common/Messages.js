var MESSAGE_TYPE = {
  // Messages from Server to Client
  SC_START_GAME: "SC_START_GAME",
  SC_START_ROUND: "SC_START_ROUND",
  SC_START_SMALL_GAME: "SC_START_SMALL_GAME",
  SC_INIT_PLAYERS_HANDS: "SC_INIT_PLAYERS_HANDS",
  SC_SET_WIND: "SC_SET_WIND",
  SC_ASK_PLAYER: "SC_ASK_PLAYER",
  SC_SHOW_DISCARD: "SC_SHOW_DISCARD",
  SC_ASK_PONG: "SC_ASK_PONG",
  SC_CONFIRM_PONG: "SC_CONFIRM_PONG",
  SC_ASK_KONG: "SC_ASK_KONG",
  SC_CONFIRM_KONG: "SC_CONFIRM_KONG",
  SC_ASK_PRIVATE_KONG: "SC_ASK_PRIVATE_KONG",
  SC_CONFIRM_PRIVATE_KONG: "SC_CONFIRM_PRIVATE_KONG",
  SC_ASK_CHOW: "SC_ASK_CHOW",
  SC_CONFIRM_CHOW: "SC_CONFIRM_CHOW",
  SC_ASK_WIN: "SC_ASK_WIN",
  SC_CONFIRM_WIN: "SC_CONFIRM_WIN",
  SC_END_GAME: "SC_END_GAME",
  SC_END_SMALL_GAME: "SC_END_SMALL_GAME",

  // Messsages from Client to Server
  CS_CONFIRM_INIT_HANDS: "CS_CONFIRM_INIT_HANDS",
  CS_CLAIM_DISCARD: "CS_CLAIM_DISCARD",
  CS_CLAIM_PASS: "CS_CLAIM_PASS",
  CS_CLAIM_PONG: "CS_CLAIM_PONG",
  CS_CLAIM_KONG: "CS_CLAIM_KONG",
  CS_CLAIM_PRIVATE_KONG: "CS_CLAIM_PRIVATE_KONG",
  CS_CLAIM_CHOW: "CS_CLAIM_CHOW",

  CS_RESTART_GAME: "CS_RESTART_GAME",
};

module.exports = MESSAGE_TYPE;