import ADManager from "../../TJ/Admanager";
import { SceneAdmin, DataAdmin, DateAdmin, Dialogue } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _CheckIn, _DIYClothes, _Guide, _MakePattern } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _Res } from "./_Res";

class _Item extends DataAdmin._Item {
    $button(): void {
        this._btnUp(this._ImgChild('Reward'), (e: Laya.Event) => {
            if (!_CheckIn._todayCheckIn) {
                if (_CheckIn._checkInNum + 1 === this.$serial) {
                    _CheckIn._lastCheckDate = DateAdmin._date.date;
                    _CheckIn._Data._setCompleteName(this.$name);
                    _CheckIn._checkInNum++;

                    if (this.$rewardType.substr(0, 3) === 'diy') {
                        _DIYClothes._ins()._setCompleteByName(this.$rewardType);
                        Dialogue.createHint_Middle('恭喜获得新的裁剪服装');
                        _GameEffects2D._oneFireworks(new Laya.Point(e.stageX, e.stageY));
                    } else if (this.$rewardType === 'cat') {
                        _MakePattern._Data._setCompleteByClassify(this.$rewardType);
                        Dialogue.createHint_Middle('恭喜获得猫咪贴图一套');
                        _GameEffects2D._oneFireworks(new Laya.Point(e.stageX, e.stageY));
                    }
                    if (!_Guide._complete) {
                        _Guide.CheckInCloseBtn = true;
                        this._evNotify(_Guide.event.CheckInCloseBtn, [this._SceneImg('BtnClose')._lwg.gPoint.x, this._SceneImg('BtnClose')._lwg.gPoint.y]);
                    }
                }
            } else {
                Dialogue.createHint_Middle('日期不对哦！');
            }
        })

        var func = (e: Laya.Event) => {
            ADManager.ShowReward(() => {
                _CheckIn._Data._setOtherCompleteName(this.$name);
                if (this.$otherRewardType.substr(0, 3) === 'diy') {
                    _DIYClothes._ins()._setCompleteByName(this.$otherRewardType);
                    Dialogue.createHint_Middle('恭喜获得新的裁剪服装');
                } else if (this.$otherRewardType === 'newYear') {
                    _MakePattern._Data._setCompleteByClassify(this.$otherRewardType);
                    Dialogue.createHint_Middle('恭喜获得新年贴图一套');
                }
                _GameEffects2D._oneFireworks(new Laya.Point(e.stageX, e.stageY));
            })
        }
        var adsClick = (e: Laya.Event) => {
            if (!this.$otherComplete) {
                if (!_CheckIn._todayCheckIn) {
                    if (_CheckIn._checkInNum + 1 >= this.$serial) {
                        func(e);
                    }
                } else {
                    if (_CheckIn._checkInNum >= this.$serial) {
                        func(e);
                    }
                }
            } else {
                Dialogue.createHint_Middle('日期不对哦！');
            }
        }
        this._btnUp(this._ImgChild('AdsReward'), adsClick);
        this._btnUp(this._ImgChild('BtnAdsReward'), adsClick);
    }

