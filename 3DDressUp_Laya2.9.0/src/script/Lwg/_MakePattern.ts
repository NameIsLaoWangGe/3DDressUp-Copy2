import ADManager, { TaT } from "../../TJ/Admanager";
import { Admin, Animation2D, Animation3D, Click, DataAdmin, Dialogue, EventAdmin, StorageAdmin, TimerAdmin, Tools } from "./Lwg";
import { LwgOPPO } from "./LwgOPPO";
import { _3D } from "./_3D";
import { _Game } from "./_Game";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";
import { _GameEvent } from "./_GameEvent";
import { _Guide } from "./_Guide";
import { _MakeUp } from "./_MakeUp";
import { _Ranking } from "./_Ranking";
import { _Res } from "./_Res";
import { _Start } from "./_Start";
import { _Tweeting } from "./_Tweeting";
import { _UI } from "./_UI";
export module _MakePattern {
    export enum _Event {
        close = '_MakePattern_close',
        createImg = '_MakePattern_createImg',
    }
    export class _Item extends DataAdmin._Item {
        fX: number;
        diffX: number = 0;
        create: boolean = false;
        $button(): void {
            this._btnFour(this._ImgChild('Icon'),
                (e: Laya.Event) => {
                    if (!this.$complete) {
                        switch (this.$unlockWay) {
                            case _GameData._Pattern._ins()._unlockWay.check:
                                Dialogue.createHint_Middle('请前往签到页面获取');
                                break;
                            case _GameData._Pattern._ins()._unlockWay.customs:
                                Dialogue.createHint_Middle(`制作${this.$conditionNum}件衣服才能获取！`);
                                break;
                            case _GameData._Pattern._ins()._unlockWay.ads:
                                ADManager.ShowReward(() => {
                                    if (_GameData._Pattern._ins()._checkCondition(this.$name)) {
                                        Dialogue.createHint_Middle('恭喜获得新贴图！');
                                        _GameData._Pattern._ins()._setProperty(this.$name, _GameData._Pattern._ins()._property.$complete, true);
                                    }
                                })
                                break;
                            default:
                                break;
                        }
                    }
                    if (this.$name === 'ads' || !this.$name || !this.$complete) {
                        this['Cancal'] = true;
                        return;
                    } else {
                        this['Cancal'] = false;
                    }
                    this.create = false;
                    this.diffX = 0;
                    this.fX = e.stageX;
                    this._evNotify(_Event.close);
                },
                (e: Laya.Event) => {
                    if (this['Cancal']) {
                        return;
                    }
                    if (!this.create) {
                        this.diffX = this.fX - e.stageX;
                        if (this.diffX >= 5) {
                            this._evNotify(_Event.createImg, [this.$name, this._gPoint]);
                            this.create = true;
                        }
                    }
                },
                () => {
                    if (this['Cancal']) {
                        return;
                    }
                    this.create = true;
                    this._evNotify(_Event.close);
                },
                () => {
                    if (this['Cancal']) {
                        return;
                    }
                    this.create = true;
                })
        }

        $render(): void {
            if (this.$name === 'ads') {
                !this._BoxChild('NativeRoot') && Tools._Node.createPrefab(_Res._list.prefab2D.NativeRoot.prefab, this._Owner);
                this._LableChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = false;
            } else {
                if (!this.$complete) {
                    if (this.$unlockWay === _GameData._Pattern._ins()._unlockWay.ads) {
                        this._ImgChild('AdsSign').visible = true;
                        this._LableChild('UnlockWay').visible = false;
                    } else {
                        this._LableChild('AdsSign').visible = false;
                        this._LableChild('UnlockWay').visible = true;
                        switch (this.$unlockWay) {
                            case _GameData._Pattern._ins()._unlockWay.check:
                                this._LableChild('UnlockWay').text = '签到';
                                this._LableChild('UnlockWay').fontSize = 30;
                                break;
                            case _GameData._Pattern._ins()._unlockWay.customs:
                                this._LableChild('UnlockWay').text = `制作衣服 (${_GameData._Tweeting._ins()._completeNum} /${this.$conditionNum})`;
                                this._LableChild('UnlockWay').fontSize = 25;
                                break;
                            default:
                                break;
                        }
                    }
                    this._LableChild('Mask').visible = true;
                } else {
                    this._LableChild('Mask').visible = this._ImgChild('AdsSign').visible = this._LableChild('UnlockWay').visible = false;
                }
                this._ImgChild('Icon').visible = true;
                this._ImgChild('Icon').gray = !this.$complete;
                if (this._BoxChild('NativeRoot')) this._BoxChild('NativeRoot').destroy();
                // 有些是空的占位置用的
                if (this.$name) {
                    this._ImgChild('Icon').skin = `Pattern/${this.$name}.png`;
                } else {
                    this._LableChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = false;
                    this._ImgChild('Icon').skin = null;
                }
            }
        }
    }

