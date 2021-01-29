import ADManager, { TaT } from "../../TJ/Admanager";
import Lwg, { Admin, Animation2D, AudioAdmin, DataAdmin, Effects2D, TimerAdmin, Tools } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";
import { _GameEffects2D } from "./GameEffects2D";
import { _Res } from "./_Res";

export type _otherPro = {
    $rankNum: any;
    $fansNum: any;
} & Lwg.DataAdmin._BaseProperty;
export class RankingItem extends DataAdmin._Item implements _otherPro {
    get $rankNum(): string {
        return this.$data ? this.$data['rankNum'] : null;
    };
    get $fansNum(): string {
        return this.$data ? this.$data['fansNum'] : null;
    };
    $render(): void {
        if (this.$data[_GameData._Ranking._ins()._property.$classify] === _GameData._Ranking._ins()._classify.self) {
            this._ImgChild('Board').skin = `Game/UI/Ranking/x_di.png`;
            this._LableChild('Name').text = _GameData._PersonalInfo._name;
        } else {
            this._ImgChild('Board').skin = `Game/UI/Ranking/w_di.png`;
            this._LableChild('Name').text = this.$data[_GameData._Ranking._ins()._property.$name];
        }
        this._LableChild('RankNum').text = String(this.$rankNum);
        this._LableChild('FansNum').text = String(this.$fansNum);
        const IconPic = this._LableChild('Icon').getChildAt(0) as Laya.Image;
        IconPic.skin = this.$data[_GameData._Ranking._ins()._otherPro.iconSkin];
    }
}
export default class Ranking extends Admin._SceneBase {
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.PageShow, 'rankpage');
        _GameData._Ranking._ins()._List = this._ListVar('List');
        if (_GameData._Ranking._ins()._whereFrom === 'Tweeting') {
            _GameData._Ranking._ins()._addProValueForAll(_GameData._Ranking._ins()._otherPro.fansNum, (): number => {
                return Tools._Number.randomOneInt(100, 150);
            })
        }
        this._evNotify(_GameData._Start.event.updateRanking);
        _GameData._Ranking._ins()._listRenderScript = RankingItem;
    }

    lwgOpenAni(): number {
        if (_GameData._Ranking._ins()._whereFrom === 'Tweeting') {
            _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('Background'));
        } else {
            _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
        }
        return 200;
    }

    lwgOpenAniAfter(): void {
        if (_GameData._Ranking._ins()._whereFrom === 'Tweeting') {
            _GameEffects2D._fireworksCelebrate(() => {
                !_GameData._Guide._complete && this._openScene('Guide', false, false, () => {
                    this.BtnCloseClick();
                    const gP = this._ImgVar('Content').localToGlobal(new Laya.Point(this._ImgVar('BtnClose').x, this._ImgVar('BtnClose').y));
                    this._evNotify(_GameData._Guide.event.RankingCloseBtn, [gP.x, gP.y]);
                }, this._Owner.zOrder + 1);
            });
            _GameData._Ranking._ins()._whereFrom = 'Start';
        }
    }
    lwgOnStart(): void {
        if (_GameData._Ranking._ins()._getProperty(_GameData._Ranking._ins()._pitchName, _GameData._Ranking._ins()._otherPro.rankNum) === 1) {
            _GameData._Ranking._ins()._List.scrollTo(0);
        } else {
            if (_GameData._Ranking._ins()._whereFrom === 'Tweeting') {
                _GameData._Ranking._ins()._listScrollToLast();
                _GameData._Ranking._ins()._listTweenToPitchChoose(-1, 1500);
            } else {
                _GameData._Ranking._ins()._listScrollToLast();
                _GameData._Ranking._ins()._listTweenToPitchChoose(-1, 600);
            }
        }
    }

    BtnCloseClick(): void {
        this._btnUp(this._ImgVar('BtnClose'), () => {
            this._closeScene();
            if (!_GameData._Guide._complete) {
                this._evNotify(_GameData._Guide.event.closeGuide);
                this._evNotify(_GameData._Start.event.BtnPersonalInfo);
            }
        })
    }
    lwgButton(): void {
        if (!_GameData._Guide._complete) return;
        this.BtnCloseClick();
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
            _GameData._Guide._complete && !_GameData._CheckIn._ins()._todayCheckIn && this._openScene('CheckIn', false);
        });
    }

    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.PageLeave, 'rankpage');
    }
}