    $render(): void {
        this._LableChild('DayNum').text = this.$name;
        const Already = this._ImgChild('Reward').getChildByName('Already') as Laya.Label;
        const Icon = this._ImgChild('Reward').getChildByName('Icon') as Laya.Image;
        if (this.$rewardType.substr(0, 3) === 'diy') {
            Icon.skin = _DIYClothes._ins().getDIYCutIcon(this.$rewardType);
            Icon.scale(0.55, 0.55);
        } else if (this.$rewardType === 'cat') {
            Icon.skin = `Pattern/${this.$rewardType}1.png`;
            Icon.scale(0.18, 0.18);
        }
        Already.visible = this.$complete;
        if (!this.$complete) {
            if (_CheckIn._checkInNum + 1 === this.$serial) {
                if (_CheckIn._todayCheckIn) {
                    this._ImgChild('Reward').skin = 'Game/UI/ChekIn/k_nei.png';
                } else {
                    this._ImgChild('Reward').skin = 'Game/UI/ChekIn/k_nei1.png';
                }
            } else {
                this._ImgChild('Reward').skin = 'Game/UI/ChekIn/k_nei.png';
            }
        } else {
            this._ImgChild('Reward').skin = 'Game/UI/ChekIn/k_nei.png';
        }

        const AdsAlready = this._ImgChild('AdsReward').getChildByName('Already') as Laya.Label;
        const AdsIcon = this._ImgChild('AdsReward').getChildByName('Icon') as Laya.Image;
        if (this.$otherRewardType.substr(0, 3) === 'diy') {
            AdsIcon.skin = _DIYClothes._ins().getDIYCutIcon(this.$otherRewardType);
            AdsIcon.scale(0.55, 0.55);
        } else if (this.$otherRewardType === 'newYear') {
            AdsIcon.skin = `Pattern/${this.$otherRewardType}1.png`;
            AdsIcon.scale(0.16, 0.16);
        }
        AdsAlready.visible = this.$otherComplete;
        if (!this.$otherComplete) {
            if (!_CheckIn._todayCheckIn) {
                if (_CheckIn._checkInNum + 1 >= this.$serial) {
                    this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei1.png';
                    this._ImgChild('BtnAdsReward').gray = false;
                } else {
                    this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei.png';
                    this._ImgChild('BtnAdsReward').gray = true;
                }
            } else {
                if (_CheckIn._checkInNum >= this.$serial) {
                    this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei1.png';
                    this._ImgChild('BtnAdsReward').gray = false;
                } else {
                    this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei.png';
                    this._ImgChild('BtnAdsReward').gray = true;
                }
            }
        } else {
            this._ImgChild('AdsReward').skin = 'Game/UI/ChekIn/k_nei.png';
            this._ImgChild('BtnAdsReward').visible = false;
        }
    }
}
export default class CheckIn extends SceneAdmin._SceneBase {
    lwgOnAwake(): void {
        _CheckIn._Data._List = this._ListVar('List');
        _CheckIn._Data._listRenderScript = _Item;
        _CheckIn._Data._List.scrollBar.touchScrollEnable = false;
        this._LabelVar('ImmediatelyNum').text = `${_CheckIn._immediately} / 4`;
        if (_CheckIn._immediately >= 4 || _CheckIn._checkInNum >= 4) {
            this._ImgVar('BtnImmediately').visible = false;
            this._LabelVar('Tip').text = `奖励已经全部领取！`;
        }
    }
    lwgOpenAni(): number {
        return _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
            this._openScene('Guide', false, false, () => {
                this.BtnCloseClick();
                !_Guide._complete && this._evNotify(_Guide.event.CheckInGetReward, [this._ImgVar('GuideTab1')._lwg.gPoint.x, this._ImgVar('GuideTab1')._lwg.gPoint.y]);
            })
        });
    }

    BtnCloseClick(): void {
        this._btnUp(this._ImgVar('BtnClose'), () => {
            if (!_Guide._complete && _Guide.CheckInCloseBtn) {
                _Guide._complete = true;
                Dialogue.createHint_Middle('开启你的女神之路吧!');
                this._evNotify(_Guide.event.closeGuide);
                this._evNotify(_Guide.event.StartOtherBtnClick);
            }
            this._closeScene();
        })
    }

    lwgButton(): void {
        if (!_Guide._complete) return;
        this.BtnCloseClick();
        this._btnUp(this._ImgVar('BtnImmediately'), () => {
            if (_CheckIn._immediately < 4) {
                ADManager.ShowReward(() => {
                    _CheckIn._immediately++;
                    this._LabelVar('ImmediatelyNum').text = `${_CheckIn._immediately} / 4 `;
                    if (_CheckIn._immediately >= 4) {
                        this._ImgVar('BtnImmediately').visible = false;
                        const gP1 = this._ImgVar('GuideTab1')._lwg.gPoint;
                        _CheckIn._Data._setAllCompleteDelay(300, (com: boolean) => {
                            const copyP1 = new Laya.Point(gP1.x, gP1.y);
                            if (!com) {
                                _GameEffects2D._oneFireworks(copyP1);
                            }
                            gP1.x += 165;
                        }, null, null);
                        const gP2 = this._ImgVar('GuideTab2')._lwg.gPoint;
                        _CheckIn._Data._setAllOtherCompleteDelay(300, (com: boolean) => {
                            const copyP2 = new Laya.Point(gP2.x, gP2.y);
                            if (!com) {
                                _GameEffects2D._oneFireworks(copyP2);
                            }
                            gP2.x += 165;
                        }, null, () => {
                            Dialogue.createHint_Middle('奖励已经全部获得，快去制作服装吧！');
                        });
                        _DIYClothes._ins()._setCompleteByNameArr(['diy_dress_003_final', 'diy_dress_007_final', 'diy_top_004_final', 'diy_bottom_005_final', 'diy_dress_006_final', 'diy_bottom_006_final']);
                        _MakePattern._Data._setCompleteByClassify('cat');
                        _MakePattern._Data._setCompleteByClassify('newYear');
                    }
                })
            } else {
                Dialogue.createHint_Middle('奖励已经全部获得，无需在看广告o.o！')
            }
        })
    }

    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('Background'));
    }
}