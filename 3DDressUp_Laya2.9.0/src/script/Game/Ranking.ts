import ADManager, { TaT } from "../../TJ/Admanager";
import Lwg, { LwgScene, LwgData, LwgTools } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _CheckIn, _Guide, _PersonalInfo, _Ranking, _Start } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _Res } from "./_Res";

export class RankingItem extends LwgData._Item {
    $data: _Ranking._mergePro;
    $render(): void {
        if (this.$data.classify === _Ranking._Data._ins()._classify.self) {
            this._ImgChild('Board').skin = `Game/UI/Ranking/x_di.png`;
            this._LableChild('Name').text = _PersonalInfo._name.value;
        } else {
            this._ImgChild('Board').skin = `Game/UI/Ranking/w_di.png`;
            this._LableChild('Name').text = this.$data[_Ranking._Data._ins()._property.name];
        }
        this._LableChild('RankNum').text = String(this.$data.rankNum);
        this._LableChild('FansNum').text = String(this.$data.fansNum);
        const IconPic = this._LableChild('Icon').getChildAt(0) as Laya.Image;
        IconPic.skin = this.$data.iconSkin;
    }
}
export default class Ranking extends LwgScene._SceneBase {
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.PageShow, 'rankpage');
        _Ranking._Data._ins()._List = this._ListVar('List');
        if (_Ranking._whereFrom === 'Tweeting') {
            _Ranking._Data._ins()._addProValueForAll(_Ranking._Data._ins()._mergePro.fansNum, (): number => {
                return LwgTools._Number.randomOneInt(100, 150);
            })
        }
        this._evNotify(_Start.Event.updateRanking);
        _Ranking._Data._ins()._listRenderScript = RankingItem;
    }

    lwgOpenAni(): number {
        if (_Ranking._whereFrom === 'Tweeting') {
            _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('Background'));
        } else {
            _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
        }
        return 200;
    }

    lwgOpenAniAfter(): void {
        if (_Ranking._whereFrom === 'Tweeting') {
            _GameEffects2D._fireworksCelebrate(() => {
                !_Guide._complete.value && this._openScene('Guide', false, false, () => {
                    this.BtnCloseClick();
                    const gP = this._ImgVar('Content').localToGlobal(new Laya.Point(this._ImgVar('BtnClose').x, this._ImgVar('BtnClose').y));
                    this._evNotify(_Guide.Event.RankingCloseBtn, [gP.x, gP.y]);
                }, this._Owner.zOrder + 1);
            });
            _Ranking._whereFrom = 'Start';
        }
    }
    lwgOnStart(): void {
        if (_Ranking._Data._ins()._getProperty(_Ranking._Data._ins()._pitchName, _Ranking._Data._ins()._mergePro.rankNum) === 1) {
            _Ranking._Data._ins()._List.scrollTo(0);
        } else {
            if (_Ranking._whereFrom === 'Tweeting') {
                _Ranking._Data._ins()._listScrollToLast();
                _Ranking._Data._ins()._listTweenToPitchChoose(-1, 1500);
            } else {
                _Ranking._Data._ins()._listScrollToLast();
                _Ranking._Data._ins()._listTweenToPitchChoose(-1, 600);
            }
        }
    }

    BtnCloseClick(): void {
        this._btnUp(this._ImgVar('BtnClose'), () => {
            this._closeScene();
            if (!_Guide._complete.value) {
                this._evNotify(_Guide.Event.closeGuide);
                this._evNotify(_Start.Event.BtnPersonalInfo);
            }
        })
    }
    lwgButton(): void {
        if (!_Guide._complete.value) return;
        this.BtnCloseClick();
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
            _Guide._complete.value && !_CheckIn._todayCheckIn && this._openScene('CheckIn', false);
        });
    }

    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.PageLeave, 'rankpage');
    }
}
