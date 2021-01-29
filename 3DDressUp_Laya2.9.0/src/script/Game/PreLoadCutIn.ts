import { Admin, EventAdmin, SceneAnimation, TimerAdmin, Tools, _LwgPreLoad, _SceneName } from "../Lwg/Lwg";
import { _3D } from "./_3D";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";
import { _CutInRes } from "./_Res";
export default class PreLoadCutIn extends _LwgPreLoad._PreLoadScene {
    lwgOpenAniAfter(): void {
        let time = 0;
        TimerAdmin._frameNumLoop(1, 30, this, () => {
            time++;
            this._LabelVar('Schedule').text = `${time}%`;
        }, () => {
            let obj = _CutInRes[Admin._PreLoadCutIn.openName];
            obj = obj ? obj : {};
            EventAdmin._notify(_LwgPreLoad._Event.importList, [obj]);
        })
    }
    lwgAllComplete(): number {
        switch (Admin._PreLoadCutIn.openName) {
            case 'MakePattern':
                _3D.DIYCloth._ins().remake(_GameData._DIYClothes._ins()._pitchClassify, _GameData._DIYClothes._ins()._pitchName);
                _3D._Scene._ins().intoMakePattern();
                // 提前设置皮肤
                this._ImgVar('Front').loadImage(_GameData._DIYClothes._ins().getPitchTexBasicUrl(), Laya.Handler.create(this, () => {
                    var getTex = () => {
                        let ImgF = this._ImgVar('Front');
                        const tex = this._ImgVar('Front').drawToTexture(ImgF.width, ImgF.height, ImgF.x, ImgF.y + ImgF.height) as Laya.Texture;
                        return [
                            tex,
                            tex
                        ]
                    }
                    _3D.DIYCloth._ins().addTexture2D(getTex());
                }));
                break;
            case 'MakeTailor':
                _3D._Scene._ins().intoMakeTailor();
                _GameData._DIYClothes._ins().ClothesArr = null;
                _GameData._DIYClothes._ins().getClothesArr();
                break;
            case 'Start':
                if (Admin._PreLoadCutIn.closeName === 'MakePattern' && !_GameData._PreLoadCutIn._fromBack) {
                    this.iconPhoto();
                } else {
                    _3D._Scene._ins().intoStart();
                }
                break;
            case 'DressingRoom':
                _3D._Scene._ins().intogeDressingRoom();
            default:
                break;
        }
        TimerAdmin._frameOnce(30, this, () => {
            this._LabelVar('Schedule').text = `100%`;
        })
        return 1000;
    }
    /**服装iconicon截图*/
    iconPhoto(): void {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            _3D._Scene._ins().intoStart();
            _GameData._DIYClothes._ins()._setPitchProperty(_GameData._DIYClothes._ins()._otherPro.icon, 'have');
            _GameData._AllClothes._ins().changeAfterMaking();
        } else {
            _3D._Scene._ins().photoBg();
            _3D.DIYCloth._ins().hanger.active = false;
            _3D.DIYCloth._ins().Present.transform.localRotationEulerY = 180;
            const sp = new Laya.Sprite;
            this._Owner.addChild(sp)['size'](126, 146);
            Tools._Draw.cameraToSprite(_3D._Scene._ins()._MainCamara, sp);
            // 少许延迟防止绘制失败
            TimerAdmin._frameOnce(5, this, () => {
                const base64Icon = Tools._Draw.screenshot(sp, 0.5);
                _GameData._DIYClothes._ins()._setPitchProperty(_GameData._DIYClothes._ins()._otherPro.icon, base64Icon);
                _GameData._AllClothes._ins().changeAfterMaking();
                _3D._Scene._ins().intoStart();
            })
        }
    }
    lwgOnDisable(): void {
        _GameData._PreLoadCutIn._fromBack = false;
    }
}
