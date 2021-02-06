import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";
import { LwgScene, LwgAni2D, LwgAudio, LwgClick, LwgData, LwgDialogue, LwgEff2D, LwgEvent, LwgTimer, LwgTools, LwgPlatform } from "../Lwg/Lwg";
import { _DIYClothes, _Guide, _MakeTailor, _Tweeting } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _Res } from "./_Res";
import { _SceneName } from "./_SceneName";
import { _UI } from "./_UI";

/**当前任务服装数据*/
export class _TaskClothes extends LwgData._Table {
    private static ins: _TaskClothes;
    static _ins() {
        if (!this.ins) {
            this.ins = new _TaskClothes('DIY_Task');
        }
        return this.ins;
    }

    /**本关重来*/
    again(Scene: Laya.Scene): void {
        const clothesArr = _DIYClothes._ins().getClothesArr();
        const name = _DIYClothes._ins()._pitchName ? _DIYClothes._ins()._pitchName : clothesArr[0]['name'];
        for (let index = 0; index < clothesArr.length; index++) {
            const element = clothesArr[index] as Laya.Sprite;
            if (element.name === name) {
                this.LastClothes = element;
                clothesArr[index] = this.Clothes = _DIYClothes._ins().createClothes(name, Scene);
                this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent') as Laya.Image;
                this.setData();
            }
        }
        this.clothesMove();
        LwgAni2D.move_rotate(this.LastClothes, 45, new Laya.Point(Laya.stage.width * 1.5, Laya.stage.height * 1.5), this.moveTime, 0, () => {
            this.LastClothes.removeSelf();
        })
    }
    Clothes: Laya.Sprite;
    moveTime = 600;
    clothesMove(): void {
        const time = 700;
        this.Clothes.pos(0, -Laya.stage.height * 1.5);
        this.Clothes.rotation = 45;
        LwgAni2D.move_rotate(this.Clothes, 0, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time);
    }
    LastClothes: Laya.Sprite;
    LineParent: Laya.Image;
    /**更换服装*/
    changeClothes(Scene: Laya.Scene): void {
        const clothesArr = _DIYClothes._ins().getClothesArr();
        const name = _DIYClothes._ins()._pitchName ? _DIYClothes._ins()._pitchName : clothesArr[0]['name'];
        const lastName = _DIYClothes._ins()._lastPitchName;
        for (let index = 0; index < clothesArr.length; index++) {
            const element = clothesArr[index] as Laya.Sprite;
            if (element.name == name) {
                element.removeSelf();
                // 重新创建一个，否则可能会导致碰撞框位置不正确
                this.Clothes = clothesArr[index] = _DIYClothes._ins().createClothes(name, Scene);
                this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent') as Laya.Image;
                this.setData();
            } else if (element.name == lastName) {
                this.LastClothes = element;
            } else {
                element.removeSelf();
            }
        }
        this.clothesMove();
        this.LastClothes && LwgAni2D.move_rotate(this.LastClothes, -45, new Laya.Point(Laya.stage.width * 1.5, -Laya.stage.height * 1.5), this.moveTime, 0, () => {
            this.LastClothes.removeSelf();
        })
    }

    /**设置单个服装的任务信息*/
    setData(): void {
        this._arr = [];
        for (let index = 0; index < this.LineParent.numChildren; index++) {
            const Line = this.LineParent.getChildAt(index) as Laya.Image;
            if (Line.numChildren > 0) {
                let data = {};
                data['Line'] = Line;
                data[this._property.name] = Line.name;
                data[this._property.conditionNum] = Line.numChildren;
                data[this._property.degreeNum] = 0;
                this._arr.push(data);
            }
        }
    }
}

