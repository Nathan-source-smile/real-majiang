import Accept from "./Accept";
import { ClientCommService } from "./ClientCommService";
var global = require("./global");
import Tile from "./Tile";

export default cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,

        _tiles: null,
    },


    onLoad() { },

    start() {

    },

    setTiles(tiles) {
        this._tiles = tiles;
        this.background.removeAllChildren();
        tiles.forEach((tile, index) => {
            let tileNode = cc.instantiate(global.scenes['gameScene'].tilePrefab);
            const tileComponent = tileNode.getComponent(Tile);
            tileComponent.setTile(tile);
            tileNode.getComponent(cc.Button).interactable = false;
            this.background.addChild(tileNode);
        });
        this.node.width = 47 * tiles.length + 10;
    },

    onClick() {
        let player = this.node.getParent().getComponent(Accept)._player;
        global.scenes['gameScene'].stopPlayer(player);
        ClientCommService.sendClaimChow(player, this._tiles);
    },

    update(dt) { },
});
