import ADManager, { TaT } from "../../TJ/Admanager";
import { LwgScene, LwgAni2D, LwgDialogue, LwgTimer, LwgTools } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _Guide, _Ranking, _Tweeting } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _SceneName } from "./_SceneName";

export default class Tweeting_GetFans extends LwgScene._SceneBase {
    pitchObj: any;
    fansNum = 0;
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.BtnShow, 'ADrank');
        this.pitchObj = _Ranking._Data._ins()._getPitchObj();
        this.fansNum = LwgTools._Number.randomOneInt(115, 383);
        this.pitchObj['fansNum'] += this.fansNum;
        this._FontClipVar('FansNum').value = this.fansNum.toString();
    }
    lwgOpenAni(): number {
        _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
            _GameEffects2D._interfacePointJet();
            !_Guide._complete.value && this._openScene(_SceneName.Guide, false, false, () => {
                this._evNotify(_Guide.Event.TweetingBtnDoubleFans, [this._ImgVar('BtnOk')._lwg.gPoint.x, this._ImgVar('BtnOk')._lwg.gPoint.y]);
            });
            LwgTimer._loop(2000, this, () => {
                LwgAni2D.bomb_LeftRight(this._ImgVar('BtnDouble'), 1.1, 250);
            }, true);
        });
        return 300;
    }
    lwgButton(): void {
        // 关闭需执行
        var closeBefore = () => {
            _Ranking._whereFrom = _SceneName.Tweeting_GetFans;
            _Tweeting._photo.clear();
            this._closeScene(_SceneName.Tweeting_Dynamic);
            this._closeScene();
            !_Guide._complete.value && this._evNotify(_Guide.Event.closeGuide);
        }
        this._btnUp(this._ImgVar('BtnOk'), () => {
            closeBefore();
        })
        this._btnUp(this._ImgVar('BtnDouble'), () => {
            // 新手引导的时候直接给予奖励
            if (!_Guide._complete.value) return;
            ADManager.TAPoint(TaT.BtnClick, 'ADrank');
            ADManager.ShowReward(() => {
                this.pitchObj['fansNum'] += this.fansNum;
                LwgDialogue._middleHint('太厉害了，涨粉翻倍了！');
                closeBefore();
            })
        })
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
            this._openScene(_SceneName.Ranking, false);
        });
    }
    lwgOnDisable(): void {
    }
}