/**剪刀*/
class _Scissor extends LwgScene._ObjectBase {
    lwgOnAwake(): void {
        this._Owner.pos(this.Ani.vanishP.x, this.Ani.vanishP.y);
    }
    /**动画控制*/
    Ani = {
        vanishP: new Laya.Point(Laya.stage.width + 500, 0),
        shearSpeed: 3,
        range: 40,
        dir: 'up',
        dirType: {
            up: 'up',
            down: 'down',
        },

        paly: () => {
            LwgTimer._clearAll([this.Ani]);
            LwgAni2D._clearAll([this.Ani]);
            LwgTimer._frameLoop(1, this.Ani, () => {
                if (this._SceneImg('S2').rotation > this.Ani.range) {
                    this.Ani.dir = 'up';
                } else if (this._SceneImg('S2').rotation <= 0) {
                    this.Ani.dir = 'down';
                }
                if (this.Ani.dir == 'up') {
                    this._SceneImg('S1').rotation += this.Ani.shearSpeed * 4;
                    this._SceneImg('S2').rotation -= this.Ani.shearSpeed * 4;
                } else if (this.Ani.dir == 'down') {
                    this._SceneImg('S1').rotation -= this.Ani.shearSpeed;
                    this._SceneImg('S2').rotation += this.Ani.shearSpeed;
                }
            });
        },
        stop: () => {
            LwgTimer._frameOnce(30, this.Ani, () => {
                let time = 100;
                LwgTimer._clearAll([this.Ani]);
                LwgAni2D._clearAll([this.Ani]);
                LwgAni2D.rotate(this._SceneImg('S1'), -this.Ani.range / 3, time)
                LwgAni2D.rotate(this._SceneImg('S2'), this.Ani.range / 3, time)
            })
        },

        event: () => {
            this._evReg(_MakeTailor.Event.scissorAppear, () => {
                let time = 800;
                LwgAni2D.move_rotate(this._Owner, this._Owner._lwg.fRotation + 360, this._Owner._lwg.fGPoint, time, 0, () => {
                    this._Owner.rotation = this._Owner._lwg.fRotation;
                    this.Move.switch = true;
                    if (!_Guide._complete.value) this._evNotify(_Guide.Event.MakeTailorStartTailor, [this._Owner]);
                })
            })
            this._evReg(_MakeTailor.Event.scissorPlay, () => {
                this.Ani.paly();
            })
            this._evReg(_MakeTailor.Event.scissorStop, () => {
                this.Ani.stop();
            })
            this._evReg(_MakeTailor.Event.scissorRemove, (func?: Function) => {
                this.Move.switch = false;
                let disX = 1500;
                let disY = -600;
                let time = 600;
                let delay = 100;
                LwgAni2D.move_rotate(this._Owner, this._Owner.rotation + 360, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time / 2, delay, () => {
                    this._Owner.rotation = 0;
                    LwgAni2D.move_rotate(this._Owner, -30, new Laya.Point(this._Owner.x - disX / 6, this._Owner.y - disY / 5), time / 2, delay * 1.5, () => {
                        LwgAni2D.move_rotate(this._Owner, LwgTools._Number.randomOneHalf() == 0 ? 720 : -720, new Laya.Point(this._Owner.x + disX, this._Owner.y + disY), time, delay, () => {
                            func && func();
                            this._Owner.rotation = 0;
                            this._Owner.pos(this.Ani.vanishP.x, this.Ani.vanishP.y);
                        });
                    });
                })
            })

            this._evReg(_MakeTailor.Event.scissorAgain, () => {
                LwgAni2D.move_rotate(this._Owner, this._Owner._lwg.fRotation, this._Owner._lwg.fGPoint, 600, 100, () => {
                    _TaskClothes._ins().again(this._Scene);
                });
            })

            this._evReg(_MakeTailor.Event.scissorRotation, (rotate: number) => {
                LwgTimer._clearAll([this._Owner]);
                const time = 10;
                let angle: number;
                if (Math.abs(rotate - this._Owner.rotation) < 180) {
                    angle = rotate - this._Owner.rotation;
                } else {
                    angle = -(360 - (rotate - this._Owner.rotation));
                }
                let unit = angle / time;
                LwgTimer._frameNumLoop(1, time, this._Owner, () => {
                    this._Owner.rotation += unit;
                })
            })
        },
        effcts: () => {
            const num = LwgTools._Number.randomOneInt(3, 6);
            const color1 = _DIYClothes._ins().getColor()[0];
            const color2 = _DIYClothes._ins().getColor()[1];
            for (let index = 0; index < num; index++) {
                LwgEff2D._Particle._spray(this._Scene, this._point, [10, 30], null, [0, 360], [LwgEff2D._SkinUrl.三角形1], [color1, color2], [20, 90], null, null, [1, 3], [0.1, 0.2], this._Owner.zOrder - 1);
            }
        }
    }
    lwgEvent(): void {
        this.Ani.event();
    }
    Move = {
        switch: false,
        touchP: null as Laya.Point,
        diffP: null as Laya.Point,
    }
    lwgButton(): void {
        this._btnFour(Laya.stage,
            (e: Laya.Event) => {
                if (this.Move.switch) {
                    this._evNotify(_MakeTailor.Event.scissorPlay);
                    this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                    if (!_Guide._complete.value) this._evNotify(_Guide.Event.MakeTailorCloseTailor, [this._Owner]);
                }
            },
            (e: Laya.Event) => {
                if (this.Move.touchP && this.Move.switch) {
                    this.Move.diffP = new Laya.Point(e.stageX - this.Move.touchP.x, e.stageY - this.Move.touchP.y);
                    this._Owner.x += this.Move.diffP.x;
                    this._Owner.y += this.Move.diffP.y;
                    LwgTools._Node.tieByStage(this._Owner);
                    this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                    this._evNotify(_MakeTailor.Event.scissorPlay);
                }
            },
            () => {
                this._evNotify(_MakeTailor.Event.scissorStop);
                this.Move.touchP = null;
                if (!_Guide._complete.value) {
                    this._evNotify(_Guide.Event.MakeTailorOpenTailor, [this._Owner]);

                }
            })
    }
    onTriggerEnter(other: Laya.CircleCollider, _Owner: Laya.CircleCollider): void {
        if (!other['cut'] && this.Move.switch) {
            other['cut'] = true;
            this._evNotify(_MakeTailor.Event.scissorPlay);
            this._evNotify(_MakeTailor.Event.scissorStop);
            LwgEvent._notify(_MakeTailor.Event.scissorTrigger, [other.owner]);
            this.Ani.effcts();
            ADManager.VibrateShort();
        }
    }
}

