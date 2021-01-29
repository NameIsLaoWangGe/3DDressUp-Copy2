import ADManager, { TaT } from "../../TJ/Admanager";
import lwg, { Admin, Animation2D, AudioAdmin, Click, DataAdmin, Dialogue, Effects2D, EventAdmin, SceneAnimation, TimerAdmin, Tools, _SceneName } from "../Lwg/Lwg";
import { _GameData } from "./_GameData";
import { _GameEffects2D } from "./GameEffects2D";
import { _Res } from "./_Res";

import { _UI } from "./_UI";
/**当前任务服装数据*/
export default class _TaskClothes extends DataAdmin._Table {
    private static ins: _TaskClothes;
    static _ins() {
        if (!this.ins) {
            this.ins = new _TaskClothes('DIY_Task');
        }
        return this.ins;
    }

    /**本关重来*/
    again(Scene: Laya.Scene): void {
        const clothesArr = _GameData._DIYClothes._ins().getClothesArr();
        const name = _GameData._DIYClothes._ins()._pitchName ? _GameData._DIYClothes._ins()._pitchName : clothesArr[0]['name'];
        for (let index = 0; index < clothesArr.length; index++) {
            const element = clothesArr[index] as Laya.Sprite;
            if (element.name === name) {
                this.LastClothes = element;
                clothesArr[index] = this.Clothes = _GameData._DIYClothes._ins().createClothes(name, Scene);
                this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent') as Laya.Image;
                this.setData();
            }
        }
        this.clothesMove();
        Animation2D.move_rotate(this.LastClothes, 45, new Laya.Point(Laya.stage.width * 1.5, Laya.stage.height * 1.5), this.moveTime, 0, () => {
            this.LastClothes.removeSelf();
        })
    }
    Clothes: Laya.Sprite;
    moveTime = 600;
    clothesMove(): void {
        const time = 700;
        this.Clothes.pos(0, -Laya.stage.height * 1.5);
        this.Clothes.rotation = 45;
        Animation2D.move_rotate(this.Clothes, 0, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time);
    }
    LastClothes: Laya.Sprite;
    LineParent: Laya.Image;
    /**更换服装*/
    changeClothes(Scene: Laya.Scene): void {
        const clothesArr = _GameData._DIYClothes._ins().getClothesArr();
        const name = _GameData._DIYClothes._ins()._pitchName ? _GameData._DIYClothes._ins()._pitchName : clothesArr[0]['name'];
        const lastName = _GameData._DIYClothes._ins()._lastPitchName;
        for (let index = 0; index < clothesArr.length; index++) {
            const element = clothesArr[index] as Laya.Sprite;
            if (element.name == name) {
                element.removeSelf();
                // 重新创建一个，否则可能会导致碰撞框位置不正确
                this.Clothes = clothesArr[index] = _GameData._DIYClothes._ins().createClothes(name, Scene);
                this.LineParent = this.Clothes.getChildAt(0).getChildByName('LineParent') as Laya.Image;
                this.setData();
            } else if (element.name == lastName) {
                this.LastClothes = element;
            } else {
                element.removeSelf();
            }
        }
        this.clothesMove();
        this.LastClothes && Animation2D.move_rotate(this.LastClothes, -45, new Laya.Point(Laya.stage.width * 1.5, -Laya.stage.height * 1.5), this.moveTime, 0, () => {
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
                data[this._property.$name] = Line.name;
                data[this._property.$conditionNum] = Line.numChildren;
                data[this._property.$degreeNum] = 0;
                this._arr.push(data);
            }
        }
    }
}

