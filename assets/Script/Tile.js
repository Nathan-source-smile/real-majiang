import { ClientCommService } from "./ClientCommService";
import GlobalData from "./Common/GlobalData";
var global = require("./global");
import PlayerHand from "./PlayerHand";

export default cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Sprite,

        _id: -1,
        _type: -1,
        _semiType: -1,
        _tile: null,
    },

    onLoad() {
    },

    setTile(tile) {
        this._id = tile.id;
        this._type = tile.type;
        this._semiType = tile.semiType;
        this._tile = tile;

        var spriteName = "";
        if (tile.type >= 0 && tile.type <= 8) {
            spriteName = "ci-0" + (tile.type % 9 + 1)
        } else if (tile.type >= 9 && tile.type <= 17) {
            spriteName = "ba-0" + (tile.type % 9 + 1)
        } else if (tile.type >= 18 && tile.type <= 26) {
            spriteName = "le-0" + (tile.type % 9 + 1)
        } else if (tile.type >= 27 && tile.type <= 33) {
            switch (tile.type) {
                case 32:
                    spriteName = "p-oeste";
                    break;
                case 30:
                    spriteName = "p-este";
                    break;
                case 33:
                    spriteName = "p-sur";
                    break;
                case 31:
                    spriteName = "p-norte";
                    break;
                case 28:
                    spriteName = "c-rojo";
                    break;
                case 27:
                    spriteName = "c-verde";
                    break;
                case 29:
                    spriteName = "c-blanco";
                    break;
                default:
                    0;
            }
        }
        // console.log("sprite name", spriteName);
        this.background.spriteFrame = GlobalData.imgAtlas.getSpriteFrame("tiles-" + spriteName);
    },

    onClickTile() {
        let playerHand = this.node.getParent()?.getParent()?.getComponent(PlayerHand);
        if (playerHand) {
            if (playerHand.player === global.scenes['gameScene']._currentPlayer && !playerHand._click) {
                console.log(this._id);
                playerHand._click = true;
                ClientCommService.sendClaimDiscard(this._tile, global.scenes['gameScene']._currentPlayer);
            }
        }
    },

    update(dt) { },
});
