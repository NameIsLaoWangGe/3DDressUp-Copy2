import Lwg, { LwgScene, LwgEvent, LwgTimer, LwgTools, LwgPreLoad } from "../Lwg/Lwg";
import { _3DDIYCloth, _3DScene } from "./_3D";
import { _GameAni } from "./_GameAni";
import { _AllClothes, _DIYClothes, _PreLoadCutIn } from "./_GameData";
import { _CutInRes } from "./_Res";
import { _SceneName } from "./_SceneName";
export default class PreLoadCutIn extends LwgPreLoad._PreLoadScene {
    lwgOpenAniAfter(): void {
        let time = 0;
        LwgTimer._frameNumLoop(1, 30, this, () => {
            time++;
            this._LabelVar('Schedule').text = `${time}%`;
        }, () => {
            let obj = _CutInRes[LwgScene._PreLoadCutIn.openName];
            obj =  _CutInRes[LwgScene._PreLoadCutIn.openName] ? obj : {};
            LwgEvent._notify(LwgPreLoad._Event.importList, [obj]);
        })
    }
    lwgAllComplete(): number {
        console.log('加载完成！')
        switch (LwgScene._PreLoadCutIn.openName) {
            case _SceneName.MakePattern:
                _3DDIYCloth._ins().remake(_DIYClothes._ins()._pitchClassify, _DIYClothes._ins()._pitchName);
                _3DScene._ins().intoMakePattern();
                // 提前设置皮肤
                this._ImgVar('Front').loadImage(_DIYClothes._ins().getPitchTexBasicUrl(), Laya.Handler.create(this, () => {
                    var getTex = () => {
                        let ImgF = this._ImgVar('Front');
                        const tex = this._ImgVar('Front').drawToTexture(ImgF.width, ImgF.height, ImgF.x, ImgF.y + ImgF.height) as Laya.Texture;
                        return [
                            tex,
                            tex
                        ]
                    }
                    _3DDIYCloth._ins().addTexture2D(getTex());
                }));
                break;
            case _SceneName.MakeTailor:
                _DIYClothes._ins().ClothesArr = null;
                _3DScene._ins().intoMakeTailor();
                _DIYClothes._ins().getClothesArr();
                break;
            case _SceneName.Start:
                if (LwgScene._PreLoadCutIn.closeName === _SceneName.MakePattern && !_PreLoadCutIn._fromBack) {
                    this.iconPhoto();
                } else {
                    _3DScene._ins().intoStart();
                }
                break;
            case _SceneName.DressingRoom:
                _3DScene._ins().intogeDressingRoom();
            default:
                break;
        }
        LwgTimer._frameOnce(30, this, () => {
            this._LabelVar('Schedule').text = `100%`;
        })
        return 1000;
    }
    /**服装iconicon截图*/
    iconPhoto(): void {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            _3DScene._ins().intoStart();
            _DIYClothes._ins()._setPitchProperty(_DIYClothes._ins()._otherPro.icon, 'have');
            _AllClothes._ins().changeAfterMaking();
        } else {
            _3DScene._ins().photoBg();
            _3DDIYCloth._ins().hanger.active = false;
            _3DDIYCloth._ins().Present.transform.localRotationEulerY = 180;
            const sp = new Laya.Sprite;
            this._Owner.addChild(sp)['size'](126, 146);
            LwgTools._Draw.cameraToSprite(_3DScene._ins()._MainCamara, sp);
            // 少许延迟防止绘制失败
            LwgTimer._frameOnce(5, this, () => {
                const base64Icon = LwgTools._Draw.screenshot(sp, 0.5);
                _DIYClothes._ins()._setPitchProperty(_DIYClothes._ins()._otherPro.icon, base64Icon);
                _AllClothes._ins().changeAfterMaking();
                _3DScene._ins().intoStart();
            })
        }
    }
    lwgOnDisable(): void {
        _PreLoadCutIn._fromBack = false;
    }
}