    export class MakePattern extends Admin._SceneBase {

        lwgOnAwake(): void {
            ADManager.TAPoint(TaT.PageShow, 'tiehuapage');
            ADManager.TAPoint(TaT.LevelStart, `level_${_3D.DIYCloth._ins().Present.name}`);

            _GameData._Pattern._ins()._List = this._ListVar('List');
            // 如果第一有了，选中就在第一列，否则停在第二列
            if (_GameData._Pattern._ins()._getProperty('newYear1', _GameData._Pattern._ins()._property.$complete) || !_GameData._Guide._complete) {
                this.switchClassify('newYear');
                _GameData._Pattern._ins()._listArray = _GameData._Pattern._ins().newYearArr;
            } else {
                this.switchClassify('basic');
                _GameData._Pattern._ins()._listArray = _GameData._Pattern._ins().basicArr;
            }
            _GameData._Pattern._ins()._List.scrollBar.touchScrollEnable = false;
            _GameData._Pattern._ins()._listRenderScript = _Item;
            this.Tex.fDiffX = _GameData._PatternDiff._ins().fDiffX;
            this.Tex.fDiffY = _GameData._PatternDiff._ins().fDiffY;
            this.Tex.rDiffX = _GameData._PatternDiff._ins().rDiffX;
            this.Tex.rDiffY = _GameData._PatternDiff._ins().rDiffY;
        }

        lwgOpenAniAfter(): void {
            TimerAdmin._frameOnce(60, this, () => {
                !_GameData._Guide._complete && this._openScene('Guide', false, false, () => {
                    this._evNotify(_GameEvent.Guide.MakePatternChooseClassify);
                })
            })
        }

        lwgAdaptive(): void {
            this._adaWidth([this._ImgVar('BtnR'), this._ImgVar('BtnL')]);
        }

        UI: _UI;
        lwgOnStart(): void {
            // 设置皮肤
            const url = _GameData._DIYClothes._ins().getPitchTexBasicUrl();
            this._ImgVar('Front').loadImage(url, Laya.Handler.create(this, () => {
                this._ImgVar('Reverse').loadImage(url, Laya.Handler.create(this, () => {
                    _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
                }));
            }));

            Animation2D.fadeOut(this._ImgVar('BtnL'), 0, 1, 200, 200);
            Animation2D.fadeOut(this._ImgVar('BtnR'), 0, 1, 200, 200);

            this.UI = new _UI(this._Owner);
            this.UI.BtnAgain.pos(86, 630);
            TimerAdmin._frameOnce(10, this, () => {
                this.UI.operationAppear(() => {
                    this.UI.btnCompleteAppear(null, 400);
                    this.UI.btnTurnFaceAppear(null, 200);
                });
                this.UI.btnBackAppear(null, 200);
                this.UI.btnRollbackAppear(null, 600);
                this.UI.btnAgainAppear(null, 800);
            })

            this._SpriteVar('Front').y = this._ImgVar('Reverse').y = this._SpriteVar('Front').height = this._ImgVar('Reverse').height = _3D.DIYCloth._ins().texHeight;
        }

