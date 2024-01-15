import { MESSAGE_TYPE, ROUNDS } from "../Common/Messages";
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT, TOTAL_TILES, WIN, LOSE, NOT_END, TOTAL_MOVEMENT, TOTAL_TIME } from "../Common/Constants";

//--------Defining global variables----------
var tile = {
    type: -1,
    semiType: -1,
    available: false,
    x: -1, // 0~18
    y: -1, // 0~38
    z: -1, // 0~9
}
var coordinates = [];
var tiles = [];
var availableTiles = [];
var availableMatches = [];
var moves = TOTAL_MOVEMENT;
var compareTiles = [];
var gameResult = null;
var timeTracker = null;
var reason = null;
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

function initHandlers() {
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, startGame);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_COMPARE_TILES, compareTilesFunction);
}

function getTile(x, y, z) {
    var result = null;
    for (var i = 0; i < tiles.length; i++) {
        if (tiles[i].x === x && tiles[i].y === y && tiles[i].z === z) {
            result = copyObject(tiles[i]);
            break;
        }
    }
    return result;
}

function isEmpty(x, y, z) {
    if (getTile(x, y, z) === null)
        return true;
    else return false;
}

function isTop(x, y, z) {
    // for (var i = 6; i > z; i--) {
    //     if (!isEmpty(x, y, i))
    //         return false;
    // }
    // return true;
    if (isEmpty(x, y, z + 1))
        return true;
    else return false;
}

function isSelectable(x, y, z) {
    var a = true; var b = true; var c = true; var d = true;
    var E = isEmpty(x, y, z + 1);
    if (!E)
        return false;
    var A = !isEmpty(x - 1, y - 1, z + 1); if (A) a = false;
    var B = !isEmpty(x - 1, y, z + 1); if (B) { a = false; b = false; }
    var C = !isEmpty(x - 1, y + 1, z + 1); if (C) b = false;
    var D = !isEmpty(x, y - 1, z + 1); if (D) { a = false; c = false; }
    var F = !isEmpty(x, y + 1, z + 1); if (F) { b = false; d = false; }
    var G = !isEmpty(x + 1, y - 1, z + 1); if (G) c = false;
    var H = !isEmpty(x + 1, y, z + 1); if (H) { c = false; d = false; }
    var I = !isEmpty(x + 1, y + 1, z + 1); if (I) d = false;
    if (a && b && c && d)
        return true;
    else return false;
}

function isLeftFree(tile) {
    if (isEmpty(tile.x, tile.y - 2, tile.z) && isEmpty(tile.x - 1, tile.y - 2, tile.z) && isEmpty(tile.x + 1, tile.y - 2, tile.z))
        return true;
    else return false;

}

function isRightFree(tile) {
    if (isEmpty(tile.x, tile.y + 2, tile.z) && isEmpty(tile.x - 1, tile.y + 2, tile.z) && isEmpty(tile.x + 1, tile.y + 2, tile.z))
        return true;
    else return false;

}

function getAvailableTiles() {
    availableTiles = [];
    for (var i = 0; i < tiles.length; i++) {
        var tile = tiles[i];
        if (isSelectable(tile.x, tile.y, tile.z)) {
            if (isLeftFree(tile) || isRightFree(tile)) {
                availableTiles.push(tile);
                tiles[i].available = true;
            } else {
                tiles[i].available = false;
            }
        }
        else {
            tiles[i].available = false;
        }
    }
}

function isMatch(tile1Type, tile2Type) {
    if (tile1Type === tile2Type)
        return true;
    else return false;
}

function getAvailableMatches() {
    availableMatches = [];
    for (var i = 0; i < availableTiles.length; i++)
        for (var j = i + 1; j < availableTiles.length; j++)
            if (isMatch(availableTiles[i].type, availableTiles[j].type))
                availableMatches.push([availableTiles[i], availableTiles[j]]);

    console.log("avl", availableMatches.length);
}