class _Item extends LwgData._Item {
    $awake(): void { };
    $button(): void {
        this._btnUp(this._Owner, () => {
            if (!_Guide._complete.value && this.$data.name !== 'diy_dress_002_final') return;
            if (this.$data.name === 'ads') {
                return;
            }
            if (this.$data.complete) {
                // 如果已选中则不会更换选择
                if (this.$data.name !== _DIYClothes._ins()._pitchName) {
                    _DIYClothes._ins()._setPitch(this.$data.name);
                    this._evNotify(_MakeTailor.Event.changeClothes);
                }
            }
            else {
                switch (this.$data.unlockWay) {
                    case this.$unlockWayType.check:
                        LwgDialogue._middleHint('请前往签到页面获取');
                        break;
                    case this.$unlockWayType.customs:
                        LwgDialogue._middleHint(`制作${this.$data.conditionNum}件才能衣服获取哦！`);
                        break;
                    case this.$unlockWayType.ads:
                        ADManager.ShowReward(() => {
                            if (_DIYClothes._ins()._checkCondition(this.$data.name)) {
                                LwgDialogue._middleHint('恭喜获得一件新服装！');
                                _DIYClothes._ins()._setPitch(this.$data.name);
                                this._evNotify(_MakeTailor.Event.changeClothes);
                            }
                        })
                        break;
                    case this.$unlockWayType.free:
                        LwgDialogue._middleHint(`免费获得`);
                        break;
                    default:
                        break;
                }
            }
            if (!_Guide._complete.value && this.$data.name == 'diy_dress_002_final') {
                _Guide.MmakeTailorBtnComSwicth = true;
                this._evNotify(_Guide.Event.MakeTailorBtnCom, [this._SceneImg('BtnComplete')._lwg.gPoint]);
            };
        })
    }

