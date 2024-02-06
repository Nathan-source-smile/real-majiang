// import { MESSAGE_TYPE } from "../Common/Messages";
var MESSAGE_TYPE = require('../Common/Messages');
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT, TOTAL_TILES, PLAYERS, HAND_CARDS, WIND_TYPE } from "../Common/Constants";
var gameVars = require("GameVars");

//--------Defining global variables----------
var tile = {
    id: -1,
    type: -1,
    semiType: -1,
}
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
        console.trace(JSON.stringify(arguments));
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
    trace("no tile for id:", id);
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

function getRandomTile(arr) {
    var index = Math.floor(Math.random() * arr.length);
    return arr[index];
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

/**
 * functions for Majhong game logic
 */
function isPair(a, b) {
    if (a.type === b.type)
        return true;
    else return false;
}

function isPong(a, b, c) {
    if (a.type === b.type && b.type === c.type)
        return true;
    else return false;
}

function isKong(a, b, c, d) {
    if (a.type === b.type && b.type === c.type && c.type === d.type)
        return true;
    else return false;
}

function isChow(a, b, c) {
    var temp = sort([a, b, c]);
    if (temp[0].type + 1 === temp[1].type && temp[1].type + 1 === temp[2].type && temp[0].semiType === temp[1].semiType && temp[1].semiType === temp[2].semiType && temp[0].semiType < 3)
        return true;
    else return false;
}

function isMadePong(arr, tile) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === tile.type && arr[i].id !== tile.id) {
            result.push(arr[i]);
        }
    }
    if (result.length === 2) {
        result.push(tile);
        sort(result);
    } else {
        result = [];
    }
    return result;
}

function isMadeKong(arr, tile) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === tile.type && arr[i].id !== tile.id) {
            result.push(arr[i]);
        }
    }
    if (result.length === 3) {
        result.push(tile);
        sort(result);
    } else {
        result = [];
    }
    return result;
}

function isMadeChow(arr, tile) {
    var result = [];
    // var sameSemiTypeArray = [];
    var t_2 = null;
    var t_1 = null;
    var t__1 = null;
    var t__2 = null;
    if (tile.semiType < 3) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].semiType === tile.semiType) {
                // sameSemiTypeArray.push(arr[i]);
                if (arr[i].type + 2 === tile.type) {
                    t_2 = arr[i];
                }
                if (arr[i].type + 1 === tile.type) {
                    t_1 = arr[i];
                }
                if (arr[i].type - 1 === tile.type) {
                    t__1 = arr[i];
                }
                if (arr[i].type - 2 === tile.type) {
                    t__2 = arr[i];
                }
            }
        }
    }
    if (t_2 && t_1) {
        result.push([t_2, t_1, tile]);
    }
    if (t_1 && t__1) {
        result.push([t_1, tile, t__1]);
    }
    if (t__1 && t__2) {
        result.push([tile, t__1, t__2]);
    }
    // var combinations = [];

    // var combinations = [];
    // for (var i = 0; i < sameSemiTypeArray.length - 2; i++) {
    //     for (var j = i + 1; j < sameSemiTypeArray.length - 1; j++) {
    //         for (var k = j + 1; k < sameSemiTypeArray.length; k++) {
    //             if([sameSemiTypeArray[i], sameSemiTypeArray[j], sameSemiTypeArray[k]])
    //             combinations.push([sameSemiTypeArray[i], sameSemiTypeArray[j], sameSemiTypeArray[k]]);
    //         }
    //     }
    // }
    return result;
}

