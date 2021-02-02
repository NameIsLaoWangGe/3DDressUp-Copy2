import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";
import { LwgScene } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _MakePattern, _Share } from "./_GameData";
import { _SceneName } from "./_SceneName";

export default class Share extends LwgScene._SceneBase {

    lwgOpenAni(): number {
        this._ImgVar('BtnShare').visible = false;
        return _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('Background'), () => {
            this._ImgVar('BtnShare').visible = true;
            _GameAni._dialogOpenPopup(this._ImgVar('BtnShare'));
        });
    }

    closeFunc(): void {
        if (_Share._whereFrom === _SceneName.MakePattern) {
            this._evNotify(_MakePattern.Event.byteDanceBackStart);
        } else if (_Share._whereFrom === _SceneName.DressingRoom) {

        }
    }

    lwgButton(): void {
        var func = () => {
            RecordManager._share('noAward', () => {
                // ADManager.TAPoint(TaT.BtnClick, 'share_share');
                this.closeFunc();
            });
        }
        this._btnUp(this._ImgVar('BtnShare'), () => {
            func();
        })

        this._btnUp(this._ImgVar('BtnBoard'), () => {
            func();
        })

        this._btnUp(this._ImgVar('BtnClose'), () => {
            this._closeScene();
        })
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
            this.closeFunc();
        });
    }
}