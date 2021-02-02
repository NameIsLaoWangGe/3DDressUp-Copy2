import { LwgScene } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _BackHint, _PreLoadCutIn } from "./_GameData";
import { _SceneName } from "./_SceneName";
export default class BackHint extends LwgScene._SceneBase {
    closeAniType = null;
    lwgOpenAni(): number {
        return _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
    }
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnLeave'), () => {
            _PreLoadCutIn._fromBack = true;
            _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                this._Owner.close();
                _BackHint._whereScene[_BackHint._whereScene.name]._openScene(_SceneName.Start, true, true);
            });
        })

        var close = () => {
            this.closeAniType = 100;
            _BackHint._3dToSp && _BackHint._3dToSp.destroy();
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