function isMadeWin(arr, tile) {
    var result = false;
    var temp = copyObject(arr);
    if (tile)
        temp.push(tile);
    sort(temp);
    var a0 = [];
    var a1 = [];
    var a2 = [];
    var a3 = [];
    var a4 = [];

    for (var i = 0; i < temp.length; i++) {
        switch (temp[i].semiType) {
            case 0:
                a0.push(temp[i]);
                break;
            case 1:
                a1.push(temp[i]);
                break;
            case 2:
                a2.push(temp[i]);
                break;
            case 3:
                a3.push(temp[i]);
                break;
            case 4:
                a4.push(temp[i]);
                break;
        }
    }
    var a0_rest = a0.length % 3;
    var a1_rest = a1.length % 3;
    var a2_rest = a2.length % 3;
    var a3_rest = a3.length % 3;
    var a4_rest = a4.length % 3;

    var all = [a0, a1, a2, a3, a4];

    var pairIndex = [a0_rest, a1_rest, a2_rest, a3_rest, a4_rest].indexOf(2);
    if (pairIndex !== -1 && (a0_rest + a1_rest + a2_rest + a3_rest + a4_rest) === 2) {
        var fffff = [0, 0, 0, 0, 0];
        all.forEach(function (a, index) {
            if (index === pairIndex) {
                var possiblePairs = [];
                for (var i = 0; i < a.length - 1; i++) {
                    for (var j = i + 1; j < a.length; j++) {
                        possiblePairs.push([a[i], a[j]]);
                    }
                }
                possiblePairs.forEach(function (pair, i) {
                    if (isPair(pair[0], pair[1])) {
                        var tempA = copyObject(a);
                        popTile(tempA, pair[0]);
                        popTile(tempA, pair[1]);
                        if (tempA.length === 0) {
                            fffff[index] = 1;
                            return;
                        } else {
                            var combinations = getAllCombines(tempA);
                            combinations.forEach(function (row, i) {
                                var flags = [];
                                row.forEach(function (item, j) {
                                    if (isPong(item[0], item[1], item[2]) || isChow(item[0], item[1], item[2])) {
                                        flags.push(1);
                                    }
                                });
                                if (flags.length === tempA.length / 3) {
                                    fffff[index] = 1;
                                    return;
                                }
                            });
                        }
                    }
                });
            } else {
                if (a.length === 0) {
                    fffff[index] = 1;
                    return;
                }
                else {
                    var combinations = getAllCombines(a);
                    combinations.forEach(function (row, i) {
                        var flags = [];
                        row.forEach(function (item, j) {
                            if (isPong(item[0], item[1], item[2]) || isChow(item[0], item[1], item[2])) {
                                flags.push(1);
                            }
                        });
                        if (flags.length === a.length / 3) {
                            fffff[index] = 1;
                            return;
                        }
                    });
                }
            }
        });
        if (fffff.indexOf(0) === -1) {
            result = true;
        } else {
            result = false;
        }
    }
    return result;
}

function getAllCombines(arr) {
    if (typeof arr !== 'object') {
        trace("input must be array");
        return [];
    }
    if (!Array.isArray(arr)) {
        trace("input must be array");
        return [];
    }
    if (arr.length % 3 !== 0) {
        trace("length of input must be module 3");
        return [];
    }
    arr.sort(function (a, b) {
        return a.id - b.id;
    });
    var answer = [];
    var s = [];
    var candi = [];
    arr.forEach(function () {
        s.push(0);
    });
    var totalLength = arr.length / 3;
    var dfs = function (dep) {
        if (totalLength === dep) {
            answer.push(candi.slice()); // Copy the array to avoid references
            return;
        }
        var i, j, k;
        for (i = 0; i < s.length; i++) {
            if (s[i] === 0) {
                break;
            }
        }
        s[i] = 1;
        for (j = i + 1; j < s.length; j++) {
            if (s[j] === 1) continue;
            s[j] = 1;
            for (k = j + 1; k < s.length; k++) {
                if (s[k] === 1) continue;
                s[k] = 1;
                candi[dep] = [arr[i], arr[j], arr[k]];
                dfs(dep + 1);
                s[k] = 0;
            }
            s[j] = 0;
        }
        s[i] = 0;
    };
    dfs(0);
    return answer;
}

function initHandlers() {
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, onStartGame);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CONFIRM_INIT_HANDS, onAskPlayer);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_DISCARD, onClaimDiscard);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_PASS, onPass);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_PONG, onClaimPong);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_KONG, onClaimKong);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_CHOW, onClaimChow);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_PRIVATE_KONG, onClaimPrivateKong);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, onInit);
}