    $render(): void {
        this._LableChild('UnlockWayNum').visible = false;
        if (this.$data.name == 'ads') {
            if (!this._BoxChild('NativeRoot')) {
                LwgTools._Node.createPrefab(  _Res.$prefab2D.NativeRoot.prefab2D, this._Owner);
            }
            this._ImgChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = this._ImgChild('Board').visible = false;
        } else {
            if (!this.$data.complete) {
                if (this.$data.unlockWay === _DIYClothes._ins()._unlockWay.ads) {
                    this._ImgChild('AdsSign').visible = true;
                    this._LableChild('UnlockWay').visible = false;
                    this._ImgChild('Mask').visible = false;
                } else {
                    this._ImgChild('AdsSign').visible = false;
                    this._LableChild('UnlockWay').visible = true;
                    switch (this.$data.unlockWay) {
                        case _DIYClothes._ins()._unlockWay.check:
                            this._LableChild('UnlockWay').text = '签到';
                            this._LableChild('UnlockWay').fontSize = 30;
                            this._LableChild('UnlockWayNum').visible = false;
                            break;
                        case _DIYClothes._ins()._unlockWay.customs:
                            this._LableChild('UnlockWay').text = `制作衣服`;
                            this._LableChild('UnlockWay').fontSize = 25;
                            this._LableChild('UnlockWayNum').visible = true;
                            this._LableChild('UnlockWayNum').text = `(${_Tweeting._completeNum.value} /${this.$data.conditionNum})`;
                            break;
                        default:
                            break;
                    }
                }
                this._ImgChild('Mask').visible = true;
            } else {
                this._ImgChild('Mask').visible = this._ImgChild('AdsSign').visible = this._LableChild('UnlockWay').visible = false;
            }
            this._ImgChild('Icon').gray = !this.$data.complete;
            if (this._BoxChild('NativeRoot')) this._BoxChild('NativeRoot').destroy();
            this._ImgChild('Icon').visible = this._ImgChild('Board').visible = true;
            this._ImgChild('Icon').skin = _DIYClothes._ins().getDIYCutIcon(this.$data.name);
            this._ImgChild('Board').skin = `Lwg/UI/ui_orthogon_green.png`;
            if (this.$data.pitch) {
                this._ImgChild('Board').skin = `Game/UI/Common/xuanzhong.png`;
            } else {
                this._ImgChild('Board').skin = null;
            }
        }

    }
}

