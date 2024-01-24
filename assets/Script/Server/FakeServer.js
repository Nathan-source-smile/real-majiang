import { MESSAGE_TYPE, ROUNDS } from "../Common/Messages";
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT, TOTAL_TILES, PLAYERS, HAND_CARDS, WIND_TYPE } from "../Common/Constants";

//--------Defining global variables----------
var tile = {
    id: -1,
    type: -1,
    semiType: -1,
}
var tiles = [];
var previousTileIds = [];
var deckCards = [];
var drawCard = null;
var discardCard = null;

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
var windsList = [];

var pongPossiblePlayer = -1;
var kongPossiblePlayer = -1;
var chowPossiblePlayer = -1;
var winPossiblePlayers = [];

var resultPong = [];
var resultKong = [];
var resultChow = [];
var privateKong = [];

var selectedChow = [];

var pongPlayer = -1;
var kongPlayer = -1;
var chowPlayer = -1;
var winPlayers = [];

var konged = false;

var roundScore = [0, 0, 0, 0];
var gameScore = [0, 0, 0, 0];
var winCounts = [0, 0, 0, 0];
var winners = [];
var roundNum = 0;
var gameNum = 0;
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
        console.log("input must be array");
        return [];
    }
    if (!Array.isArray(arr)) {
        console.log("input must be array");
        return [];
    }
    if (arr.length % 3 !== 0) {
        console.log("length of input must be module 3");
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
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, startGame);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CONFIRM_INIT_HANDS, askPlayer);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_DISCARD, claimDiscard);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_PASS, pass);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_PONG, claimPong);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_KONG, claimKong);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_CHOW, claimChow);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_PRIVATE_KONG, claimPrivateKong);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, init);
}

function init() {
    roundScore = [0, 0, 0, 0];
    gameScore = [0, 0, 0, 0];
    winCounts = [0, 0, 0, 0];
    winners = [];
    roundNum = 0;
    winds = [WIND_TYPE.EAST, WIND_TYPE.SOUTH, WIND_TYPE.WEST, WIND_TYPE.NORTH];
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_GAME,
        { winds: copyObject(winds) },
        [0, 1, 2, 3],
    );
    winds = cyclicShuffle(winds, 1);
    windsList = [];
    setTimeout(function () {
        startRound();
    }, 2000);
}

function initPlayersWinds() {
    winds = cyclicShuffle(winds, -1);
    ServerCommService.send(
        MESSAGE_TYPE.SC_SET_WIND,
        { winds: winds },
        [0, 1, 2, 3],
    );
}

function startRound() {
    roundNum += 1;
    gameNum = 0;
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_ROUND,
        { roundNum: roundNum },
        [0, 1, 2, 3]
    );
    setTimeout(function () {
        startGame();
    }, 1000);
}

function startGame() {
    gameNum += 1;
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_SMALL_GAME,
        { roundNum: roundNum, gameNum: gameNum },
        [0, 1, 2, 3]
    );

    initPlayersWinds();
    windsList.push(winds);

    players = [[], [], [], []];
    playersDiscards = [[], [], [], []];
    playersPublics = [[], [], [], []];
    previousTileIds = [];
    deckCards = [];

    drawCard = null;
    discardCard = null;

    currentPlayer = winds.indexOf(WIND_TYPE.EAST);
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

    setTimeout(function () {
        ServerCommService.send(
            MESSAGE_TYPE.SC_INIT_PLAYERS_HANDS,
            { players: players },
            [0, 1, 2, 3]
        );
    }, 1000);

}

