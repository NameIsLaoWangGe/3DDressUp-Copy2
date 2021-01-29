import ADManager, { TaT } from "../../TJ/Admanager";
import { Adaptive, Admin, Animation2D, Click, DataAdmin, DateAdmin, Dialogue, Effects2D, StorageAdmin, TimerAdmin, Tools } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";
import { _GameEffects2D } from "./GameEffects2D";

export default class Tweeting_GetFans extends Admin._SceneBase {
    pitchObj: any;
    fansNum = 0;
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.BtnShow, 'ADrank');
        this.pitchObj = _GameData._Ranking._ins()._getPitchObj();
        this.fansNum = Tools._Number.randomOneInt(115, 383);
        this.pitchObj['fansNum'] += this.fansNum;
        this._FontClipVar('FansNum').value = this.fansNum.toString();
    }
    lwgOpenAni(): number {
        _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
            _GameEffects2D._interfacePointJet();
            !_GameData._Guide._complete && this._openScene('Guide', false, false, () => {
                this._evNotify(_GameData._Guide.event.TweetingBtnDoubleFans, [this._ImgVar('BtnDouble')._lwg.gPoint.x, this._ImgVar('BtnDouble')._lwg.gPoint.y]);
            });
            TimerAdmin._loop(2000, this, () => {
                Animation2D.bomb_LeftRight(this._ImgVar('BtnDouble'), 1.1, 250);
            }, true);
        });
        return 300;
    }
    lwgButton(): void {
        // 关闭需执行
        var closeBefore = () => {
            _GameData._Ranking._ins()._whereFrom = 'Tweeting';
            _GameData._Tweeting._photo.clear();
            this._closeScene('Tweeting_Dynamic');
            this._closeScene();
            !_GameData._Guide._complete && this._evNotify(_GameData._Guide.event.closeGuide);
        }
        this._btnUp(this._ImgVar('BtnOk'), () => {
            closeBefore();
        })
        var double = () => {
            this.pitchObj['fansNum'] += this.fansNum;
            Dialogue.createHint_Middle('太厉害了，涨粉翻倍了！');
            closeBefore();
        }
        this._btnUp(this._ImgVar('BtnDouble'), () => {
            // 新手引导的时候直接给予奖励
            if (!_GameData._Guide._complete) {
                double();
            } else {
                ADManager.TAPoint(TaT.BtnClick, 'ADrank');
                ADManager.ShowReward(() => {
                    double();
                })
            }
        })
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
            this._openScene('Ranking', false);
        });
    }
    lwgOnDisable(): void {
    }
}