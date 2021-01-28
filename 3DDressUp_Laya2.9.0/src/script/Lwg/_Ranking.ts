import ADManager, { TaT } from "../../TJ/Admanager";
import { Admin, Animation2D, AudioAdmin, DataAdmin, Effects2D, TimerAdmin, Tools } from "./Lwg";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _GameEvent } from "./_GameEvent";
import { _Guide } from "./_Guide";
import { _PersonalInfo } from "./_PersonalInfo";
import { _Res } from "./_Res";
import { _Start } from "./_Start";

export module _Ranking {
    /**从哪里进来*/
    export let _whereFrom: string = 'Start';
    export class RankingItem extends DataAdmin._Item {
        $render(): void {
            if (this.$data[_GameData._Ranking._ins()._property.$classify] === _GameData._Ranking._ins()._classify.self) {
                this._ImgChild('Board').skin = `Game/UI/Ranking/x_di.png`;
                this._LableChild('Name').text = _PersonalInfo._name.value;
            } else {
                this._ImgChild('Board').skin = `Game/UI/Ranking/w_di.png`;
                this._LableChild('Name').text = this.$data[_GameData._Ranking._ins()._property.$name];
            }
            this._LableChild('RankNum').text = String(this.$data[_GameData._Ranking._ins()._otherPro.rankNum]);
            this._LableChild('FansNum').text = String(this.$data[_GameData._Ranking._ins()._otherPro.fansNum]);
            const IconPic = this._LableChild('Icon').getChildAt(0) as Laya.Image;
            IconPic.skin = this.$data[_GameData._Ranking._ins()._otherPro.iconSkin];
        }
    }
    export class Ranking extends Admin._SceneBase {
        lwgOnAwake(): void {
            ADManager.TAPoint(TaT.PageShow, 'rankpage');
            _GameData._Ranking._ins()._List = this._ListVar('List');
            if (_whereFrom === 'Tweeting') {
                _GameData._Ranking._ins()._addProValueForAll(_GameData._Ranking._ins()._otherPro.fansNum, (): number => {
                    return Tools._Number.randomOneInt(100, 150);
                })
            }
            this._evNotify(_GameEvent.Start.updateRanking);
            _GameData._Ranking._ins()._listRenderScript = RankingItem;
        }

        lwgOpenAni(): number {
            if (_whereFrom === 'Tweeting') {
                _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('Background'));
            } else {
                _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
            }
            return 200;
        }

        lwgOpenAniAfter(): void {
            if (_whereFrom === 'Tweeting') {
                _GameEffects2D._fireworksCelebrate(() => {
                    !_GameData._Guide._complete && this._openScene('Guide', false, false, () => {
                        this.BtnCloseClick();
                        const gP = this._ImgVar('Content').localToGlobal(new Laya.Point(this._ImgVar('BtnClose').x, this._ImgVar('BtnClose').y));
                        this._evNotify(_GameEvent.Guide.RankingCloseBtn, [gP.x, gP.y]);
                    }, this._Owner.zOrder + 1);
                });
                _whereFrom = 'Start';
            }
        }
        lwgOnStart(): void {
            if (_GameData._Ranking._ins()._getProperty(_GameData._Ranking._ins()._pitchName, _GameData._Ranking._ins()._otherPro.rankNum) === 1) {
                _GameData._Ranking._ins()._List.scrollTo(0);
            } else {
                if (_whereFrom === 'Tweeting') {
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
                    this._evNotify(_GameEvent.Guide.closeGuide);
                    this._evNotify(_GameEvent.Start.BtnPersonalInfo);
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
}

export default _Ranking.Ranking;