import ADManager, { TaT } from "../../TJ/Admanager";
import { Admin, Animation2D, TimerAdmin, _SceneName, Tools } from "../Lwg/Lwg";
import { _3DScene } from "./_3D";
import { _CheckIn, _DIYClothes, _Guide, _Ranking, _Start, _Tweeting } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
export default class Start extends Admin._SceneBase {
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.PageShow, 'mainpage');
        ADManager.TAPoint(TaT.BtnShow, 'symaker');
        ADManager.TAPoint(TaT.BtnShow, 'lyqmaker');
        ADManager.TAPoint(TaT.BtnShow, 'xzmaker');
        ADManager.TAPoint(TaT.BtnShow, 'change');

        Tools._Node.childrenVisible2D(this._ImgVar('BtnParent'), false);
        _3DScene._ins().openStartAni(() => {
            this._ImgVar('BtnTop').pos(_3DScene._ins().btnTopPos.x, _3DScene._ins().btnTopPos.y);
            this._ImgVar('BtnDress').pos(_3DScene._ins().btnDressPos.x, _3DScene._ins().btnDressPos.y);
            this._ImgVar('BtnBottoms').pos(_3DScene._ins().btnBottomsPos.x, _3DScene._ins().btnBottomsPos.y);
            this._ImgVar('BtnDressingRoom').pos(_3DScene._ins().btnDressingRoomPos.x, _3DScene._ins().btnDressingRoomPos.y);

            for (let index = 0; index < this._ImgVar('BtnParent').numChildren; index++) {
                const element = this._ImgVar('BtnParent').getChildAt(index) as Laya.Image;
                element.visible = false;
            }
        });
    }
    lwgOpenAniAfter(): void {
        for (let index = 0; index < this._ImgVar('BtnParent').numChildren; index++) {
            const element = this._ImgVar('BtnParent').getChildAt(index) as Laya.Image;
            element.visible = true;
            const delay = 200 * index;
            Animation2D.bombs_Appear(element, 0, 1, 1.2, 0, 200, () => {
                if (index === this._ImgVar('BtnParent').numChildren - 1) {
                    TimerAdmin._once(500, this, () => {
                        if (_Start._whereFrom === 'MakePattern') {
                            this._evNotify(_Start._event.photo);
                            _Start._whereFrom = null;
                        } else {
                            if (!_Guide._complete) {
                                this._openScene('Guide', false, false, () => {
                                    this.BtnDressClick();
                                    this._evNotify(_Guide.event.StartBtnDress, [this._ImgVar('BtnDress').x, this._ImgVar('BtnDress').y]);
                                })
                            } else {
                                !_CheckIn._todayCheckIn && this._openScene('CheckIn', false);
                            }
                        }
                    })
                }
            }, delay);
            _GameEffects2D._circleExplode(this._Owner, new Laya.Point(element.x, element.y), delay);
        }
    }
    lwgOnStart(): void {
        this._evNotify(_Start._event.updateRanking);
    }

    lwgEvent(): void {
        this._evReg(_Guide.event.DelayBtnCheckIn, () => {
            this.BtnCheckIn();
            this._evNotify(_Guide.event.BtnCheckIn, [this._ImgVar('BtnCheckIn').x, this._ImgVar('BtnCheckIn').y]);
        })

        this._evReg(_Guide.event.StartOtherBtnClick, () => {
            this.lwgButton();
        })

        this._evReg(_Start._event.updateRanking, () => {
            let obj = _Ranking._Data._getPitchObj();
            this._LabelVar('RankNum').text = `${obj[_Ranking._Data._otherPro.rankNum]}/50`;
        })
        this._evReg(_Start._event.photo, () => {
            const sp = _3DScene._ins().cameraToSprite(this._Owner);
            TimerAdmin._frameOnce(10, this, () => {
                _Tweeting._photo.take(this._Owner, 2);
                sp.destroy();
                TimerAdmin._frameOnce(10, this, () => {
                    this._openScene('Tweeting_Main', false);
                })
            })
        })

        this._evReg(_Start._event.BtnPersonalInfo, () => {
            TimerAdmin._once(1000, this, () => {
                this._openScene('Guide', false, false, () => {
                    this.BtnPersonalInfoClick();
                    this._evNotify(_Guide.event.PersonalInfoBtn, [this._ImgVar('BtnPersonalInfo').x, this._ImgVar('BtnPersonalInfo').y]);
                })
            })
        })
    }

    BtnDressClick(): void {
        this._btnUp(this._ImgVar('BtnDress'), () => {
            this._evNotify(_Guide.event.closeGuide);
            let time = 0;
            if (_Guide._complete) {
                time = 300;
            }
            TimerAdmin._once(time, this, () => {
                this.openMakeTailor('Dress');
            })
            ADManager.TAPoint(TaT.BtnClick, 'lyqmaker');
        })
    }

    BtnPersonalInfoClick(): void {
        this._btnUp(this._ImgVar('BtnPersonalInfo'), () => {
            !_Guide._complete && this._evNotify(_Guide.event.vanishGuide);
            this._openScene('PersonalInfo', false);
        })
    }

    BtnCheckIn(): void {
        this._btnUp(this._ImgVar('BtnCheckIn'), () => {
            !_Guide._complete && this._evNotify(_Guide.event.vanishGuide);
            this._openScene('CheckIn', false);
        })
    }

    openMakeTailor(_classify: string): void {
        _DIYClothes._ins()._pitchClassify = _classify;
        _3DScene._ins().cameraToSprite(this._Owner);
        this._openScene('MakeTailor', true, true);
    }

    lwgButton(): void {
        if (!_Guide._complete) return;
        this.BtnDressClick();
        const Clothes = _DIYClothes._ins();
        this._btnUp(this._ImgVar('BtnTop'), () => {
            Clothes._pitchClassify = Clothes._classify.Top;
            this.openMakeTailor('Top');
            ADManager.TAPoint(TaT.BtnClick, 'symaker');
        })

        this._btnUp(this._ImgVar('BtnBottoms'), () => {
            Clothes._pitchClassify = Clothes._classify.Bottoms;
            this.openMakeTailor('Bottoms');
            ADManager.TAPoint(TaT.BtnClick, 'xzmaker');
        })

        this.BtnPersonalInfoClick();
        this._btnUp(this._ImgVar('BtnRanking'), () => {
            _Ranking._whereFrom = 'Start';
            this._openScene('Ranking', false);
        })
        this._btnUp(this._ImgVar('BtnDressingRoom'), () => {
            ADManager.TAPoint(TaT.BtnClick, 'change');
            _3DScene._ins().cameraToSprite(this._Owner);
            this._openScene('DressingRoom', true, true);
        })
        this.BtnCheckIn();
    }

    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.PageLeave, 'mainpage');
    }
}