        /**设置分类*/
        switchClassify(_name: string): void {
            if (!_GameData._Guide._complete && _name !== 'basic') {
                return;
            }
            for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                const element = this._ImgVar('Part').getChildAt(index) as Laya.Image;
                const name = element.getChildAt(0) as Laya.Label;
                if (_name === element.name) {
                    if (!_GameData._Guide._complete) {
                        if (_GameData._Guide.MakePatternState === _GameData._Guide.MakePatternStateType.ChooseClassify) {
                            this._evNotify(_GameEvent.Guide.MakePatternPattern1);
                        }
                    }
                    element.scale(1.1, 1.1);
                    _GameData._Pattern._ins()._listArray = _GameData._Pattern._ins()[`${element.name}Arr`];
                    _GameData._Pattern._ins()._pitchClassify = element.name;
                    element.skin = `Game/UI/Common/kuang_fen.png`;
                    name.color = '#fdfff4';
                    name.stroke = 5;
                } else {
                    element.skin = `Game/UI/Common/kuang_bai.png`;
                    element.scale(1, 1);
                    name.color = '#a84f47';
                    name.stroke = 0;
                }
            }
        }
        lwgButton(): void {
            // 切换页
            for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
                const _element = this._ImgVar('Part').getChildAt(index) as Laya.Image;
                this._btnUp(_element, () => {
                    this.switchClassify(_element.name);
                }, 'no');
            }