function onStartGame() {
    startGame();
}

function onAskPlayer(params, room) {
    askPlayer(params, room);
}

function onClaimDiscard(params, room) {
    claimDiscard(params, room);
}

function onPass(params, room) {
    pass(params, room);
}

function onClaimPong(params, room) {
    claimPong(params, room);
}

function onClaimKong(params, room) {
    claimKong(params, room);
}

function onClaimChow(params, room) {
    claimChow(params, room);
}

function onClaimPrivateKong(params, room) {
    claimPrivateKong(params, room);
}

function onInit() {
    init();
}

function init() {
    gameVars.roundScore = [0, 0, 0, 0];
    gameVars.gameScore = [0, 0, 0, 0];
    gameVars.winCounts = [0, 0, 0, 0];
    gameVars.winners = [];
    gameVars.roundNum = 0;
    gameVars.winds = [WIND_TYPE.EAST, WIND_TYPE.SOUTH, WIND_TYPE.WEST, WIND_TYPE.NORTH];
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_GAME,
        { winds: copyObject(gameVars.winds), roundScore: gameVars.roundScore, gameScore: gameVars.gameScore },
        [0, 1, 2, 3],
    );
    gameVars.winds = cyclicShuffle(gameVars.winds, 1);
    gameVars.windsList = [];
    setTimeout(function () {
        newRound();
    }, 2000);
}

function initPlayersWinds() {
    gameVars.winds = cyclicShuffle(gameVars.winds, -1);
    ServerCommService.send(
        MESSAGE_TYPE.SC_SET_WIND,
        { winds: gameVars.winds },
        [0, 1, 2, 3],
    );
}

function newRound() {
    // gameVars.roundScore = [0, 0, 0, 0];
    var max = Math.max.apply(null, gameVars.gameScore);
    if (max !== 0) {
        for (var i = 0; i < PLAYERS; i++) {
            if (gameVars.gameScore[i] === max) {
                gameVars.roundScore[i] += 1;
            }
        }
    }
    gameVars.gameScore = [0, 0, 0, 0];
    gameVars.roundNum += 1;
    gameVars.gameNum = 0;
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_ROUND,
        { roundNum: gameVars.roundNum, roundScore: gameVars.roundScore, gameScore: gameVars.gameScore },
        [0, 1, 2, 3]
    );
    setTimeout(function () {
        startGame();
    }, 1000);
}

function startGame() {
    gameVars.gameNum += 1;
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_SMALL_GAME,
        { roundNum: gameVars.roundNum, gameNum: gameVars.gameNum, roundScore: gameVars.roundScore, gameScore: gameVars.gameScore },
        [0, 1, 2, 3]
    );

    initPlayersWinds();
    gameVars.windsList.push(gameVars.winds);

    gameVars.players = [[], [], [], []];
    gameVars.playersDiscards = [[], [], [], []];
    gameVars.playersPublics = [[], [], [], []];
    gameVars.previousTileIds = [];
    gameVars.deckCards = [];

    gameVars.drawCard = null;
    gameVars.discardCard = null;

    gameVars.currentPlayer = gameVars.winds.indexOf(WIND_TYPE.EAST);
    gameVars.discardPlayer = -1;
    gameVars.tiles = [];
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
        gameVars.tiles.push(temp);
    }
    shuffle(gameVars.tiles);
    gameVars.deckCards = copyObject(gameVars.tiles);
    for (var i = 0; i < PLAYERS; i++) {
        for (var j = 0; j < HAND_CARDS; j++) {
            var tileId = getRandomUniqueInt(0, TOTAL_TILES - 1, gameVars.previousTileIds);
            var temp = copyObject(getTileById(gameVars.tiles, tileId));
            popTile(gameVars.deckCards, temp);
            gameVars.players[i].push(temp);
        }
    }
    for (var i = 0; i < PLAYERS; i++) {
        sort(gameVars.players[i]);
    }

    setTimeout(function () {
        ServerCommService.send(
            MESSAGE_TYPE.SC_INIT_PLAYERS_HANDS,
            { players: gameVars.players },
            [0, 1, 2, 3]
        );
    }, 1000);

}

