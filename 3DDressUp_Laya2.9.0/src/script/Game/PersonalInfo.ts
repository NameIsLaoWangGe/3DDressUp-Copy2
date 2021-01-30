import ADManager, { TaT } from "../../TJ/Admanager";
import {  LwgScene, LwgColor, LwgTimer } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _Guide, _PersonalInfo, _Ranking } from "./_GameData";

export default class PersonalInfo extends  LwgScene._SceneBase {
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.BtnShow, 'changename');

        this._TextInputVar('NameValue').text = _PersonalInfo._name.value;
        const obj = _Ranking._Data._ins()._getPitchObj();
        this._LabelVar('RankValue').text = obj[_Ranking._Data._ins()._otherPro.rankNum];
        this._LabelVar('FansValue').text = obj[_Ranking._Data._ins()._otherPro.fansNum];
    }

    lwgOpenAni(): number {
        return _GameAni._dialogOpenFadeOut(this._ImgVar('Background'), this._ImgVar('Content'), () => {

            !_Guide._complete.value && this._openScene('Guide', false, false, () => {
                const gP = this._ImgVar('Name').localToGlobal(new Laya.Point(this._ImgVar('NameValue').x, this._ImgVar('NameValue').y));
                this._evNotify(_Guide.Event.PersonalInfoWriteName, [gP.x, gP.y]);
            }, this._Owner.zOrder + 1);

            LwgTimer._frameLoop(200, this, () => {
                this._AniVar('ani1').play(0, false);
                this._AniVar('ani1').on(Laya.Event.LABEL, this, (e: string) => {
                    if (e === 'comp') {
                        LwgColor._changeOnce(this._ImgVar('Head'), [50, 10, 10, 1], 40);
                    }
                })
            }, true)
        });
    }

    BtnCloseClick(): void {
        this._btnUp(this._ImgVar('BtnClose'), () => {
            !_Guide._complete.value && this._evNotify(_Guide.Event.vanishGuide);
            this._closeScene();
        })
    }
    lwgButton(): void {

        this._btnFour(this._ImgVar('NameValue'),
            () => {
                this._ImgVar('BtnWrite').scale(0.85, 0.85);
            }, () => {
                this._ImgVar('BtnWrite').scale(0.85, 0.85);
            }, () => {
                this._ImgVar('BtnWrite').scale(1, 1);
            }, () => {
                this._ImgVar('BtnWrite').scale(1, 1);
            })

        this._TextInputVar('NameValue').on(Laya.Event.FOCUS, this, () => {
            !_Guide._complete.value && this._evNotify(_Guide.Event.vanishGuide);
        });
        this._TextInputVar('NameValue').on(Laya.Event.INPUT, this, () => {
        });
        this._TextInputVar('NameValue').on(Laya.Event.BLUR, this, () => {
            if (this._TextInputVar('NameValue').text.length <= 5) {
                this._TextInputVar('NameValue').fontSize = 30;
            } else if (this._TextInputVar('NameValue').text.length === 6) {
                this._TextInputVar('NameValue').fontSize = 27;
            } else {
                this._TextInputVar('NameValue').fontSize = 24;
            }
            _PersonalInfo._name.value = this._TextInputVar('NameValue').text;

            if (!_Guide._complete.value) {
                this.BtnCloseClick();
                const gP = this._ImgVar('Content').localToGlobal(new Laya.Point(this._ImgVar('BtnClose').x, this._ImgVar('BtnClose').y));
                this._evNotify(_Guide.Event.PersonalInfoCloseBtn, [gP.x, gP.y]);
            }
        });
        if (!_Guide._complete.value) return;
        this.BtnCloseClick();
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
            !_Guide._complete.value && this._evNotify(_Guide.Event.DelayBtnCheckIn);
        });
    }

    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.BtnClick, 'changename');
    }
}