/**剪刀*/
class _Scissor extends Admin._ObjectBase {
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
            TimerAdmin._clearAll([this.Ani]);
            Animation2D._clearAll([this.Ani]);
            TimerAdmin._frameLoop(1, this.Ani, () => {
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
            TimerAdmin._frameOnce(30, this.Ani, () => {
                let time = 100;
                TimerAdmin._clearAll([this.Ani]);
                Animation2D._clearAll([this.Ani]);
                Animation2D.rotate(this._SceneImg('S1'), -this.Ani.range / 3, time)
                Animation2D.rotate(this._SceneImg('S2'), this.Ani.range / 3, time)
            })
        },

        event: () => {
            this._evReg(_GameData._MakeTailor.event.scissorAppear, () => {
                let time = 800;
                Animation2D.move_rotate(this._Owner, this._fRotation + 360, this._fPoint, time, 0, () => {
                    this._Owner.rotation = this._fRotation;
                    this.Move.switch = true;
                    if (!_GameData._Guide._complete) this._evNotify(_GameData._Guide.event.MakeTailorStartTailor, [this._Owner]);
                })
            })
            this._evReg(_GameData._MakeTailor.event.scissorPlay, () => {
                this.Ani.paly();
            })
            this._evReg(_GameData._MakeTailor.event.scissorStop, () => {
                this.Ani.stop();
            })
            this._evReg(_GameData._MakeTailor.event.scissorRemove, (func?: Function) => {
                this.Move.switch = false;
                let disX = 1500;
                let disY = -600;
                let time = 600;
                let delay = 100;
                Animation2D.move_rotate(this._Owner, this._Owner.rotation + 360, new Laya.Point(Laya.stage.width / 2, Laya.stage.height / 2), time / 2, delay, () => {
                    this._Owner.rotation = 0;
                    Animation2D.move_rotate(this._Owner, -30, new Laya.Point(this._Owner.x - disX / 6, this._Owner.y - disY / 5), time / 2, delay * 1.5, () => {
                        Animation2D.move_rotate(this._Owner, Tools._Number.randomOneHalf() == 0 ? 720 : -720, new Laya.Point(this._Owner.x + disX, this._Owner.y + disY), time, delay, () => {
                            func && func();
                            this._Owner.rotation = 0;
                            this._Owner.pos(this.Ani.vanishP.x, this.Ani.vanishP.y);
                        });
                    });
                })
            })

            this._evReg(_GameData._MakeTailor.event.scissorAgain, () => {
                Animation2D.move_rotate(this._Owner, this._fRotation, this._fPoint, 600, 100, () => {
                    _TaskClothes._ins().again(this._Scene);
                });
            })

            this._evReg(_GameData._MakeTailor.event.scissorRotation, (rotate: number) => {
                TimerAdmin._clearAll([this._Owner]);
                const time = 10;
                let angle: number;
                if (Math.abs(rotate - this._Owner.rotation) < 180) {
                    angle = rotate - this._Owner.rotation;
                } else {
                    angle = -(360 - (rotate - this._Owner.rotation));
                }
                let unit = angle / time;
                TimerAdmin._frameNumLoop(1, time, this._Owner, () => {
                    this._Owner.rotation += unit;
                })
            })
        },
        effcts: () => {
            const num = Tools._Number.randomOneInt(3, 6);
            const color1 = _GameData._DIYClothes._ins().getColor()[0];
            const color2 = _GameData._DIYClothes._ins().getColor()[1];
            const color = Tools._Number.randomOneHalf() === 0 ? color1 : color2;
            for (let index = 0; index < num; index++) {
                Effects2D._Particle._spray(this._Scene, this._point, [10, 30], null, [0, 360], [Effects2D._SkinUrl.三角形1], [color1, color2], [20, 90], null, null, [1, 3], [0.1, 0.2], this._Owner.zOrder - 1);
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
                    this._evNotify(_GameData._MakeTailor.event.scissorPlay);
                    this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                    if (!_GameData._Guide._complete) this._evNotify(_GameData._Guide.event.MakeTailorCloseTailor, [this._Owner]);
                }
            },
            (e: Laya.Event) => {
                if (this.Move.touchP && this.Move.switch) {
                    this.Move.diffP = new Laya.Point(e.stageX - this.Move.touchP.x, e.stageY - this.Move.touchP.y);
                    this._Owner.x += this.Move.diffP.x;
                    this._Owner.y += this.Move.diffP.y;
                    Tools._Node.tieByStage(this._Owner);
                    this.Move.touchP = new Laya.Point(e.stageX, e.stageY);
                    this._evNotify(_GameData._MakeTailor.event.scissorPlay);
                }
            },
            (e: Laya.Event) => {
                this._evNotify(_GameData._MakeTailor.event.scissorStop);
                this.Move.touchP = null;
                if (!_GameData._Guide._complete) {
                    this._evNotify(_GameData._Guide.event.MakeTailorOpenTailor, [this._Owner]);

                }
            })
    }
    onTriggerEnter(other: Laya.CircleCollider, _Owner: Laya.CircleCollider): void {
        if (!other['cut'] && this.Move.switch) {
            other['cut'] = true;
            this._evNotify(_GameData._MakeTailor.event.scissorPlay);
            this._evNotify(_GameData._MakeTailor.event.scissorStop);
            EventAdmin._notify(_GameData._MakeTailor.event.scissorTrigger, [other.owner]);
            this.Ani.effcts();
        }
    }
}