// finish the game or mission
function gameOver() {
    if (winners[winners.length - 1] === -1) {
    }
    else {
        winCounts[winners[winners.length - 1]] += 1;
    }
    setTimeout(function () {
        ServerCommService.send(
            MESSAGE_TYPE.SC_END_SMALL_GAME,
            { roundNum: Math.ceil(winners.length / 4), winners: winners },
            [0, 1, 2, 3]
        );
    }, 5000);
    if (winners.length === 16) {
        var max = Math.max.apply(null, winCounts);
        var winner = [];
        winCounts.forEach(function (e, i) {
            if (e === max)
                winner.push(i);
        });
        setTimeout(function () {
            ServerCommService.send(
                MESSAGE_TYPE.SC_END_GAME,
                { windsList: windsList, winners: winners, winner: winner },
                [0, 1, 2, 3]
            );
        }, 10000);
    } else if (winners.length < 16) {
        if (winners.length % 4 === 0) {
            setTimeout(function () {
                startRound();
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
    console.log("askPlayer:", currentPlayer);
    TimeoutManager.clearNextTimeout();
    if (deckCards.length === 0) {
        winners.push(-1);
        gameOver();
        return;
    }
    var index = Math.floor(Math.random() * deckCards.length);
    drawCard = copyObject(deckCards[index]);
    deckCards.splice(index, 1);
    players[currentPlayer].push(drawCard);
    sort(players[currentPlayer]);
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_PLAYER,
        { currentPlayer: currentPlayer, drawCard: drawCard, deckCardsNum: deckCards.length, discardCard: discardCard, discardPlayer: discardPlayer },
        [0, 1, 2, 3]
    );
    discardCard = null;
    if (isMadeWin(players[currentPlayer], null)) {
        winners.push(currentPlayer);
        gameOver();
        return;
    }
    privateKong = isMadeKong(players[currentPlayer], drawCard);
    if (privateKong.length > 0) {
        ServerCommService.send(
            MESSAGE_TYPE.SC_ASK_PRIVATE_KONG,
            { player: currentPlayer, result: privateKong },
            [0, 1, 2, 3]
        );
    } else {
        TimeoutManager.setNextTimeout(function () {
            claimDiscard({ discardCard: drawCard, discardPlayer: currentPlayer });
        }, TIME_LIMIT);
    }
}

function claimDiscard(params, room) {
    console.log("claim discard:");
    TimeoutManager.clearNextTimeout();
    discardCard = params.discardCard;
    discardPlayer = params.discardPlayer;

    // if (discardCard.id !== drawCard.id) {
    var temp = copyObject(getTileById(tiles, discardCard.id));
    popTile(players[discardPlayer], temp);
    sort(players[discardPlayer]);
    // }

    pongPossiblePlayer = -1;
    kongPossiblePlayer = -1;
    chowPossiblePlayer = -1;
    winPossiblePlayers = [];

    var pongPlayer = -1;
    var kongPlayer = -1;
    var chowPlayer = -1;
    var winPlayers = [];

    players.forEach(function (player, index) {
        if (index !== discardPlayer) {
            var tempPong = isMadePong(player, discardCard);
            var tempKong = isMadeKong(player, discardCard);
            if (isMadeWin(player, discardCard)) {
                winPossiblePlayers.push(index);
            }
            if (tempPong.length > 0) {
                pongPossiblePlayer = index;
                resultPong = copyObject(tempPong);
            }
            if (tempKong.length > 0) {
                kongPossiblePlayer = index;
                resultKong = copyObject(tempKong);
            }
        }
        if (index === (discardPlayer + 1) % PLAYERS) {
            var tempChow = isMadeChow(player, discardCard);
            if (tempChow.length > 0) {
                chowPossiblePlayer = index;
                resultChow = copyObject(tempChow);
            }
        }
    });
    ServerCommService.send(
        MESSAGE_TYPE.SC_SHOW_DISCARD,
        { discardCard: discardCard, discardPlayer: discardPlayer, playerHand: players[discardPlayer] },
        [0, 1, 2, 3]
    );
    if (winPossiblePlayers.length > 0) {
        var diffs = [];
        winPossiblePlayers.forEach(function (e, index) {
            diffs.push(e - discardPlayer + PLAYERS) % PLAYERS;
        });
        var min = Math.min.apply(null, diffs);
        winners.push(winPossiblePlayers[diffs.indexOf(min)]);
        gameOver();
        return;
    } else {
        if (pongPossiblePlayer !== -1) {
            askPong();
        }
        if (kongPossiblePlayer !== -1) {
            askKong();
        }
        if (chowPossiblePlayer !== -1) {
            askChow();
        }
    }
    if (pongPossiblePlayer === -1 && kongPossiblePlayer === -1 && chowPossiblePlayer === -1 && winPossiblePlayers.length === 0) {
        TimeoutManager.setNextTimeout(function () {
            // if (!konged)
            currentPlayer = (currentPlayer + 1) % PLAYERS;
            // else
            // konged = false;
            askPlayer();
        }, ALARM_LIMIT);
    }
}

function askPong() {
    console.log("askPong: ", pongPossiblePlayer, resultPong);
    TimeoutManager.clearNextTimeout();
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_PONG,
        { player: pongPossiblePlayer, result: resultPong, discardCard: discardCard },
        [0, 1, 2, 3]
    );
    TimeoutManager.setNextTimeout(function () {
        pass({ player: pongPossiblePlayer });
    }, TIME_LIMIT);
}

function askKong() {
    console.log("askKong: ", kongPossiblePlayer, resultKong);
    TimeoutManager.clearNextTimeout();
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_KONG,
        { player: kongPossiblePlayer, result: resultKong, discardCard: discardCard },
        [0, 1, 2, 3]
    );
    TimeoutManager.setNextTimeout(function () {
        pass({ player: kongPossiblePlayer });
    }, TIME_LIMIT);
}

function askChow() {
    console.log("askChow: ", chowPossiblePlayer, resultChow);
    TimeoutManager.clearNextTimeout();
    ServerCommService.send(
        MESSAGE_TYPE.SC_ASK_CHOW,
        { player: chowPossiblePlayer, result: resultChow, discardCard: discardCard },
        [0, 1, 2, 3]
    );
    TimeoutManager.setNextTimeout(function () {
        pass({ player: chowPossiblePlayer });
    }, TIME_LIMIT);
}

function pass(params, room) {
    console.log("pass");
    TimeoutManager.clearNextTimeout();
    var player = params.player;
    if (pongPossiblePlayer === player) {
        pongPossiblePlayer = -1;
    }
    if (kongPossiblePlayer === player) {
        kongPossiblePlayer = -1;
    }
    if (chowPossiblePlayer === player) {
        chowPossiblePlayer = -1;
    }
    var index = winPossiblePlayers.indexOf(player);
    if (index !== -1) {
        winPossiblePlayers.splice(index, 1);
    }

    // if (pongPossiblePlayer === -1 && kongPossiblePlayer === -1 && chowPossiblePlayer === -1 && winPossiblePlayers.length === 0) {
    //     currentPlayer = (currentPlayer + 1) % PLAYERS;
    //     askPlayer();
    // }
    confirmClaimTriples();
}

function claimPong(params, room) {
    console.log("claim pong");
    TimeoutManager.clearNextTimeout();
    var player = params.player;
    if (pongPossiblePlayer === player) {
        pongPossiblePlayer = -1;
        pongPlayer = player;
        if (player === chowPossiblePlayer)
            chowPossiblePlayer = -1;
    }

    confirmClaimTriples();

}

function claimKong(params, room) {
    console.log("claim kong");
    TimeoutManager.clearNextTimeout();
    var player = params.player;
    if (kongPossiblePlayer === player) {
        kongPossiblePlayer = -1;
        kongPlayer = player;
        if (player === chowPossiblePlayer)
            chowPossiblePlayer = -1;
    }

    confirmClaimTriples();

}

function claimPrivateKong(params, room) {
    console.log("claim private kong");
    TimeoutManager.clearNextTimeout();
    var player = params.player;

    playersPublics[currentPlayer].push(privateKong);
    // players[currentPlayer].push(discardCard);
    privateKong.forEach(function (tile, index) {
        popTile(players[currentPlayer], tile);
    });
    // var temp = getRandomTile(players[currentPlayer]);
    ServerCommService.send(
        MESSAGE_TYPE.SC_CONFIRM_PRIVATE_KONG,
        { player: currentPlayer, result: privateKong, playerHand: copyObject(players[currentPlayer]) },
        [0, 1, 2, 3]
    );
    konged = true;
    // TimeoutManager.setNextTimeout(function () {
    // claimDiscard({ discardCard: temp, discardPlayer: currentPlayer });
    discardCard = null;
    askPlayer();
    // }, 0.2);

}

function claimChow(params, room) {
    console.log("claim chow");
    TimeoutManager.clearNextTimeout();
    var player = params.player;
    selectedChow = params.tiles;
    if (chowPossiblePlayer === player) {
        chowPossiblePlayer = -1;
        chowPlayer = player;
        if (pongPossiblePlayer === player)
            pongPossiblePlayer = -1;
        if (kongPossiblePlayer === player)
            kongPossiblePlayer = -1;
    }

    confirmClaimTriples();

}

function confirmClaimTriples() {
    if (pongPossiblePlayer === -1 && kongPossiblePlayer === -1 && chowPossiblePlayer === -1 && winPossiblePlayers.length === 0) {
        if (winPlayers.length > 0) {
            var diffs = [];
            winPlayers.forEach(function (winPlayer, index) {
                diffs.push(winPlayer - currentPlayer + PLAYERS) % PLAYERS;
            });
            var min = Math.min.apply(null, diffs);
            currentPlayer = winPlayers[diffs.indexOf(min)];
        } else if (kongPlayer !== -1) {
            playersPublics[kongPlayer].push(resultKong);
            currentPlayer = kongPlayer;
            players[currentPlayer].push(discardCard);
            resultKong.forEach(function (tile, index) {
                popTile(players[currentPlayer], tile);
            });
            // var temp = getRandomTile(players[currentPlayer]);
            ServerCommService.send(
                MESSAGE_TYPE.SC_CONFIRM_KONG,
                { player: kongPlayer, result: resultKong, playerHand: copyObject(players[currentPlayer]) },
                [0, 1, 2, 3]
            );
            konged = true;
            // TimeoutManager.setNextTimeout(function () {
            // claimDiscard({ discardCard: temp, discardPlayer: currentPlayer });
            discardCard = null;
            askPlayer();
            // }, 0.2);
        } else if (pongPlayer !== -1) {
            playersPublics[pongPlayer].push(resultPong);
            currentPlayer = pongPlayer;
            players[currentPlayer].push(discardCard);
            resultPong.forEach(function (tile, index) {
                popTile(players[currentPlayer], tile);
            });
            var temp = getRandomTile(players[currentPlayer]);
            ServerCommService.send(
                MESSAGE_TYPE.SC_CONFIRM_PONG,
                { player: pongPlayer, result: resultPong, playerHand: players[currentPlayer] },
                [0, 1, 2, 3]
            );
            TimeoutManager.setNextTimeout(function () {
                claimDiscard({ discardCard: temp, discardPlayer: currentPlayer });
            }, TIME_LIMIT);
        } else if (chowPlayer !== -1) {
            playersPublics[chowPlayer].push(selectedChow);
            currentPlayer = chowPlayer;
            players[currentPlayer].push(discardCard);
            selectedChow.forEach(function (tile, index) {
                popTile(players[currentPlayer], tile);
            });
            var temp = getRandomTile(players[currentPlayer]);
            ServerCommService.send(
                MESSAGE_TYPE.SC_CONFIRM_CHOW,
                { player: chowPlayer, result: selectedChow, playerHand: players[currentPlayer] },
                [0, 1, 2, 3]
            );
            TimeoutManager.setNextTimeout(function () {
                claimDiscard({ discardCard: temp, discardPlayer: currentPlayer });
            }, TIME_LIMIT);
        } else {
            currentPlayer = (currentPlayer + 1) % PLAYERS;
            askPlayer();
        }
        kongPlayer = -1;
        pongPlayer = -1;
        chowPlayer = -1;
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
