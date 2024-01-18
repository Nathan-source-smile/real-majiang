import { MESSAGE_TYPE, ROUNDS } from "../Common/Messages";
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT, TOTAL_TILES, WIN, LOSE, NOT_END, TOTAL_MOVEMENT, TOTAL_TIME, PLAYERS, HAND_CARDS, WIND_TYPE } from "../Common/Constants";

//--------Defining global variables----------
var tile = {
    id: -1,
    type: -1,
    semiType: -1,
}
var tiles = [];
var previousTileIds = [];
var deckCards = [];
var drawCard;
var discardCard;

var player1 = [];
var player2 = [];
var player3 = [];
var player4 = [];
var players = [player1, player2, player3, player4];
var playersDiscards = [[], [], [], []];
var playersPublics = [[], [], [], []];
var currentPlayer = 0;
var discardPlayer = 0;
var winds = [WIND_TYPE.EAST, WIND_TYPE.SOUTH, WIND_TYPE.WEST, WIND_TYPE.NORTH];
var roundScore = [0, 0, 0, 0];
var gameScore = [0, 0, 0, 0];
//--------Defining global variables----------

function copyObject(object) {
    if (!object) {
        trace("undefined object in copyObject:", object);
        return object;
    }
    return JSON.parse(JSON.stringify(object));
}

if (!trace) {
    var trace = function () {
        console.log(JSON.stringify(arguments));
    };
}

function getRandomUniqueInt(min, max, previousNumbers) {
    // Generate a random integer between min (inclusive) and max (exclusive)
    const randomInt = Math.floor(Math.random() * (max - min) + min);

    // Check if the number is unique by comparing against previous numbers
    if (previousNumbers.includes(randomInt)) {
        // If not unique, recursively call the function to generate a new one
        return getRandomUniqueInt(min, max, previousNumbers);
    }

    // If unique, add the number to the array of previous numbers
    previousNumbers.push(randomInt);

    // Return the unique random integer
    return randomInt;
}

function getTileById(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            return arr[i];
        }
    }
    console.log("no tile for id:", id);
    debugger;
}

function popTile(arr, tile) {
    var index = -1;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === tile.id) {
            index = i;
        }
    }
    if (index !== -1) {
        arr.splice(index, 1);
    }
}

function shuffle(array) {
    array.sort(function () { return Math.random() - 0.5 });
    return array;
};

function sort(array) {
    array.sort(function (a, b) { return a.id - b.id });
    return array;
}

function cyclicShuffle(arr, positions) {
    var length = arr.length;

    // Use modulo to determine the effective number of positions
    var effectivePositions = positions % length;

    // Slice and concatenate the array to create the cyclic shuffle
    var shuffledArray = arr.slice(effectivePositions).concat(arr.slice(0, effectivePositions));

    return shuffledArray;
}

function initHandlers() {
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, startGame);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CONFIRM_INIT_HANDS, askPlayer);
}

function init() {
    roundScore = [0, 0, 0, 0];
    gameScore = [0, 0, 0, 0];
    initPlayersWinds();
    startRound();
}

function initPlayersWinds() {
    winds = cyclicShuffle(winds, 0);
    ServerCommService.send(
        MESSAGE_TYPE.SC_SET_WIND,
        { winds: winds },
        [0, 1, 2, 3],
    );
}

function startRound() {
    startGame();
}

