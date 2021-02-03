import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";
import { LwgClick, LwgScene } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _DressingRoom, _MakePattern, _Share, _Tweeting } from "./_GameData";
import { _SceneName } from "./_SceneName";

export default class Share extends LwgScene._SceneBase {

    lwgOnAwake(): void {
        LwgClick._stageSwitch = false;
        if (_Share._whereFrom === _SceneName.MakePattern) {
            this._SpriteVar('Photo').texture = _Tweeting._photo.arr[0];
        } else if (_Share._whereFrom === _SceneName.DressingRoom) {
            this._SpriteVar('Photo').texture = _Tweeting._photo.arr[3];
        }
    }
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
            this._evNotify(_DressingRoom.Event.byteDanceBackStart);
        }
    }

    lwgButton(): void {
        var func = () => {
            RecordManager._share('noAward', () => {
                this.closeFunc();
            });
        }
        this._btnUp(this._ImgVar('BtnShare'), () => {
            func();
        })

        this._btnUp(this._ImgVar('BtnBoard'), () => {
            func();
        }, 'null');

        this._btnUp(this._ImgVar('BtnClose'), () => {
            this._closeScene();
        })
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
            this.closeFunc();
            LwgClick._stageSwitch = true;
        });
    }
}