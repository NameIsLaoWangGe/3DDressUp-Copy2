import lwg, { Admin } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";

export class BackHint extends Admin._SceneBase {
    closeAniType = null;
    lwgOpenAni(): number {
        return _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
    }
    lwgButton(): void {
        this._btnUp(this._ImgVar('BtnLeave'), () => {
            _GameData._PreLoadCutIn._fromBack = true;
            _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
                this._Owner.close();
                _GameData._BackHint._fromScene[_GameData._BackHint._fromScene.name]._openScene('Start', true, true);
            });
        })

        var close = () => {
            this.closeAniType = 100;
            _GameData._BackHint._3dToSp && _GameData._BackHint._3dToSp.destroy();
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