// finish the game or mission
function gameOver() {
    if (gameVars.winners[gameVars.winners.length - 1] === -1) {
    }
    else {
        gameVars.winCounts[gameVars.winners[gameVars.winners.length - 1]] += 1;
    }
    setTimeout(function () {
        ServerCommService.send(
            MESSAGE_TYPE.SC_END_SMALL_GAME,
            { roundNum: Math.ceil(gameVars.winners.length / 4), winners: gameVars.winners },
            [0, 1, 2, 3]
        );
    }, 5000);
    if (gameVars.winners.length === 16) {
        var max = Math.max.apply(null, gameVars.winCounts);
        var winner = [];
        gameVars.winCounts.forEach(function (e, i) {
            if (e === max)
                winner.push(i);
        });
        setTimeout(function () {
            ServerCommService.send(
                MESSAGE_TYPE.SC_END_GAME,
                { windsList: gameVars.windsList, winners: gameVars.winners, winner: winner },
                [0, 1, 2, 3]
            );
        }, 10000);
    } else if (gameVars.winners.length < 16) {
        if (gameVars.winners.length % 4 === 0) {
            setTimeout(function () {
                newRound();
            }, 10000);
        } else {
            setTimeout(function () {
                startGame();
            }, 10000);
            // var max = Math.max.apply(null, winCounts);
            // var winner = [];
            // winCounts.forEach(function (e, i) {
            //     if (e === max)
            //         winner.push(i);
            // });
            // setTimeout(function () {
            //     ServerCommService.send(
            //         MESSAGE_TYPE.SC_END_GAME,
            //         { windsList: windsList, winners: winners, winner: winner },
            //         [0, 1, 2, 3]
            //     );
            // }, 10000);
        }
    }
}

function askPlayer() {
    trace("askPlayer:", gameVars.currentPlayer);
    TimeoutManager.clearNextTimeout();
    if (gameVars.deckCards.length === 0) {
        gameVars.winners.push(-1);
        gameOver();
        return;
    }
    var index = Math.floor(Math.random() * gameVars.deckCards.length);
    gameVars.drawCard = copyObject(gameVars.deckCards[index]);
    gameVars.deckCards.splice(index, 1);
    gameVars.players[gameVars.currentPlayer].push(gameVars.drawCard);
    sort(gameVars.players[gameVars.currentPlayer]);
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_PLAYER,
        { currentPlayer: gameVars.currentPlayer, drawCard: gameVars.drawCard, deckCardsNum: gameVars.deckCards.length, discardCard: gameVars.discardCard, discardPlayer: gameVars.discardPlayer },
        [0, 1, 2, 3]
    );
    gameVars.discardCard = null;
    if (isMadeWin(gameVars.players[gameVars.currentPlayer], null)) {
        gameVars.winners.push(gameVars.currentPlayer);
        gameVars.gameScore[gameVars.currentPlayer] += 1;
        gameOver();
        return;
    }
    gameVars.privateKong = isMadeKong(gameVars.players[gameVars.currentPlayer], gameVars.drawCard);
    if (gameVars.privateKong.length > 0) {
        ServerCommService.send(
            MESSAGE_TYPE.SC_ASK_PRIVATE_KONG,
            { player: gameVars.currentPlayer, result: gameVars.privateKong },
            [0, 1, 2, 3]
        );
    } else {
        TimeoutManager.setNextTimeout(function () {
            claimDiscard({ discardCard: gameVars.drawCard, discardPlayer: gameVars.currentPlayer });
        }, TIME_LIMIT);
    }
}