function isWinOrLose() {
    if (tiles.length === 0)
        gameResult = WIN;
    else {
        if (tiles.length > 0 && availableMatches.length === 0) {
            console.log("dddraw");
            var target = copyObject(tiles[0]);
            var r = false;
            for (var i = 1; i < tiles.length; i++) {
                if (tiles[i].x !== target.x || tiles[i].y !== target.y)
                    r = true;
            }
            if (!r) {
                // gameResult = LOSE;
                // reason = "move";
                var r = Math.floor(14 / tiles.length);
                for (var i = 0; i < tiles.length; i++) {
                    tiles[i].x = Math.floor(Math.random() * 7) * 2;
                    tiles[i].y = (Math.floor(Math.random() * r) + i * r) * 2;
                    tiles[i].z = 0;
                }
                getAvailableTiles();
                getAvailableMatches();
            } else {
                while (availableMatches.length === 0) {
                    // shuffle the tile positions in place
                    for (var i = tiles.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        var tempX = tiles[i].x;
                        var tempY = tiles[i].y;
                        var tempZ = tiles[i].z;
                        tiles[i].x = tiles[j].x;
                        tiles[i].y = tiles[j].y;
                        tiles[i].z = tiles[j].z;
                        tiles[j].x = tempX;
                        tiles[j].y = tempY;
                        tiles[j].z = tempZ;
                    }
                    for (var i = tiles.length - 1; i > 0; i--) {
                        var j = Math.floor(Math.random() * (i + 1));
                        var tempX = tiles[i].x;
                        var tempY = tiles[i].y;
                        var tempZ = tiles[i].z;
                        tiles[i].x = tiles[j].x;
                        tiles[i].y = tiles[j].y;
                        tiles[i].z = tiles[j].z;
                        tiles[j].x = tempX;
                        tiles[j].y = tempY;
                        tiles[j].z = tempZ;
                    }
                    getAvailableTiles();
                    getAvailableMatches();
                }
            }
            ServerCommService.send(
                MESSAGE_TYPE.SC_NO_MORE,
                {},
                [0],
            );
            setTimeout(() => {
                ServerCommService.send(
                    MESSAGE_TYPE.SC_DRAW_BOARD,
                    { tiles: tiles, availableTiles: availableTiles, moves: moves, succeed: false },
                    [0],
                );
            }, 2000)

        }
        if (moves === 0) {
            gameResult = LOSE;
            reason = "move";
        }
    }
}

function init() {
    startGame();
}

