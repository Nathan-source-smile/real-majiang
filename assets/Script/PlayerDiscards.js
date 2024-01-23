import { GameScene } from "./GameScene";
import Tile from "./Tile";

export default cc.Class({
    extends: cc.Component,

    properties: {
    },


    onLoad() { },

    start() {

    },

    clear() {
        this.node.removeAllChildren();
    },

    add(discardCard) {
        let tileNode = cc.instantiate(GameScene.tilePrefab);
        const tileComponent = tileNode.getComponent(Tile);
        tileComponent.setTile(discardCard);
        this.node.addChild(tileNode);
    },

    update(dt) { },
});
