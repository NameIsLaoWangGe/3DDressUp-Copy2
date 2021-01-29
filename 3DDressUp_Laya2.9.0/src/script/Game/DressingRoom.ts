import ADManager, { TaT } from "../../TJ/Admanager";
import lwg, { Admin, DataAdmin, Dialogue, TimerAdmin, Tools } from "../Lwg/Lwg";
import { LwgOPPO } from "../Lwg/LwgOPPO";
import { _AllClothes } from "./_GameData";
import { _GameEffects3D } from "./_GameEffects3D";
import { _Res } from "./_Res";
import { _UI } from "./_UI";
import { _3DScene } from "./_3D";

/**表格中的其他类型*/
export type _otherPro = {
    $icon: any;
    $putOn: any;
} & lwg.DataAdmin._BaseProperty;

class _Item extends DataAdmin._Item implements _otherPro {
    get $icon(): string {
        return this.$data ? this.$data['icon'] : null;
    }
    set $icon(_icon: string) {
        this.$data['icon'] = _icon;
    }
    get $putOn(): string {
        return this.$data ? this.$data['putOn'] : null;
    }
    set $putOn(_icon: string) {
        this.$data['putOn'] = _icon;
    }

    $button(): void {
        this._btnUp(this._Owner, (e: Laya.Event) => {
            if (this.$name === 'ads') {
                return;
            }
            if (_AllClothes._ins()._getProperty(this.$name, _AllClothes._ins()._property.$complete)) {
                _AllClothes._ins().accurateChange(this.$data['part'], this.$name);
                _GameEffects3D._showCloth(_3DScene._ins()._Owner);
            } else {
                ADManager.ShowReward(() => {
                    if (_AllClothes._ins()._checkCondition(this.$name)) {
                        Dialogue.createHint_Middle('恭喜获得新服装！');
                        _AllClothes._ins().accurateChange(this.$data['part'], this.$name);
                    }
                })
            }
        }, null)
    }
    $render(): void {
        if (this.$name === 'ads') {
            !this._BoxChild('NativeRoot') && Tools._Node.createPrefab(_Res._list.prefab2D.NativeRoot.prefab, this._Owner);
            this._ImgChild('Mask').visible = this._ImgChild('Icon').visible = this._ImgChild('Board').visible = false;
        } else {
            this._BoxChild('NativeRoot') && this._BoxChild('NativeRoot').destroy();

            this._ImgChild('Icon').visible = this._ImgChild('Board').visible = true;

            if (this.$putOn) {
                this._ImgChild('Board').skin = `Game/UI/Common/xuanzhong.png`;
            } else {
                this._ImgChild('Board').skin = null;
            }
            // 如果是OPPO，直接获取图片，如果不是则获取表格中的图片数据
            if (this.$classify === _AllClothes._ins()._classify.DIY) {
                if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                    this._ImgChild('Icon').skin = LwgOPPO._getStoragePic(this.$name);
                    this._ImgChild('Icon').size(110, 130);
                    this._ImgChild('Icon').scale(1, 1);
                } else {
                    this._ImgChild('Icon').skin = this.$icon;
                }
            } else {
                this._ImgChild('Icon').size(null, null);
                this._ImgChild('Icon').scale(0.9, 0.9);
                this._ImgChild('Icon').skin = _AllClothes._ins().getGeneralIcon(this.$name);
            }
        }
        if (this.$complete) {
            this._ImgChild('Mask').visible = this._ImgChild('AdsSign').visible = false;
        } else {
            this._ImgChild('Mask').visible = this._ImgChild('AdsSign').visible = true;
        }
    }
}

export default class DressingRoom extends Admin._SceneBase {

    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.PageShow, 'changepage');
        _3DScene._ins().openMirror(this._ImgVar('MirrorSurface'));
        const copyDIYArr = _AllClothes._ins().collectDIY();
        _AllClothes._ins()._List = this._ListVar('List');
        _AllClothes._ins()._listRenderScript = _Item;
        _AllClothes._ins()._listArray = _AllClothes._ins()._getArrByClassify(_AllClothes._ins()._classify.DIY);
        if (copyDIYArr.length > 0) {
            this.switchClassify(this._ImgVar('DIY'));
        } else {
            this.switchClassify(this._ImgVar('Dress'));
        }
    }

    lwgAdaptive(): void {
        this._SpriteVar('Mirror').x = Laya.stage.width * 0.234;
    }

    UI: _UI;
    lwgOnStart(): void {
        _AllClothes._ins()._List.refresh();
        this.UI = new _UI(this._Owner);
        TimerAdmin._frameOnce(10, this, () => {
            this.UI.operationAppear(() => {
                this.UI.btnCompleteAppear(null, 400);
            });
            this.UI.btnBackAppear(null, 200);
        })
        this.UI.btnCompleteClick = () => {
            this.UI.operationVinish(() => {
                _3DScene._ins().closeMirror();
                _3DScene._ins().cameraToSprite(this._Owner);
                Laya.Resource.destroyUnusedResources();
                this._openScene('Start', true, true);
                this.UI.btnBackVinish();
            }, 200);
        }
    }

    /**设置分类*/
    switchClassify(_element: Laya.Image): void {
        let arr = [];
        for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
            const element = this._ImgVar('Part').getChildAt(index) as Laya.Image;
            const Icon = element.getChildAt(0) as Laya.Image;
            if (_element === element) {
                element.skin = `Game/UI/Common/kuang_fen.png`;
                Icon.skin = `Game/UI/DressingRoom/PartIcon/${element.name}_s.png`;
                // 如果是DIY那么直接是分类
                if (_element.name === 'DIY') {
                    arr = _AllClothes._ins()._getArrByClassify(_element.name);
                } else {
                    let _arr = _AllClothes._ins()._getArrByClassify(_AllClothes._ins()._classify.General);
                    // 非DIY分部位
                    for (let index = 0; index < _arr.length; index++) {
                        const obj = _arr[index];
                        if (obj[_AllClothes._ins()._otherPro.part] === _element.name) {
                            arr.push(obj);
                        }
                    }
                }
            } else {
                element.skin = `Game/UI/Common/kuang_bai.png`;
                Icon.skin = `Game/UI/DressingRoom/PartIcon/${element.name}.png`;
            }
            _AllClothes._ins()._listArray = arr;
        }
    }

    lwgButton(): void {
        for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
            const _element = this._ImgVar('Part').getChildAt(index) as Laya.Image;
            this._btnUp(_element, () => {
                this.switchClassify(_element);
            }, 'no');
        }
    }
    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.PageLeave, 'changepage');
    }
}