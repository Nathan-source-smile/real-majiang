var global = require("./global");
import Tile from "./Tile";

export default cc.Class({
    extends: cc.Component,

    properties: {
        DrawPileLabel: cc.Label,
        LastDiscardLabel: cc.Label,
        discardTile: cc.Node,
    },


    onLoad() { },

    start() {
        this.LastDiscardLabel.node.active = false;
    },

    setDrawPile(num) {
        this.DrawPileLabel.string = "Draw Pile: " + num;
    },

    showDiscard(discardCard) {
        this.LastDiscardLabel.node.active = true;
        this.discardTile.removeAllChildren();

        let tileNode = cc.instantiate(global.scenes['gameScene'].tilePrefab);
        const tileComponent = tileNode.getComponent(Tile);
        tileComponent.setTile(discardCard);
        this.discardTile.addChild(tileNode);
    },

    clearBoard(num) {
        this.LastDiscardLabel.node.active = false;
        this.discardTile.removeAllChildren();
        this.setDrawPile(num);
    },

    update(dt) { },
});