class _Item extends DataAdmin._Item {
    $awake(): void { };
    $button(): void {
        this._btnUp(this._Owner, () => {
            if (!_GameData._Guide._complete && this.$name !== 'diy_dress_002_final') return;
            if (this.$name === 'ads') {
                return;
            }
            if (this.$complete) {
                // 如果已选中则不会更换选择
                if (this.$name !== _GameData._DIYClothes._ins()._pitchName) {
                    _GameData._DIYClothes._ins()._setPitch(this.$name);
                    this._evNotify(_GameData._MakeTailor.event.changeClothes);
                }
            }
            else {
                switch (this.$unlockWay) {
                    case _GameData._DIYClothes._ins()._unlockWay.check:
                        Dialogue.createHint_Middle('请前往签到页面获取');
                        break;
                    case _GameData._DIYClothes._ins()._unlockWay.customs:
                        Dialogue.createHint_Middle(`制作${this.$conditionNum}件才能衣服获取哦！`);
                        break;
                    case _GameData._DIYClothes._ins()._unlockWay.ads:
                        ADManager.ShowReward(() => {
                            if (_GameData._DIYClothes._ins()._checkCondition(this.$name)) {
                                Dialogue.createHint_Middle('恭喜获得一件新服装！');
                                _GameData._DIYClothes._ins()._setPitch(this.$name);
                                this._evNotify(_GameData._MakeTailor.event.changeClothes);
                            }
                        })
                        break;
                    case _GameData._DIYClothes._ins()._unlockWay.free:
                        Dialogue.createHint_Middle(`免费获得`);
                        break;
                    default:
                        break;
                }
            }
            if (!_GameData._Guide._complete && this.$name == 'diy_dress_002_final') {
                _GameData._Guide.MmakeTailorBtnComSwicth = true;
                this._evNotify(_GameData._Guide.event.MakeTailorBtnCom);
            };
        })
    }

    $render(): void {
        this._LableChild('UnlockWayNum').visible = false;
        if (this.$name == 'ads') {
            if (!this._BoxChild('NativeRoot')) {
                Tools._Node.createPrefab(_Res._list.prefab2D.NativeRoot.prefab, this._Owner);
            }
            this._ImgChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = this._ImgChild('Board').visible = false;
        } else {
            if (!this.$complete) {
                if (this.$unlockWay === _GameData._DIYClothes._ins()._unlockWay.ads) {
                    this._ImgChild('AdsSign').visible = true;
                    this._LableChild('UnlockWay').visible = false;
                    this._ImgChild('Mask').visible = false;
                } else {
                    this._ImgChild('AdsSign').visible = false;
                    this._LableChild('UnlockWay').visible = true;
                    switch (this.$unlockWay) {
                        case _GameData._DIYClothes._ins()._unlockWay.check:
                            this._LableChild('UnlockWay').text = '签到';
                            this._LableChild('UnlockWay').fontSize = 30;
                            this._LableChild('UnlockWayNum').visible = false;
                            break;
                        case _GameData._DIYClothes._ins()._unlockWay.customs:
                            this._LableChild('UnlockWay').text = `制作衣服`;
                            this._LableChild('UnlockWay').fontSize = 25;
                            this._LableChild('UnlockWayNum').visible = true;
                            this._LableChild('UnlockWayNum').text = `(${_GameData._Tweeting._completeNum} /${this.$conditionNum})`;
                            break;
                        default:
                            break;
                    }
                }
                this._ImgChild('Mask').visible = true;
            } else {
                this._ImgChild('Mask').visible = this._ImgChild('AdsSign').visible = this._LableChild('UnlockWay').visible = false;
            }
            this._ImgChild('Icon').gray = !this.$complete;
            if (this._BoxChild('NativeRoot')) this._BoxChild('NativeRoot').destroy();
            this._ImgChild('Icon').visible = this._ImgChild('Board').visible = true;
            this._ImgChild('Icon').skin = _GameData._DIYClothes._ins().getDIYCutIcon(this.$name);
            this._ImgChild('Board').skin = `Lwg/UI/ui_orthogon_green.png`;
            if (this.$pitch) {
                this._ImgChild('Board').skin = `Game/UI/Common/xuanzhong.png`;
            } else {
                this._ImgChild('Board').skin = null;
            }
        }

    }
}

