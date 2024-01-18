import { GameScene } from "./GameScene";
import Tile from "./Tile";

export default cc.Class({
    extends: cc.Component,

    properties: {
        hand: cc.Node,
        current: cc.Node,
    },


    onLoad() { },

    start() {

    },

    initHand(tiles) {
        this.hand.removeAllChildren();

        tiles.forEach((tile, index) => {
            let tileNode = cc.instantiate(GameScene.tilePrefab);
            const tileComponent = tileNode.getComponent(Tile);
            tileComponent.setTile(tile);
            this.hand.addChild(tileNode);
        });
    },

    setDrawCard(drawCard) {
        this.current.removeAllChildren();

        let tileNode = cc.instantiate(GameScene.tilePrefab);
        const tileComponent = tileNode.getComponent(Tile);
        tileComponent.setTile(drawCard);
        this.current.addChild(tileNode);
    },

    clearDrawCard(){
        this.current.removeAllChildren();
    },

    update(dt) { },
});