export default class MakeTailor extends LwgScene._SceneBase {
    lwgOnAwake(): void {
        RecordManager.startAutoRecord();
        ADManager.TAPoint(TaT.PageShow, 'jiancaipage');

        this._ImgVar('BG1').skin = `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/MakeTailorBG1.png`;

        this._ImgVar('BG2').skin = `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/MakeTailorBG2.png`;

        this._ImgVar('Scissor').addComponent(_Scissor);
        _DIYClothes._ins()._listRenderScript = _Item;
        _DIYClothes._ins()._List = this._ListVar('List');
        const arr = _DIYClothes._ins()._getArrByPitchClassify();
        _DIYClothes._ins()._listArray = arr;
        _DIYClothes._ins()._setPitch(arr[0][_DIYClothes._ins()._property.name]);
        if (!_Guide._complete.value) _DIYClothes._ins()._List.scrollBar.touchScrollEnable = false;
    }
    UI: _UI;
    lwgOnStart(): void {
        this.UI = new _UI(this._Owner);
        LwgTimer._frameOnce(40, this, () => {
            this.UI.operationAppear(() => {
                this.UI.btnAgainVinish(null, 200);
                this.UI.btnCompleteAppear(null, 400);
            });
            this.UI.btnBackAppear(() => {
                !_Guide._complete.value && this._openScene(_SceneName.Guide, false, false, () => {
                    _Guide.MmakeTailorPulldownSwicth = true;
                    this._evNotify(_Guide.Event.MakeTailorPulldown);
                })
            });
        })
        this.UI.BtnRollback.visible = false;
        LwgTimer._frameOnce(20, this, () => {
            _TaskClothes._ins().changeClothes(this._Owner);
        })
    }
    lwgAdaptive(): void {
        if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
            this._ImgVar('BtnComplete').y += 80;
        }
    }
    lwgButton(): void {
        this.UI.btnCompleteClick = () => {
            if (!_Guide._complete.value) {
                if (!_Guide.MmakeTailorBtnComSwicth) {
                    return;
                }
            }
            this.UI.operationVinish(() => {
                this.UI.btnAgainAppear();
            }, 200);
            LwgTimer._frameOnce(30, this, () => {
                this._evNotify(_MakeTailor.Event.scissorAppear);
            })
        }

        // 滑动的新手引导
        if (!_Guide._complete.value) {
            this._btnFour(_DIYClothes._ins()._List,
                () => {
                    if (_Guide.MmakeTailorPulldownSwicth) {
                        if (!this['Pulldown']) {
                            this['Pulldown'] = 1;
                        }
                    }
                },
                () => {
                    if (this['Pulldown']) this['Pulldown']++;
                },
                () => {
                    if (_Guide.MmakeTailorPulldownSwicth && this['Pulldown'] && this['Pulldown'] > 2) {
                        let index: number;
                        if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                            index = 3;
                        } else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
                            index = 4;
                        }
                        _DIYClothes._ins()._List.tweenTo(index, 200, Laya.Handler.create(this, () => {
                            _Guide.MmakeTailorPulldownSwicth = false;
                            this._evNotify(_Guide.Event.MakeTailorChangeCloth);
                        }));
                    }
                    this['Pulldown'] = 1;
                },
                null)
            return;
        }
        this.UI.btnAgainClick = () => {
            this._evNotify(_MakeTailor.Event.scissorRemove, [() => {
                _TaskClothes._ins().again(this._Owner);
            }]);
            LwgClick._aniSwitch = false;
            LwgTimer._frameOnce(60, this, () => {
                this.UI.operationAppear(() => {
                    this.UI.btnAgainVinish(null, 200);
                    this.UI.btnCompleteAppear();
                });
                LwgClick._aniSwitch = true;
            })
        }
    }

    lwgEvent(): void {
        this._evReg(_MakeTailor.Event.changeClothes, () => {
            _TaskClothes._ins().changeClothes(this._Owner);
        })

        this._evReg(_MakeTailor.Event.scissorTrigger, (Dotted: Laya.Image) => {
            const Parent = Dotted.parent as Laya.Sprite;
            const value = _TaskClothes._ins()._checkCondition(Parent.name);
            Dotted.visible = false;
            // 将底下线擦掉
            let Eraser = Parent.getChildByName('Eraser') as Laya.Sprite;
            if (!Eraser) {
                Eraser = new Laya.Sprite;
                Parent.addChild(Eraser);
            }
            if (Eraser.blendMode !== "destination-out") Eraser.blendMode = "destination-out";
            if (Parent.cacheAs !== "bitmap") Parent.cacheAs = "bitmap";
            Eraser.graphics.drawCircle(Dotted.x, Dotted.y, 15, '#000000');
            if (value) {
                if (!_Guide._complete.value) this._evNotify(_Guide.Event.MakeTailorNewTailor, [Parent.name]);
                // 删除布料
                for (let index = 0; index < _TaskClothes._ins().Clothes.getChildAt(0).numChildren; index++) {
                    const element = _TaskClothes._ins().Clothes.getChildAt(0).getChildAt(index) as Laya.Image;
                    // 比对索引值
                    if (element.name.substr(5, 2) == Dotted.parent.name.substr(4, 2)) {
                        let time = 1500;
                        let disX = LwgTools._Number.randomOneInt(1000) + 1000;
                        let disY = LwgTools._Number.randomOneInt(1000) + 1000;
                        switch (element.name.substr(8)) {
                            case 'U':
                                disX = 0;
                                disY = -disY;
                                break;
                            case 'LU':
                                disX = -disX;
                                disY = -disY;
                                break;
                            case 'L':
                                disX = -disX;
                                disY = 0;
                                break;
                            case 'R':
                                disX = disX;
                                disY = 0;
                                break;
                            case 'RU':
                                disY = -disY;
                                break;
                            case 'D':
                                disX = 0;
                                break;
                            case 'RD':
                                break;
                            case 'LD':
                                disX = -disX;
                                break;

                            default:
                                break;
                        }
                        LwgAni2D.move_rotate(element, 0, new Laya.Point(element.x + disX / 30, element.y + disY / 30), time / 6, 0, () => {
                            let rotate1 = LwgTools._Number.randomOneBySection(180);
                            let rotate2 = LwgTools._Number.randomOneBySection(-180);
                            LwgAni2D.move_rotate(element, LwgTools._Number.randomOneHalf() == 0 ? rotate1 : rotate2, new Laya.Point(element.x + disX, element.y + disY), time, 0, () => {
                                LwgAni2D.fadeOut(element, 1, 0, 200);
                            });
                        });
                    }
                }
                // 检测是否全部完成
                if (_TaskClothes._ins()._checkAllCompelet()) {
                    LwgTools._Node.removeAllChildren(_TaskClothes._ins().LineParent);
                    this._evNotify(_MakeTailor.Event.scissorRemove);
                    LwgTimer._frameOnce(80, this, () => {
                        this._evNotify(_MakeTailor.Event.completeEffcet);
                    })
                    LwgTimer._frameOnce(280, this, () => {
                        _Tweeting._photo.take(this._Owner, 0);
                        this._openScene(_SceneName.MakePattern, true, true);
                    })
                }
            }
            // 剪刀转向
            const gPos = (Dotted.parent as Laya.Image).localToGlobal(new Laya.Point(Dotted.x, Dotted.y));
            if (Dotted.name == 'A') {
                if (this._ImgVar('Scissor').x <= gPos.x) {
                    this._evNotify(_MakeTailor.Event.scissorRotation, [Dotted.rotation]);
                } else {
                    this._evNotify(_MakeTailor.Event.scissorRotation, [180 + Dotted.rotation]);
                }
            } else {
                if (this._ImgVar('Scissor').y >= gPos.y) {
                    this._evNotify(_MakeTailor.Event.scissorRotation, [Dotted.rotation]);
                } else {
                    this._evNotify(_MakeTailor.Event.scissorRotation, [180 + Dotted.rotation]);
                }
            }
        })

        this._evReg(_MakeTailor.Event.completeEffcet, () => {
            this.UI.btnBackVinish();
            this.UI.btnAgainVinish();
            LwgAudio._playVictorySound(null, null, null, 0.5);
            const index = LwgTools._Array.randomGetOne([0, 1, 2]);
            switch (index) {
                case 0:
                    this.heartShapedPathEffcet();
                    break;
                case 1:
                    _GameEffects2D._completeCross();
                    break;
                case 2:
                    _GameEffects2D._completeSidelingCross();
                    break;
                default:
                    break;
            }
        })
    }
    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.PageLeave, 'jiancaipage');
    }
    /**心型路径特效*/
    heartShapedPathEffcet(): void {
        this._AniVar('complete').play(0, false);
        let _caller = {};
        LwgTimer._frameLoop(1, _caller, () => {
            let gP = (this._ImgVar('EFlower').parent as Laya.Image).localToGlobal(new Laya.Point(this._ImgVar('EFlower').x, this._ImgVar('EFlower').y))
            LwgEff2D._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y - 40), [0, 0], null, null, [0, 360], [LwgEff2D._SkinUrl.花2], [[255, 222, 0, 1], [255, 222, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])

            LwgEff2D._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y), [0, 0], null, null, [0, 360], [LwgEff2D._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])
        })
        this._AniVar('complete').on(Laya.Event.COMPLETE, this, () => {
            LwgTimer._clearAll([_caller]);
        })
    }
}