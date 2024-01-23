import { GameScene } from "./GameScene";
import Triple from "./Triple";

export default cc.Class({
    extends: cc.Component,

    properties: {
    },


    onLoad() { },

    start() {

    },

    add(tiles) {
        let tripleNode = cc.instantiate(GameScene.triplePrefab);
        const tripleComponent = tripleNode.getComponent(Triple);
        tripleComponent.setTiles(tiles);
        tripleNode.setScale(0.8, 0.8);
        tripleNode.getComponent(cc.Button).interactable = false;
        this.node.addChild(tripleNode);
    },

    update(dt) { },
});