            this.Tex.btn();
            this.UI.btnCompleteClick = () => {
                if (!_GameData._Guide._complete) {
                    if (_GameData._Guide.MakePatternState === _GameData._Guide.MakePatternStateType.BtnCom) {
                        this._evNotify(_GameEvent.Guide.closeGuide);
                    } else {
                        return;
                    }
                }
                this.Tex.frameRestore();
                this.Tex.dir = this.Tex.dirType.Front;
                this.Tex.turnFace(() => {
                    // 这次绘制是微博照片
                    _3D._Scene._ins().cameraToSprite(this._Owner);
                    TimerAdmin._frameOnce(5, this, () => {
                        _GameData._Tweeting._ins()._photo.take(this._Owner, 1);
                    })
                    this.texStorage();
                    Animation2D.fadeOut(this._ImgVar('BtnL'), 1, 0, 200);
                    Animation2D.fadeOut(this._ImgVar('BtnR'), 1, 0, 200);
                    this.UI.operationVinish(() => {
                        this.UI.btnBackVinish(null, 200);
                        this.UI.btnBackVinish();
                        this.UI.btnRollbackVinish();
                        this.UI.btnAgainVinish(() => {
                        })
                        var close = () => {
                            // 这次绘制是为了过长动画
                            _3D._Scene._ins().cameraToSprite(this._Owner);
                            _Start._whereFrom = 'MakePattern';
                            this._openScene('Start', true, true);
                        }
                        // if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                        //     _3D._Scene._ins().photoBg();
                        // }
                        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                            LwgOPPO._screenShootByRatio((data: any) => {
                                LwgOPPO._picSave(data['tempFilePath'], _3D.DIYCloth._ins().name);
                                close();
                            }, 0.28, null, 0.72, null, null, 0.1);
                        } else {
                            close();
                        }
                    }, 200);
                });
            }
            if (!_GameData._Guide._complete) return;
            this.UI.btnRollbackClick = () => {
                _3D._Scene._ins().cameraToSprite(this._Owner);
                this._openScene('MakeTailor', true, true);
            }
            this.UI.btnAgainClick = () => {
                this.Tex.again();
            }
        }

        lwgEvent(): void {
            this._evReg(_Event.createImg, (name: string, gPoint: Laya.Point) => {
                this.Tex.state = this.Tex.stateType.move;
                this.Tex.createImg(name, gPoint);
                this.Tex.turnFace();
            })
            this._evReg(_Event.close, () => {
                if (!_GameData._Guide._complete) return;
                this.Tex.close();
                this.Tex.state = this.Tex.stateType.none;
            })
        }
        /**截图*/
        texStorage(): void {
            // if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            const fArr = [];
            var obj = (element: Laya.Image) => {
                return {
                    name: element.name,
                    x: element.x,
                    y: element.y,
                    width: element.width,
                    height: element.height,
                    rotation: element.rotation,
                    anchorX: element.anchorX,
                    anchorY: element.anchorY,
                    zOrder: element.zOrder,
                }
            }
            for (let index = 0; index < this._SpriteVar('Front').numChildren; index++) {
                if (index > 20) {
                    break;
                }
                const element = this._SpriteVar('Front').getChildAt(index) as Laya.Image;
                fArr.push(obj(element));
            }
            const rArr = [];
            for (let index = 0; index < this._SpriteVar('Reverse').numChildren; index++) {
                if (index < 20) {
                    break;
                }
                const element = this._SpriteVar('Reverse').getChildAt(index) as Laya.Image;
                rArr.push(obj(element));
            }
            StorageAdmin._array(`${_3D.DIYCloth._ins().name}/${_GameData._DIYClothes._ins()._otherPro.texF}`).value = fArr;
            StorageAdmin._array(`${_3D.DIYCloth._ins().name}/${_GameData._DIYClothes._ins()._otherPro.texR}`).value = rArr;
            _Ranking._whereFrom = this._Owner.name;
            // } else {
            //     // 绘制到两张只有一半的sp上，节省本地存储的内存
            //     this._SpriteVar('Front').scaleY = this._SpriteVar('Reverse').scaleY = 1;
            //     const texF = Tools._Draw.drawToTex(this._SpriteVar('Front'));
            //     const texR = Tools._Draw.drawToTex(this._SpriteVar('Reverse'));
            //     texF.width = texF.height = texR.width = texR.height = 256;
            //     this._SpriteVar('DrawFront').graphics.drawTexture(texF);
            //     this._SpriteVar('DrawReverse').graphics.drawTexture(texR);
            //     TimerAdmin._frameOnce(5, this, () => {
            //         const base64F = Tools._Draw.screenshot(this._SpriteVar('DrawFront'), 0.1);
            //         const base64R = Tools._Draw.screenshot(this._SpriteVar('DrawReverse'), 0.1);
            //         Laya.LocalStorage.setItem(`${_3D.DIYCloth._ins().name}/${_GameData._DIYClothes._ins()._otherPro.texF}`, base64F);
            //         Laya.LocalStorage.setItem(`${_3D.DIYCloth._ins().name}/${_GameData._DIYClothes._ins()._otherPro.texR}`, base64R);
            //         _Ranking._whereFrom = this._Owner.name;
            //         texF.destroy();
            //         texR.destroy();
            //     })
            // };
        }

        /**图片移动控制*/
        Tex = {
            Img: null as Laya.Image,
            DisImg: null as Laya.Image,
            imgSize: [128, 128],
            wireframeSize: [120, 150],
            touchP: null as Laya.Point,
            diffP: null as Laya.Point,
            dir: 'Front',
            dirType: {
                Front: 'Front',
                Reverse: 'Reverse',
            },
            state: 'none',
            stateType: {
                none: 'none',
                move: 'move',
                scale: 'scale',
                rotate: 'rotate',
                addTex: 'addTex',
            },
            zOderindex: 0,
            createImg: (name: string, gPoint: Laya.Point) => {
                this.Tex.DisImg && this.Tex.DisImg.destroy();
                this.Tex.DisImg = new Laya.Image;
                this.Tex.Img = new Laya.Image;
                let lPoint = this._SpriteVar('Ultimately').globalToLocal(gPoint);
                this.Tex.Img.skin = this.Tex.DisImg.skin = `Pattern/${name}.png`;
                this.Tex.Img.x = this.Tex.DisImg.x = lPoint.x;
                this.Tex.Img.y = this.Tex.DisImg.y = lPoint.y;
                this.Tex.Img.name = name;
                this.Tex.Img.width = this.Tex.DisImg.width = this.Tex.imgSize[0];
                this.Tex.Img.height = this.Tex.DisImg.height = this.Tex.imgSize[1];
                this.Tex.Img.anchorX = this.Tex.Img.anchorY = this.Tex.DisImg.anchorX = this.Tex.DisImg.anchorY = 0.5;
                this._SpriteVar('Dispaly').addChild(this.Tex.DisImg);
                this._SpriteVar('Dispaly').visible = true;
                // this.Tex.frameRestore();
                this.Tex.zOderindex++;
                this.Tex.Img.zOrder = this.Tex.zOderindex;
            },
            getTex: (): Laya.Texture[] => {
                let ImgF = this._ImgVar(this.Tex.dirType.Front);
                let ImgR = this._ImgVar(this.Tex.dirType.Reverse);
                let arr = [
                    ImgF.drawToTexture(ImgF.width, ImgF.height, ImgF.x, ImgF.y + ImgF.height) as Laya.Texture,
                    ImgR.drawToTexture(ImgR.width, ImgR.height, ImgR.x, ImgR.y + ImgR.height) as Laya.Texture
                ]
                return arr;
            },
            /**衣服上的位置偏移*/
            fDiffX: 0,
            fDiffY: 0,
            rDiffX: 0,
            rDiffY: 0,
            setImgPos: (): boolean => {
                let posArr = this.Tex.setPosArr();
                let indexArr: Array<Laya.Point> = [];
                let outArr: Laya.HitResult[] = [];
                for (let index = 0; index < posArr.length; index++) {
                    const out = Tools._3D.rayScanning(_3D._Scene._ins()._MainCamara, _3D._Scene._ins()._Owner, new Laya.Vector2(posArr[index].x, posArr[index].y), 'model');
                    if (out) {
                        outArr.push(out);
                        indexArr.push(posArr[index]);
                        // let Img = this._Owner.getChildByName(`Img${index}`) as Laya.Image;
                        // if (!Img) {
                        //     // let Img = new Laya.Image;
                        //     // Img.skin = `Lwg/UI/ui_circle_004.png`;
                        //     // this._Owner.addChild(Img);
                        //     // Img.name = `Img${index}`;
                        //     // Img.width = 20;
                        //     // Img.height = 20;
                        //     // Img.pivotX = Img.width / 2;
                        //     // Img.pivotY = Img.height / 2;
                        // } else {
                        //     Img.pos(posArr[index].x, posArr[index].y);
                        // }
                    }
                }
                if (indexArr.length !== 0) {
                    const out = outArr[outArr.length - 1];
                    this._SpriteVar(this.Tex.dir).addChild(this.Tex.Img);
                    let _width = this._ImgVar(this.Tex.dir).width;
                    let _height = this._ImgVar(this.Tex.dir).height;
                    //通过xz的角度计算x的比例，俯视
                    let angleXZ = Tools._Point.pointByAngle(_3D.DIYCloth._ins().ModelTap.transform.position.x - out.point.x, _3D.DIYCloth._ins().ModelTap.transform.position.z - out.point.z);
                    // let _angleY: number;
                    if (this.Tex.dir == this.Tex.dirType.Front) {
                        // _angleY = angleXZ + _3D.DIYCloth._ins().simRY;
                        this.Tex.Img.x = _width - _width / 180 * (angleXZ + 90);
                    } else {
                        // _angleY = angleXZ + _3D.DIYCloth._ins().simRY - 180;
                        this.Tex.Img.x = - _width / 180 * (angleXZ - 90);
                    }
                    // console.log(this.Tex.Img.x);
                    // 通过xy计算y
                    let pH = out.point.y - _3D.DIYCloth._ins().ModelTap.transform.position.y;//扫描点位置
                    let _DirHeight = Tools._3D.getMeshSize(this.Tex.dir === this.Tex.dirType.Front ? _3D.DIYCloth._ins().Front : _3D.DIYCloth._ins().Reverse).y;
                    let ratio = 1 - pH / _DirHeight;//比例
                    this.Tex.Img.y = ratio * _height;
                    // 补上一些误差
                    if (this.Tex.dir === this.Tex.dirType.Front) {
                        this.Tex.Img.x += this.Tex.fDiffX;
                        this.Tex.Img.y += this.Tex.fDiffY;
                    } else {
                        this.Tex.Img.x += this.Tex.rDiffX;
                        this.Tex.Img.y += this.Tex.rDiffY;
                    }
                    return true;
                } else {
                    return false;
                }
            },
            setPosArr: (): Array<Laya.Point> => {
                let x = this._ImgVar('Wireframe').x;
                let y = this._ImgVar('Wireframe').y;
                let _width = this._ImgVar('Wireframe').width;
                let _height = this._ImgVar('Wireframe').height;
                return [
                    // new Laya.Point(0, 0),
                    // new Laya.Point(0, _height / 2),
                    // new Laya.Point(_width, _height / 2),
                    // new Laya.Point(_width, 0),
                    // new Laya.Point(_width / 2, 0),
                    // new Laya.Point(_width / 2, _height),
                    // new Laya.Point(_width * 1 / 4, _height * 3 / 4),
                    // new Laya.Point(_width * 3 / 4, _height * 1 / 4),
                    new Laya.Point(x, y),
                    // new Laya.Point(_width * 1 / 4, _height * 1 / 4),
                    // new Laya.Point(_width * 3 / 4, _height * 3 / 4),
                    // new Laya.Point(x, _height),
                    // new Laya.Point(_width, _height),
                ];
            },
            /**
             * 检测是不是在模型中
             * */
            checkInside: (): any => {
                let posArr = this.Tex.setPosArr();
                let bool = false;
                for (let index = 0; index < posArr.length; index++) {
                    const _out = Tools._3D.rayScanning(_3D._Scene._ins()._MainCamara, _3D._Scene._ins()._Owner, new Laya.Vector2(posArr[index].x, posArr[index].y), 'model');
                    if (_out) {
                        bool = true;
                    }
                }
                return bool;
            },
            getDisGP: (): Laya.Point => {
                return this.Tex.DisImg ? this._SpriteVar('Dispaly').localToGlobal(new Laya.Point(this.Tex.DisImg.x, this.Tex.DisImg.y)) : null
            },
            disMove: () => {
                this.Tex.DisImg.x += this.Tex.diffP.x;
                this.Tex.DisImg.y += this.Tex.diffP.y;
                let gPoint = this.Tex.getDisGP();
                this._ImgVar('Wireframe').pos(gPoint.x, gPoint.y);
            },
            move: (e: Laya.Event) => {
                this.Tex.disMove();
                this._ImgVar('Wireframe').visible = false;
                if (this.Tex.checkInside()) {
                    this.Tex.setImgPos();
                    this._ImgVar('Wireframe').visible = true;
                    this.Tex.state = this.Tex.stateType.addTex;
                    this._SpriteVar('Dispaly').visible = false;
                }
            },
            addTex: (e: Laya.Event) => {
                this.Tex.disMove();
                let out = this.Tex.setImgPos();
                if (!out) {
                    this._ImgVar('Wireframe').visible = false;
                    this.Tex.state = this.Tex.stateType.move;
                    this.Tex.Img.x = Laya.stage.width;
                    this._SpriteVar('Dispaly').visible = true;
                }
                _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
            },
            scale: (e: Laya.Event): void => {
                if (!this.Tex.Img) {
                    return;
                }
                const lPoint = this._ImgVar('Wireframe').globalToLocal(new Laya.Point(e.stageX, e.stageY));
                this._ImgVar('Wireframe').width = this._ImgVar('WConversion').x = lPoint.x;
                this._ImgVar('Wireframe').height = this._ImgVar('WConversion').y = lPoint.y;
                const gPoint = this._Owner.localToGlobal(new Laya.Point(this._ImgVar('Wireframe').x, this._ImgVar('Wireframe').y));
                this.Tex.Img.rotation = this.Tex.DisImg.rotation = this._ImgVar('Wireframe').rotation = Tools._Point.pointByAngle(e.stageX - gPoint.x, e.stageY - gPoint.y) + 45;
                const scaleWidth = this._ImgVar('Wireframe').width - this.Tex.wireframeSize[0];
                const scaleheight = this._ImgVar('Wireframe').height - this.Tex.wireframeSize[1];
                this.Tex.DisImg.width = this.Tex.Img.width = this.Tex.imgSize[0] + scaleWidth;
                this.Tex.DisImg.height = this.Tex.Img.height = this.Tex.imgSize[1] + scaleheight;
                _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
            },
            rotate: (e: Laya.Event) => {
                if (!_GameData._Guide._complete) return;
                if (this.Tex.diffP.x > 0) {
                    _3D.DIYCloth._ins().rotate(1);
                } else {
                    _3D.DIYCloth._ins().rotate(0);
                }
            },
            again: () => {
                Tools._Node.removeAllChildren(this._SpriteVar('Front'));
                Tools._Node.removeAllChildren(this._SpriteVar('Reverse'));
                this.Tex.turnFace();
                _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
            },
            none: () => {
                return;
            },
            operation: (e: Laya.Event): void => {
                if (this.Tex.touchP) {
                    this.Tex.diffP = new Laya.Point(e.stageX - this.Tex.touchP.x, e.stageY - this.Tex.touchP.y);
                    this.Tex[this.Tex.state](e);
                    this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
                }
            },
            /**重制方框*/
            frameRestore: () => {
                this._ImgVar('Wireframe').rotation = 0;
                this._ImgVar('Wireframe').visible = false;
                this._ImgVar('Wireframe').width = this.Tex.wireframeSize[0];
                this._ImgVar('Wireframe').height = this.Tex.wireframeSize[1];
                this._ImgVar('WConversion').x = this._ImgVar('Wireframe').width;
                this._ImgVar('WConversion').y = this._ImgVar('Wireframe').height;
                this.Tex.Img = null;
            },
            /**关闭方框去掉图片*/
            close: (): void => {
                this.Tex.frameRestore();
                this.Tex.DisImg && this.Tex.DisImg.destroy();
                this.Tex.Img = null;
                this.Tex.Img && this.Tex.Img.destroy();
                this.Tex.Img = null;
                this.Tex.state = this.Tex.stateType.none;
                this.Tex.touchP = null;
                _3D.DIYCloth._ins().addTexture2D(this.Tex.getTex());
            },
            turnFace: (func?: Function) => {
                let time: number;
                let angle: number;
                if (this.Tex.dir == this.Tex.dirType.Front) {
                    time = Math.abs(_3D.DIYCloth._ins().Present.transform.localRotationEulerY - 180) * 2;
                    angle = 180;
                } else {
                    time = Math.abs(_3D.DIYCloth._ins().Present.transform.localRotationEulerY) * 2;
                    angle = 0;
                }
                Animation3D.rotateTo(_3D.DIYCloth._ins().Present, new Laya.Vector3(0, angle, 0), time, this, null, () => {
                    func && func();
                });
            },
            btn: () => {
                this._btnFour(this._ImgVar('WConversion'), (e: Laya.Event) => {
                    e.stopPropagation();
                    this.Tex.state = this.Tex.stateType.scale;
                }, null
                    , (e: Laya.Event) => {
                        e.stopPropagation();
                        this.Tex.state = this.Tex.stateType.addTex;
                        if (!_GameData._Guide._complete) {
                            if (_GameData._Guide.MakePatternState === _GameData._Guide.MakePatternStateType.Frame1) {
                                this._evNotify(_GameEvent.Guide.MakePatternTurnFace, [this._ImgVar('BtnTurnFace')._lwg.gPoint.x, this._ImgVar('BtnTurnFace')._lwg.gPoint.y]);
                            } else if (_GameData._Guide.MakePatternState === _GameData._Guide.MakePatternStateType.Frame2) {
                                this._evNotify(_GameEvent.Guide.MakePatternBtnCom, [this._ImgVar('BtnComplete')._lwg.gPoint.x, this._ImgVar('BtnComplete')._lwg.gPoint.y]);
                            }
                        }
                    })

                this._btnUp(this._ImgVar('BtnTurnFace'), (e: Laya.Event) => {
                    if (!_GameData._Guide._complete) {
                        if (_GameData._Guide.MakePatternState === _GameData._Guide.MakePatternStateType.TurnFace) {
                            this._evNotify(_GameEvent.Guide.MakePatternPattern2);
                        } else {
                            return;
                        }
                    }
                    e.stopPropagation();
                    this.Tex.frameRestore();
                    if (this.Tex.dir === this.Tex.dirType.Front) {
                        this.Tex.dir = this.Tex.dirType.Reverse;
                        this._ImgVar('BtnTurnFace').skin = 'Game/UI/MakePattern/fan.png';
                        ADManager.TAPoint(TaT.BtnClick, 'Amian');
                    } else {
                        this.Tex.dir = this.Tex.dirType.Front;
                        this._ImgVar('BtnTurnFace').skin = 'Game/UI/MakePattern/zheng.png';
                        ADManager.TAPoint(TaT.BtnClick, 'Bmian');
                    }
                    this.Tex.turnFace();
                    this._ImgVar('Wireframe').visible = false;
                    this.Tex.state = this.Tex.stateType.rotate;
                })

                if (!_GameData._Guide._complete) return;
                this._btnUp(this._ImgVar('WClose'), (e: Laya.Event) => {
                    e.stopPropagation();
                    this.Tex.close();
                })
                this._btnFour(this._ImgVar('BtnL'), (e: Laya.Event) => {
                    this.Tex.frameRestore();
                    this.Tex.state = this.Tex.stateType.rotate;
                    TimerAdmin._frameLoop(1, this._ImgVar('BtnL'), () => {
                        _3D.DIYCloth._ins().rotate(0);
                    })
                }, null, () => {
                    Laya.timer.clearAll(this._ImgVar('BtnL'));
                }, () => {
                    Laya.timer.clearAll(this._ImgVar('BtnL'));
                })
                this._btnFour(this._ImgVar('BtnR'), (e: Laya.Event) => {
                    this.Tex.frameRestore();
                    this.Tex.state = this.Tex.stateType.rotate;
                    TimerAdmin._frameLoop(1, this._ImgVar('BtnR'), () => {
                        _3D.DIYCloth._ins().rotate(1);
                    })
                }, null, () => {
                    Laya.timer.clearAll(this._ImgVar('BtnR'));
                }, () => {
                    Laya.timer.clearAll(this._ImgVar('BtnR'));
                })
            }
        }

        onStageMouseDown(e: Laya.Event): void {
            this.Tex.touchP = new Laya.Point(e.stageX, e.stageY);
            if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                this['slideFY'] = e.stageY;
            } else {
                // 点击位置离框子太远则消失
                if (!_GameData._Guide._complete) {
                    return;
                }
                const point = new Laya.Point(e.stageX, e.stageY);
                if (point.distance(this._ImgVar('Wireframe').x, this._ImgVar('Wireframe').y) > this._ImgVar('Wireframe').width / 2 + 50) {
                    this._ImgVar('Wireframe').visible = false;
                } else {
                    // 如果图片嵌入了或者没有创建则框子不会出来
                    if (!this.Tex.Img) {
                        this._ImgVar('Wireframe').visible = false;
                    } else {
                        this._ImgVar('Wireframe').visible = true;
                    }
                }
            }
        }
        onStageMouseMove(e: Laya.Event) {
            this.Tex.operation(e);
            if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                // 移动list
                if (!_GameData._Guide._complete) return;
                if (this['slideFY']) {
                    let diffY = this['slideFY'] - e.stageY;
                    let index = _GameData._Pattern._ins()._List.startIndex;
                    if (Math.abs(diffY) > 25) {
                        if (diffY > 0) {
                            _GameData._Pattern._ins()._List.tweenTo(index + 1, 100);
                        }
                        if (diffY < 0) {
                            _GameData._Pattern._ins()._List.tweenTo(index - 1, 100);
                        }
                        this['slideFY'] = null;
                    }
                }
            }
            else {
                this['slideFY'] = null;
            }
        }
        onStageMouseUp(e: Laya.Event) {
            this['slideFY'] = null;
            // 在可以移动图片的位置进行移动
            if (e.stageX > Laya.stage.width - this.UI.Operation.width) {
                this._evNotify(_Event.close);
            } else {
                // 在列表上抬起则关闭
                if (!this.Tex.checkInside()) {
                    this.Tex.close();
                } else {
                    if (!_GameData._Guide._complete) {
                        if (_GameData._Guide.MakePatternState === _GameData._Guide.MakePatternStateType.Pattern1) {
                            this._evNotify(_GameEvent.Guide.MakePatternFrame1, [this._ImgVar('Wireframe')]);
                        } else if (_GameData._Guide.MakePatternState === _GameData._Guide.MakePatternStateType.Pattern2) {
                            this._evNotify(_GameEvent.Guide.MakePatternFrame2, [this._ImgVar('Wireframe')]);
                        }
                    };
                }
            }
        }

        lwgOnDisable(): void {
            ADManager.TAPoint(TaT.PageLeave, 'tiehuapage');
            ADManager.TAPoint(TaT.LevelFinish, `level_${_3D.DIYCloth._ins().Present.name}`);
        }
    }
}
export default _MakePattern.MakePattern;