function claimDiscard(params, room) {
    trace("claim discard:");
    TimeoutManager.clearNextTimeout();
    gameVars.discardCard = params.discardCard;
    gameVars.discardPlayer = params.discardPlayer;

    // if (discardCard.id !== drawCard.id) {
    var temp = copyObject(getTileById(gameVars.tiles, gameVars.discardCard.id));
    popTile(gameVars.players[gameVars.discardPlayer], temp);
    sort(gameVars.players[gameVars.discardPlayer]);
    // }

    gameVars.pongPossiblePlayer = -1;
    gameVars.kongPossiblePlayer = -1;
    gameVars.chowPossiblePlayer = -1;
    gameVars.winPossiblePlayers = [];

    gameVars.pongPlayer = -1;
    gameVars.kongPlayer = -1;
    gameVars.chowPlayer = -1;
    gameVars.winPlayers = [];

    gameVars.players.forEach(function (player, index) {
        if (index !== gameVars.discardPlayer) {
            var tempPong = isMadePong(player, gameVars.discardCard);
            var tempKong = isMadeKong(player, gameVars.discardCard);
            if (isMadeWin(player, gameVars.discardCard)) {
                gameVars.winPossiblePlayers.push(index);
            }
            if (tempPong.length > 0) {
                gameVars.pongPossiblePlayer = index;
                gameVars.resultPong = copyObject(tempPong);
            }
            if (tempKong.length > 0) {
                gameVars.kongPossiblePlayer = index;
                gameVars.resultKong = copyObject(tempKong);
            }
        }
        if (index === (gameVars.discardPlayer + 1) % PLAYERS) {
            var tempChow = isMadeChow(player, gameVars.discardCard);
            if (tempChow.length > 0) {
                gameVars.chowPossiblePlayer = index;
                gameVars.resultChow = copyObject(tempChow);
            }
        }
    });
    ServerCommService.send(
        MESSAGE_TYPE.SC_SHOW_DISCARD,
        { discardCard: gameVars.discardCard, discardPlayer: gameVars.discardPlayer, playerHand: gameVars.players[gameVars.discardPlayer] },
        [0, 1, 2, 3]
    );
    if (gameVars.winPossiblePlayers.length > 0) {
        var diffs = [];
        gameVars.winPossiblePlayers.forEach(function (e, index) {
            diffs.push(e - gameVars.discardPlayer + PLAYERS) % PLAYERS;
        });
        var min = Math.min.apply(null, diffs);
        gameVars.winners.push(gameVars.winPossiblePlayers[diffs.indexOf(min)]);
        gameVars.gameScore[gameVars.winPossiblePlayers[diffs.indexOf(min)]] += 1;
        gameOver();
        return;
    } else {
        if (gameVars.pongPossiblePlayer !== -1) {
            askPong();
        }
        if (gameVars.kongPossiblePlayer !== -1) {
            askKong();
        }
        if (gameVars.chowPossiblePlayer !== -1) {
            askChow();
        }
    }
    if (gameVars.pongPossiblePlayer === -1 && gameVars.kongPossiblePlayer === -1 && gameVars.chowPossiblePlayer === -1 && gameVars.winPossiblePlayers.length === 0) {
        TimeoutManager.setNextTimeout(function () {
            // if (!konged)
            gameVars.currentPlayer = (gameVars.currentPlayer + 1) % PLAYERS;
            // else
            // konged = false;
            askPlayer();
        }, ALARM_LIMIT);
    }
}

function askPong() {
    trace("askPong: ", gameVars.pongPossiblePlayer, gameVars.resultPong);
    TimeoutManager.clearNextTimeout();
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_PONG,
        { player: gameVars.pongPossiblePlayer, result: gameVars.resultPong, discardCard: gameVars.discardCard },
        [0, 1, 2, 3]
    );
    TimeoutManager.setNextTimeout(function () {
        pass({ player: gameVars.pongPossiblePlayer });
    }, TIME_LIMIT);
}

function askKong() {
    trace("askKong: ", gameVars.kongPossiblePlayer, gameVars.resultKong);
    TimeoutManager.clearNextTimeout();
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_KONG,
        { player: gameVars.kongPossiblePlayer, result: gameVars.resultKong, discardCard: gameVars.discardCard },
        [0, 1, 2, 3]
    );
    TimeoutManager.setNextTimeout(function () {
        pass({ player: gameVars.kongPossiblePlayer });
    }, TIME_LIMIT);
}