export class MakeTailor extends Admin._SceneBase {
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.PageShow, 'jiancaipage');

        this._ImgVar('BG1').skin = `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/MakeTailorBG1.png`;

        this._ImgVar('BG2').skin = `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/MakeTailorBG2.png`;

        this._ImgVar('Scissor').addComponent(_Scissor);
        _GameData._DIYClothes._ins()._listRenderScript = _Item;
        _GameData._DIYClothes._ins()._List = this._ListVar('List');
        const arr = _GameData._DIYClothes._ins()._getArrByPitchClassify();
        _GameData._DIYClothes._ins()._listArray = arr;
        _GameData._DIYClothes._ins()._setPitch(arr[0][_GameData._DIYClothes._ins()._property.$name]);
        if (!_GameData._Guide._complete) _GameData._DIYClothes._ins()._List.scrollBar.touchScrollEnable = false;
    }
    UI: _UI;
    lwgOnStart(): void {
        this.UI = new _UI(this._Owner);
        TimerAdmin._frameOnce(40, this, () => {
            this.UI.operationAppear(() => {
                this.UI.btnAgainVinish(null, 200);
                this.UI.btnCompleteAppear(null, 400);
            });
            this.UI.btnBackAppear(() => {
                !_GameData._Guide._complete && this._openScene('Guide', false, false, () => {
                    _GameData._Guide.MmakeTailorPulldownSwicth = true;
                    this._evNotify(_GameData._Guide.event.MakeTailorPulldown);
                })
            });
        })
        this.UI.BtnRollback.visible = false;
        TimerAdmin._frameOnce(20, this, () => {
            _TaskClothes._ins().changeClothes(this._Owner);
        })
    }
    lwgButton(): void {
        this.UI.btnCompleteClick = () => {
            if (!_GameData._Guide._complete) {
                if (!_GameData._Guide.MmakeTailorBtnComSwicth) {
                    return;
                }
            }
            this.UI.operationVinish(() => {
                this.UI.btnAgainAppear();
            }, 200);
            TimerAdmin._frameOnce(30, this, () => {
                this._evNotify(_GameData._MakeTailor.event.scissorAppear);
            })
        }

        // 滑动的新手引导
        if (!_GameData._Guide._complete) {
            this._btnFour(_GameData._DIYClothes._ins()._List,
                () => {
                    if (_GameData._Guide.MmakeTailorPulldownSwicth) {
                        if (!this['Pulldown']) {
                            this['Pulldown'] = 1;
                        }
                    }
                },
                () => {
                    if (this['Pulldown']) this['Pulldown']++;
                },
                () => {
                    if (_GameData._Guide.MmakeTailorPulldownSwicth && this['Pulldown'] && this['Pulldown'] > 2) {
                        _GameData._DIYClothes._ins()._List.tweenTo(4, 200, Laya.Handler.create(this, () => {
                            _GameData._Guide.MmakeTailorPulldownSwicth = false;
                            this._evNotify(_GameData._Guide.event.MakeTailorChangeCloth);
                        }));
                    }
                    this['Pulldown'] = 1;
                },
                null)
            return;
        }
        this.UI.btnAgainClick = () => {
            this._evNotify(_GameData._MakeTailor.event.scissorRemove, [() => {
                _TaskClothes._ins().again(this._Owner);
            }]);
            Click._switch = false;
            TimerAdmin._frameOnce(60, this, () => {
                this.UI.operationAppear(() => {
                    this.UI.btnAgainVinish(null, 200);
                    this.UI.btnCompleteAppear();
                });
                Click._switch = true;
            })
        }
    }

    lwgEvent(): void {
        this._evReg(_GameData._MakeTailor.event.changeClothes, () => {
            _TaskClothes._ins().changeClothes(this._Owner);
        })

        this._evReg(_GameData._MakeTailor.event.scissorTrigger, (Dotted: Laya.Image) => {
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
                if (!_GameData._Guide._complete) this._evNotify(_GameData._Guide.event.MakeTailorNewTailor, [Parent.name]);
                // 删除布料
                for (let index = 0; index < _TaskClothes._ins().Clothes.getChildAt(0).numChildren; index++) {
                    const element = _TaskClothes._ins().Clothes.getChildAt(0).getChildAt(index) as Laya.Image;
                    // 比对索引值
                    if (element.name.substr(5, 2) == Dotted.parent.name.substr(4, 2)) {
                        let time = 1500;
                        let disX = Tools._Number.randomOneInt(1000) + 1000;
                        let disY = Tools._Number.randomOneInt(1000) + 1000;
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
                        Animation2D.move_rotate(element, 0, new Laya.Point(element.x + disX / 30, element.y + disY / 30), time / 6, 0, () => {
                            let rotate1 = Tools._Number.randomOneBySection(180);
                            let rotate2 = Tools._Number.randomOneBySection(-180);
                            Animation2D.move_rotate(element, Tools._Number.randomOneHalf() == 0 ? rotate1 : rotate2, new Laya.Point(element.x + disX, element.y + disY), time, 0, () => {
                                Animation2D.fadeOut(element, 1, 0, 200);
                            });
                        });
                    }
                }
                // 检测是否全部完成
                if (_TaskClothes._ins()._checkAllCompelet()) {
                    Tools._Node.removeAllChildren(_TaskClothes._ins().LineParent);
                    this._evNotify(_GameData._MakeTailor.event.scissorRemove);
                    TimerAdmin._frameOnce(80, this, () => {
                        this._evNotify(_GameData._MakeTailor.event.completeEffcet);
                    })
                    TimerAdmin._frameOnce(280, this, () => {
                        _GameData._Tweeting._photo.take(this._Owner, 0);
                        this._openScene('MakePattern', true, true);
                    })
                }
            }
            // 剪刀转向
            const gPos = (Dotted.parent as Laya.Image).localToGlobal(new Laya.Point(Dotted.x, Dotted.y));
            if (Dotted.name == 'A') {
                if (this._ImgVar('Scissor').x <= gPos.x) {
                    this._evNotify(_GameData._MakeTailor.event.scissorRotation, [Dotted.rotation]);
                } else {
                    this._evNotify(_GameData._MakeTailor.event.scissorRotation, [180 + Dotted.rotation]);
                }
            } else {
                if (this._ImgVar('Scissor').y >= gPos.y) {
                    this._evNotify(_GameData._MakeTailor.event.scissorRotation, [Dotted.rotation]);
                } else {
                    this._evNotify(_GameData._MakeTailor.event.scissorRotation, [180 + Dotted.rotation]);
                }
            }
        })

        this._evReg(_GameData._MakeTailor.event.completeEffcet, () => {
            this.UI.btnBackVinish();
            this.UI.btnAgainVinish();
            AudioAdmin._playVictorySound(null, null, null, 0.5);
            const index = Tools._Array.randomGetOne([0, 1, 2]);
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
        TimerAdmin._frameLoop(1, _caller, () => {
            let gP = (this._ImgVar('EFlower').parent as Laya.Image).localToGlobal(new Laya.Point(this._ImgVar('EFlower').x, this._ImgVar('EFlower').y))
            Effects2D._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y - 40), [0, 0], null, null, [0, 360], [Effects2D._SkinUrl.花2], [[255, 222, 0, 1], [255, 222, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])

            Effects2D._Particle._fallingVertical(this._Owner, new Laya.Point(gP.x, gP.y), [0, 0], null, null, [0, 360], [Effects2D._SkinUrl.花2], [[255, 222, 0, 1], [255, 24, 0, 1]], null, [100, 200], [0.8, 1.5], [0.05, 0.1])
        })
        this._AniVar('complete').on(Laya.Event.COMPLETE, this, () => {
            TimerAdmin._clearAll([_caller]);
        })
    }
}