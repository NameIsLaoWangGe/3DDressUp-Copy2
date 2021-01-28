import ADManager from "../../TJ/Admanager";
import { Admin, Click } from "./Lwg";
import { _GameAni } from "./_GameAni";
export module _AdsHint {
    export class AdsHint extends Admin._SceneBase {
        adAction: any;
        setCallBack(_adAction: any): void {
            this.adAction = _adAction;
        }
        lwgOpenAni(): number {
            _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
            return 200;
        }
        lwgButton(): void {
            this._btnUp(this._ImgVar('BtnClose'), () => {
                this._closeScene();
            })
            this._btnUp(this._ImgVar('BtnConfirm'), () => {
                ADManager.ShowReward(this.adAction, null);
                this._closeScene();
            })
        }

        lwgCloseAni(): number {
            _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
            return 200;
        }
    }
}
export default _AdsHint.AdsHint;