function askChow() {
    trace("askChow: ", gameVars.chowPossiblePlayer, gameVars.resultChow);
    TimeoutManager.clearNextTimeout();
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_CHOW,
        { player: gameVars.chowPossiblePlayer, result: gameVars.resultChow, discardCard: gameVars.discardCard },
        [0, 1, 2, 3]
    );
    TimeoutManager.setNextTimeout(function () {
        pass({ player: gameVars.chowPossiblePlayer });
    }, TIME_LIMIT);
}

function pass(params, room) {
    trace("pass");
    TimeoutManager.clearNextTimeout();
    var player = params.player;
    if (gameVars.pongPossiblePlayer === player) {
        gameVars.pongPossiblePlayer = -1;
    }
    if (gameVars.kongPossiblePlayer === player) {
        gameVars.kongPossiblePlayer = -1;
    }
    if (gameVars.chowPossiblePlayer === player) {
        gameVars.chowPossiblePlayer = -1;
    }
    var index = gameVars.winPossiblePlayers.indexOf(player);
    if (index !== -1) {
        gameVars.winPossiblePlayers.splice(index, 1);
    }

    // if (pongPossiblePlayer === -1 && kongPossiblePlayer === -1 && chowPossiblePlayer === -1 && winPossiblePlayers.length === 0) {
    //     currentPlayer = (currentPlayer + 1) % PLAYERS;
    //     askPlayer();
    // }
    confirmClaimTriples();
}

function claimPong(params, room) {
    trace("claim pong");
    TimeoutManager.clearNextTimeout();
    var player = params.player;
    if (gameVars.pongPossiblePlayer === player) {
        gameVars.pongPossiblePlayer = -1;
        gameVars.pongPlayer = player;
        if (player === gameVars.chowPossiblePlayer)
            gameVars.chowPossiblePlayer = -1;
    }

    confirmClaimTriples();

}

function claimKong(params, room) {
    trace("claim kong");
    TimeoutManager.clearNextTimeout();
    var player = params.player;
    if (gameVars.kongPossiblePlayer === player) {
        gameVars.kongPossiblePlayer = -1;
        gameVars.kongPlayer = player;
        if (player === gameVars.chowPossiblePlayer)
            gameVars.chowPossiblePlayer = -1;
    }

    confirmClaimTriples();

}

function claimPrivateKong(params, room) {
    trace("claim private kong");
    TimeoutManager.clearNextTimeout();
    var player = params.player;

    gameVars.playersPublics[gameVars.currentPlayer].push(gameVars.privateKong);
    // players[currentPlayer].push(discardCard);
    gameVars.privateKong.forEach(function (tile, index) {
        popTile(gameVars.players[gameVars.currentPlayer], tile);
    });
    // var temp = getRandomTile(players[currentPlayer]);
    ServerCommService.send(
        MESSAGE_TYPE.SC_CONFIRM_PRIVATE_KONG,
        { player: gameVars.currentPlayer, result: gameVars.privateKong, playerHand: copyObject(gameVars.players[gameVars.currentPlayer]) },
        [0, 1, 2, 3]
    );
    // TimeoutManager.setNextTimeout(function () {
    // claimDiscard({ discardCard: temp, discardPlayer: currentPlayer });
    gameVars.discardCard = null;
    askPlayer();
    // }, 0.2);

}

function claimChow(params, room) {
    trace("claim chow");
    TimeoutManager.clearNextTimeout();
    var player = params.player;
    gameVars.selectedChow = params.tiles;
    if (gameVars.chowPossiblePlayer === player) {
        gameVars.chowPossiblePlayer = -1;
        gameVars.chowPlayer = player;
        if (gameVars.pongPossiblePlayer === player)
            gameVars.pongPossiblePlayer = -1;
        if (gameVars.kongPossiblePlayer === player)
            gameVars.kongPossiblePlayer = -1;
    }

    confirmClaimTriples();

}

