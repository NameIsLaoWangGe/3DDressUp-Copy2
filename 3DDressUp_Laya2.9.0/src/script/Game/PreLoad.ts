import ADManager, { TaT } from "../../TJ/Admanager";
import Lwg, { LwgAni2D, LwgAudio, LwgColor, LwgPreLoad, LwgSceneAni, LwgTimer } from "../Lwg/Lwg";
import { _3DScene } from "./_3D";
import { _AllClothes } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _Res } from "./_Res";
import { _SceneName } from "./_SceneName";

export default class PreLoad extends LwgPreLoad._PreLoadScene {
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.PageShow, 'loadpage');
    }
    count = 0;
    lwgOnStart(): void {
        const scale = 1.2;
        const time = 100;
        const delay = 100;
        this._ImgVar('LoGo').scale(0, 0);
        this._ImgVar('Progress').scale(0, 0);
        this._ImgVar('Anti').alpha = 0;
        this._LabelVar('TextTip1').alpha = 0;
        const startCoefficient = 6;
        //特效
        LwgTimer._once(delay * startCoefficient, this, () => {
            _GameEffects2D._circleFlowe(this._Owner);
        })
        // 背景变色
        LwgTimer._once(delay * startCoefficient, this, () => {
            LwgColor._changeOnce(this._ImgVar('BG'), [100, 50, 0, 1], time / 3);
        })

        // logo循环变色
        LwgTimer._frameLoop(time / 2 * 2, this, () => {
            LwgTimer._once(delay * 6, this, () => {
                LwgColor._changeOnce(this._ImgVar('LoGo'), [5, 40, 10, 1], time / 2);
            })
        })

        // 接连弹出
        LwgAni2D.bombs_Appear(this._ImgVar('LoGo'), 0, 1, scale, 0, time * 5, () => {
            _GameEffects2D._bothBlinkOnSprite(this._Owner, this._ImgVar('LoGo'));

            LwgAni2D.bombs_Appear(this._ImgVar('Progress'), 0, 1, scale, 0, time * 1.5, () => {
                // 进度条自动加一段
                LwgTimer._frameNumLoop(2, 30, this, () => {
                    this.count++;
                    this.progressDisplay();
                }, () => {
                    // 文字提示
                    LwgAni2D.fadeOut(this._LabelVar('TextTip1'), 0, 1, time * 2, 0, () => {
                        LwgTimer._frameLoop(100, this, () => {
                            this._LabelVar('TextTip2').text = '';
                            LwgTimer._frameNumLoop(10, 6, this, () => {
                                this._LabelVar('TextTip2').text += '.';
                            })
                        }, true)
                    })
                    this._evNotify(LwgPreLoad._Event.importList, [_Res._list]);
                }, true)
                LwgAni2D.fadeOut(this._ImgVar('Anti'), 0, 1, time * 4, 200)
            }, delay * 4);
            LwgTimer._once(delay * 4, this, () => {
                LwgAudio._playSound(LwgAudio._voiceUrl.btn);
            })
        }, delay * startCoefficient);
    }

    progressDisplay(): void {
        this._ImgVar('ProgressBar').mask.x = - this._ImgVar('ProgressBar').width + this._ImgVar('ProgressBar').width / 100 * this.count;
    }
    lwgStepComplete(): void {
        this._ImgVar('ProgressBar').mask.x += 5;
    }
    lwgAllComplete(): number {
        LwgTimer._frameLoop(5, this, () => {
            if (this._ImgVar('ProgressBar').mask.x < 0) {
                this._ImgVar('ProgressBar').mask.x += 40;
                if (this._ImgVar('ProgressBar').mask.x > 0) {
                    this._ImgVar('ProgressBar').mask.x = 0;
                }
            }
        })
        _AllClothes._ins().changeClothStart();
        _3DScene._ins().intoStart(_SceneName.PreLoad);
        return 2000;
    }

    lwgCloseAni(): number {
        LwgSceneAni._shutters.Close._paly(LwgSceneAni._shutters.Close._type.randomCroAndVer, this._Owner)
        return 1500;
    }
    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.PageLeave, 'loadpage');
    }
}