function startGame() {

    players = [player1, player2, player3, player4];
    playersDiscards = [[], [], [], []];
    playersPublics = [[], [], [], []];

    currentPlayer = winds[0];
    discardPlayer = -1;
    tiles = [];
    for (var i = 0; i < TOTAL_TILES; i++) {
        var temp = copyObject(tile);
        temp.id = i;
        temp.type = Math.floor(i / 4);
        if (temp.type >= 0 && temp.type <= 8) {
            temp.semiType = 0;
        } else if (temp.type >= 9 && temp.type <= 17) {
            temp.semiType = 1;
        } else if (temp.type >= 18 && temp.type <= 26) {
            temp.semiType = 2;
        } else if (temp.type >= 27 && temp.type <= 29) {
            temp.semiType = 3;
        } else if (temp.type >= 30 && temp.type <= 33) {
            temp.semiType = 4;
        }
        tiles.push(temp);
    }
    shuffle(tiles);
    deckCards = copyObject(tiles);
    for (var i = 0; i < PLAYERS; i++) {
        for (var j = 0; j < HAND_CARDS; j++) {
            var tileId = getRandomUniqueInt(0, TOTAL_TILES - 1, previousTileIds);
            var temp = copyObject(getTileById(tiles, tileId));
            popTile(deckCards, temp);
            players[i].push(temp);
        }
    }
    for (var i = 0; i < PLAYERS; i++) {
        sort(players[i]);
    }
    ServerCommService.send(
        MESSAGE_TYPE.SC_INIT_PLAYERS_HANDS,
        { players: players },
        [0, 1, 2, 3]
    )
}

function askPlayer() {
    console.log("askPlayer:", currentPlayer);
    TimeoutManager.clearNextTimeout();
    var index = Math.floor(Math.random() * deckCards.length);
    drawCard = copyObject(deckCards[index]);
    deckCards.splice(index, 1);
    // popTile(deckCards, drawCard);
    // var tileId = getRandomUniqueInt(0, TOTAL_TILES - 1, previousTileIds);
    // var temp = copyObject(getTileById(tileId));
    // popTile(deckCards, temp);
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_PLAYER,
        { currentPlayer: currentPlayer, drawCard: drawCard, deckCardsNum: deckCards.length },
        [0, 1, 2, 3]
    );
    TimeoutManager.setNextTimeout(function () {
        claimDiscard({ discardCard: drawCard, discardPlayer: currentPlayer });
    }, TIME_LIMIT);
}

function claimDiscard(params, room) {
    console.log("claim discard:");
    TimeoutManager.clearNextTimeout();
    discardCard = params.discardCard;
    discardPlayer = params.discardPlayer;
    currentPlayer = (currentPlayer + 1) % PLAYERS;
    ServerCommService.send(
        MESSAGE_TYPE.SC_SHOW_DISCARD,
        { discardCard: discardCard, discardPlayer: discardPlayer },
        [0, 1, 2, 3]
    )
    TimeoutManager.setNextTimeout(function () {
        askPlayer();
    }, ALARM_LIMIT);
}

// finish the game or mission
function gameOver() {
    ServerCommService.send(
        MESSAGE_TYPE.SC_END_GAME,
        { gameResult: gameResult, reason: reason },
        [0],
    );
}

export const ServerCommService = {
    callbackMap: {},
    init() {
        this.callbackMap = {};
    },
    addRequestHandler(messageType, callback) {
        this.callbackMap[messageType] = callback;
    },
    send(messageType, data, users) {
        // TODO: Make fake code here to send message to client side
        // Added timeout bc there are times that UI are not updated properly if we send next message immediately
        // If we move to backend, we can remove this timeout
        setTimeout(function () {
            ClientCommService.onExtensionResponse({
                cmd: messageType,
                params: data,
                users: users,
            });
        }, 100);
    },
    onReceiveMessage(messageType, data, room) {
        const callback = this.callbackMap[messageType];
        trace("S - onReceiveMessage", messageType, data, room);
        if (callback) {
            callback(data, room);
        }
    },
};
ServerCommService.init();

const TimeoutManager = {
    timeoutHandler: null,
    nextAction: null,

    setNextTimeout(callback, timeLimit) {
        this.timeoutHandler = setTimeout(
            function () {
                return callback();
            },
            timeLimit ? timeLimit * 1000 : (TIME_LIMIT + ALARM_LIMIT) * 1000
        );
    },

    clearNextTimeout() {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    },
};

export const FakeServer = {
    initHandlers() {
        initHandlers();
    },
    init() {
        init();
    },

    startGame() {
        startGame();
    },
};