function confirmClaimTriples() {
    if (gameVars.pongPossiblePlayer === -1 && gameVars.kongPossiblePlayer === -1 && gameVars.chowPossiblePlayer === -1 && gameVars.winPossiblePlayers.length === 0) {
        if (gameVars.winPlayers.length > 0) {
            var diffs = [];
            gameVars.winPlayers.forEach(function (winPlayer, index) {
                diffs.push(winPlayer - gameVars.currentPlayer + PLAYERS) % PLAYERS;
            });
            var min = Math.min.apply(null, diffs);
            gameVars.currentPlayer = gameVars.winPlayers[diffs.indexOf(min)];
        } else if (gameVars.kongPlayer !== -1) {
            gameVars.playersPublics[gameVars.kongPlayer].push(gameVars.resultKong);
            gameVars.currentPlayer = gameVars.kongPlayer;
            gameVars.players[gameVars.currentPlayer].push(gameVars.discardCard);
            gameVars.resultKong.forEach(function (tile, index) {
                popTile(gameVars.players[gameVars.currentPlayer], tile);
            });
            // var temp = getRandomTile(players[currentPlayer]);
            ServerCommService.send(
                MESSAGE_TYPE.SC_CONFIRM_KONG,
                { player: gameVars.kongPlayer, result: gameVars.resultKong, playerHand: copyObject(gameVars.players[gameVars.currentPlayer]) },
                [0, 1, 2, 3]
            );
            // TimeoutManager.setNextTimeout(function () {
            // claimDiscard({ discardCard: temp, discardPlayer: currentPlayer });
            gameVars.discardCard = null;
            askPlayer();
            // }, 0.2);
        } else if (gameVars.pongPlayer !== -1) {
            gameVars.playersPublics[gameVars.pongPlayer].push(gameVars.resultPong);
            gameVars.currentPlayer = gameVars.pongPlayer;
            gameVars.players[gameVars.currentPlayer].push(gameVars.discardCard);
            gameVars.resultPong.forEach(function (tile, index) {
                popTile(gameVars.players[gameVars.currentPlayer], tile);
            });
            var temp = getRandomTile(gameVars.players[gameVars.currentPlayer]);
            ServerCommService.send(
                MESSAGE_TYPE.SC_CONFIRM_PONG,
                { player: gameVars.pongPlayer, result: gameVars.resultPong, playerHand: gameVars.players[gameVars.currentPlayer] },
                [0, 1, 2, 3]
            );
            TimeoutManager.setNextTimeout(function () {
                claimDiscard({ discardCard: temp, discardPlayer: gameVars.currentPlayer });
            }, TIME_LIMIT);
        } else if (gameVars.chowPlayer !== -1) {
            gameVars.playersPublics[gameVars.chowPlayer].push(gameVars.selectedChow);
            gameVars.currentPlayer = gameVars.chowPlayer;
            gameVars.players[gameVars.currentPlayer].push(gameVars.discardCard);
            gameVars.selectedChow.forEach(function (tile, index) {
                popTile(gameVars.players[gameVars.currentPlayer], tile);
            });
            var temp = getRandomTile(gameVars.players[gameVars.currentPlayer]);
            ServerCommService.send(
                MESSAGE_TYPE.SC_CONFIRM_CHOW,
                { player: gameVars.chowPlayer, result: gameVars.selectedChow, playerHand: gameVars.players[gameVars.currentPlayer] },
                [0, 1, 2, 3]
            );
            TimeoutManager.setNextTimeout(function () {
                claimDiscard({ discardCard: temp, discardPlayer: gameVars.currentPlayer });
            }, TIME_LIMIT);
        } else {
            gameVars.currentPlayer = (gameVars.currentPlayer + 1) % PLAYERS;
            askPlayer();
        }
        gameVars.kongPlayer = -1;
        gameVars.pongPlayer = -1;
        gameVars.chowPlayer = -1;
    }
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
