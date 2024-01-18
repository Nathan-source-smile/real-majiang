export const MESSAGE_TYPE = {
  // Messages from Server to Client
  SC_START_GAME: "SC_START_GAME",
  SC_INIT_PLAYERS_HANDS: "SC_INIT_PLAYERS_HANDS",
  SC_SET_WIND: "SC_SET_WIND",
  SC_ASK_PLAYER: "SC_ASK_PLAYER",
  SC_SHOW_DISCARD: "SC_SHOW_DISCARD",

  SC_DRAW_BOARD: "SC_DRAW_BOARD",
  SC_END_GAME: "SC_END_GAME",
  SC_NO_MORE: "SC_NO_MORE",

  // Messsages from Client to Server
  CS_CONFIRM_INIT_HANDS: "CS_CONFIRM_INIT_HANDS",
  CS_CLAIM_DISCARD: "CS_CLAIM_DISCARD",
  
  CS_COMPARE_TILES: "CS_COMPARE_TILES",
  CS_CLAIM_MOVE: "CS_CLAIM_MOVE",
  CS_RESTART_GAME: "CS_RESTART_GAME",
};

export const ROUNDS = {
  START_GAME: 0,
  START_STEP: 1,
  SELECT_UNIT: 2,
  MOVE_UNIT: 3,
};