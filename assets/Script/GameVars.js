var gameVars = {
  tiles: [],
  previousTileIds: [],
  deckCards: [],
  drawCard: null,
  discardCard: null,

  player1: [],
  player2: [],
  player3: [],
  player4: [],
  players: [[], [], [], []],
  playersDiscards: [[], [], [], []],
  playersPublics: [[], [], [], []],
  currentPlayer: 0,
  discardPlayer: 0,
  winds: [0, 1, 2, 3],
  windsList: [],

  pongPossiblePlayer: -1,
  kongPossiblePlayer: -1,
  chowPossiblePlayer: -1,
  winPossiblePlayers: [],

  resultPong: [],
  resultKong: [],
  resultChow: [],
  privateKong: [],

  selectedChow: [],

  pongPlayer: -1,
  kongPlayer: -1,
  chowPlayer: -1,
  winPlayers: [],

  winCounts: [0, 0, 0, 0],
  winners: [],
  roundNum: 0,
  gameNum: 0,
};

module.exports = gameVars;