function startGame() {

    // init values
    gameResult = null;
    reason = null;
    coordinates = [
        { x: 0, y: 2, z: 0 },
        { x: 0, y: 4, z: 0 },
        { x: 0, y: 6, z: 0 },
        { x: 0, y: 8, z: 0 },
        { x: 0, y: 10, z: 0 },
        { x: 0, y: 12, z: 0 },
        { x: 0, y: 14, z: 0 },
        { x: 0, y: 16, z: 0 },
        { x: 0, y: 18, z: 0 },
        { x: 0, y: 20, z: 0 },
        { x: 0, y: 22, z: 0 },
        { x: 0, y: 24, z: 0 },
        { x: 2, y: 6, z: 0 },
        { x: 2, y: 8, z: 0 },
        { x: 2, y: 10, z: 0 },
        { x: 2, y: 12, z: 0 },
        { x: 2, y: 14, z: 0 },
        { x: 2, y: 16, z: 0 },
        { x: 2, y: 18, z: 0 },
        { x: 2, y: 20, z: 0 },
        { x: 4, y: 4, z: 0 },
        { x: 4, y: 6, z: 0 },
        { x: 4, y: 8, z: 0 },
        { x: 4, y: 10, z: 0 },
        { x: 4, y: 12, z: 0 },
        { x: 4, y: 14, z: 0 },
        { x: 4, y: 16, z: 0 },
        { x: 4, y: 18, z: 0 },
        { x: 4, y: 20, z: 0 },
        { x: 4, y: 22, z: 0 },
        { x: 6, y: 2, z: 0 },
        { x: 6, y: 4, z: 0 },
        { x: 6, y: 6, z: 0 },
        { x: 6, y: 8, z: 0 },
        { x: 6, y: 10, z: 0 },
        { x: 6, y: 12, z: 0 },
        { x: 6, y: 14, z: 0 },
        { x: 6, y: 16, z: 0 },
        { x: 6, y: 18, z: 0 },
        { x: 6, y: 20, z: 0 },
        { x: 6, y: 22, z: 0 },
        { x: 6, y: 24, z: 0 },
        { x: 6, y: 26, z: 0 },
        { x: 7, y: 0, z: 0 },
        { x: 8, y: 2, z: 0 },
        { x: 8, y: 4, z: 0 },
        { x: 8, y: 6, z: 0 },
        { x: 8, y: 8, z: 0 },
        { x: 8, y: 10, z: 0 },
        { x: 8, y: 12, z: 0 },
        { x: 8, y: 14, z: 0 },
        { x: 8, y: 16, z: 0 },
        { x: 8, y: 18, z: 0 },
        { x: 8, y: 20, z: 0 },
        { x: 8, y: 22, z: 0 },
        { x: 8, y: 24, z: 0 },
        { x: 8, y: 26, z: 0 },
        { x: 10, y: 4, z: 0 },
        { x: 10, y: 6, z: 0 },
        { x: 10, y: 8, z: 0 },
        { x: 10, y: 10, z: 0 },
        { x: 10, y: 12, z: 0 },
        { x: 10, y: 14, z: 0 },
        { x: 10, y: 16, z: 0 },
        { x: 10, y: 18, z: 0 },
        { x: 10, y: 20, z: 0 },
        { x: 10, y: 22, z: 0 },
        { x: 12, y: 6, z: 0 },
        { x: 12, y: 8, z: 0 },
        { x: 12, y: 10, z: 0 },
        { x: 12, y: 12, z: 0 },
        { x: 12, y: 14, z: 0 },
        { x: 12, y: 16, z: 0 },
        { x: 12, y: 18, z: 0 },
        { x: 12, y: 20, z: 0 },
        { x: 14, y: 2, z: 0 },
        { x: 14, y: 4, z: 0 },
        { x: 14, y: 6, z: 0 },
        { x: 14, y: 8, z: 0 },
        { x: 14, y: 10, z: 0 },
        { x: 14, y: 12, z: 0 },
        { x: 14, y: 14, z: 0 },
        { x: 14, y: 16, z: 0 },
        { x: 14, y: 18, z: 0 },
        { x: 14, y: 20, z: 0 },
        { x: 14, y: 22, z: 0 },
        { x: 14, y: 24, z: 0 },
        { x: 2, y: 8, z: 1 },
        { x: 2, y: 10, z: 1 },
        { x: 2, y: 12, z: 1 },
        { x: 2, y: 14, z: 1 },
        { x: 2, y: 16, z: 1 },
        { x: 2, y: 18, z: 1 },
        { x: 4, y: 8, z: 1 },
        { x: 4, y: 10, z: 1 },
        { x: 4, y: 12, z: 1 },
        { x: 4, y: 14, z: 1 },
        { x: 4, y: 16, z: 1 },
        { x: 4, y: 18, z: 1 },
        { x: 6, y: 8, z: 1 },
        { x: 6, y: 10, z: 1 },
        { x: 6, y: 12, z: 1 },
        { x: 6, y: 14, z: 1 },
        { x: 6, y: 16, z: 1 },
        { x: 6, y: 18, z: 1 },
        { x: 8, y: 8, z: 1 },
        { x: 8, y: 10, z: 1 },
        { x: 8, y: 12, z: 1 },
        { x: 8, y: 14, z: 1 },
        { x: 8, y: 16, z: 1 },
        { x: 8, y: 18, z: 1 },
        { x: 10, y: 8, z: 1 },
        { x: 10, y: 10, z: 1 },
        { x: 10, y: 12, z: 1 },
        { x: 10, y: 14, z: 1 },
        { x: 10, y: 16, z: 1 },
        { x: 10, y: 18, z: 1 },
        { x: 12, y: 8, z: 1 },
        { x: 12, y: 10, z: 1 },
        { x: 12, y: 12, z: 1 },
        { x: 12, y: 14, z: 1 },
        { x: 12, y: 16, z: 1 },
        { x: 12, y: 18, z: 1 },
        { x: 4, y: 10, z: 2 },
        { x: 4, y: 12, z: 2 },
        { x: 4, y: 14, z: 2 },
        { x: 4, y: 16, z: 2 },
        { x: 6, y: 10, z: 2 },
        { x: 6, y: 12, z: 2 },
        { x: 6, y: 14, z: 2 },
        { x: 6, y: 16, z: 2 },
        { x: 8, y: 10, z: 2 },
        { x: 8, y: 12, z: 2 },
        { x: 8, y: 14, z: 2 },
        { x: 8, y: 16, z: 2 },
        { x: 10, y: 10, z: 2 },
        { x: 10, y: 12, z: 2 },
        { x: 10, y: 14, z: 2 },
        { x: 10, y: 16, z: 2 },
        { x: 6, y: 12, z: 3 },
        { x: 6, y: 14, z: 3 },
        { x: 8, y: 12, z: 3 },
        { x: 8, y: 14, z: 3 },
        { x: 7, y: 13, z: 4 },
    ];
    // coordinates = [
    //     { x: 0, y: 2, z: 0 },
    //     { x: 0, y: 2, z: 1 },
    //     { x: 0, y: 2, z: 2 },
    //     { x: 0, y: 2, z: 3 },
    //     { x: 0, y: 2, z: 4 },
    //     { x: 6, y: 2, z: 0 },
    //     { x: 8, y: 6, z: 0 },
    //     { x: 8, y: 2, z: 0 },
    //     { x: 10, y: 8, z: 0 },
    // ];
    coordinates.sort(function (a, b) {
        return Math.floor(Math.random() * 3) - 1;
    });
    coordinates.sort(function (a, b) {
        return Math.floor(Math.random() * 3) - 1;
    });
    tiles = [];
    for (var i = 0; i < TOTAL_TILES; i++) {
        var temp = [];
        temp = copyObject(tile);
        temp.type = Math.floor(i / 4);
        if (temp.type >= 0 && temp.type <= 8) {
            temp.semiType = 0;
        } else if (temp.type >= 9 && temp.type <= 17) {
            temp.semiType = 1;
        } else if (temp.type >= 18 && temp.type <= 26) {
            temp.semiType = 2;
        } else if (temp.type >= 27 && temp.type <= 28) {
            switch (temp.type) {
                case 27:
                    temp.semiType = 3 + (Math.floor(i % 4) + 1) / 10;
                    break;
                case 28:
                    temp.semiType = 4 + (Math.floor(i % 4) + 1) / 10;
                    break;
                default:
                    0;
            }
        } else if (temp.type >= 29 && temp.type <= 35) {
            temp.semiType = 5 + (temp.type - 29);
        }
        temp.available = false;
        if (coordinates[i]) {
            temp.x = coordinates[i].x; // 0~18
            temp.y = coordinates[i].y; // 0~38
            temp.z = coordinates[i].z; // 0~9
            tiles.push(temp);
        }
    }
    // tiles = tiles.slice(0, 8);
    availableTiles = [];
    availableMatches = [];
    moves = TOTAL_MOVEMENT;

    while (availableMatches.length === 0) {
        // shuffle the tile positions in place
        for (var i = tiles.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tempX = tiles[i].x;
            var tempY = tiles[i].y;
            var tempZ = tiles[i].z;
            tiles[i].x = tiles[j].x;
            tiles[i].y = tiles[j].y;
            tiles[i].z = tiles[j].z;
            tiles[j].x = tempX;
            tiles[j].y = tempY;
            tiles[j].z = tempZ;
        }
        for (var i = tiles.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tempX = tiles[i].x;
            var tempY = tiles[i].y;
            var tempZ = tiles[i].z;
            tiles[i].x = tiles[j].x;
            tiles[i].y = tiles[j].y;
            tiles[i].z = tiles[j].z;
            tiles[j].x = tempX;
            tiles[j].y = tempY;
            tiles[j].z = tempZ;
        }
        getAvailableTiles();
        getAvailableMatches();
    }

    getAvailableTiles();
    getAvailableMatches();

    //send tiles
    ServerCommService.send(
        MESSAGE_TYPE.SC_START_GAME,
        { tiles: tiles, availableTiles: availableTiles, moves: moves },
        [0],
    );

    timeTracker = setTimeout(() => {
        gameResult = LOSE;
        reason = "time";
        gameOver();
    }, TOTAL_TIME * 1000);

}

function compareTilesFunction(params, room) {
    compareTiles = params.compareTiles;
    moves = moves - 1;
    var succeed = false;
    if (isMatch(compareTiles[0].type, compareTiles[1].type)) {
        deleteTile(compareTiles[0]);
        deleteTile(compareTiles[1]);
        succeed = true;
        getAvailableTiles();
        getAvailableMatches();
    }
    ServerCommService.send(
        MESSAGE_TYPE.SC_DRAW_BOARD,
        { tiles: tiles, availableTiles: availableTiles, moves: moves, succeed: succeed },
        [0],
    );
    isWinOrLose();
    if (gameResult !== null) {
        clearTimeout(timeTracker);
        gameOver();
    }
}

function deleteTile(tile) {
    console.log("tile", tile);
    tiles = tiles.filter(function (item) {
        if (item.x === tile.x && item.y === tile.y && item.z === tile.z) {
        } else {
            return item;
        }
    });
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
            timeLimit ? timeLimit * 1000 : TIME_LIMIT * 1000
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
