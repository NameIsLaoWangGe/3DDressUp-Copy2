import lwg, { Admin } from "./Lwg";
import { _GameAni } from "./_GameAni";
import { _PreLoadCutIn } from "./_PreLoadCutIn";

export module _BackHint {
    export let _3dToSp: Laya.Sprite;
    export let _fromScene: Laya.Scene;
    export class BackHint extends Admin._SceneBase {
        closeAniType = null;
        lwgOpenAni(): number {
            return _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
        }
        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnLeave'), () => {
                this._evNotify(_PreLoadCutIn._Event.fromBtnBack);
                _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                    this._Owner.close();
                    _fromScene[_fromScene.name]._openScene('Start', true, true);
                });
            })

            var close = () => {
                this.closeAniType = 100;
                _3dToSp && _3dToSp.destroy();
                _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                    this._Owner.close();
                });
            }

            this._btnUp(this._ImgVar('BtnContinue'), () => {
                close();
            })

            this._btnUp(this._ImgVar('BtnClose'), () => {
                close();
            })
        }

        lwgCloseAni(): number {
            return this.closeAniType;
        }
    }
}