import ADManager, { TaT } from "../../TJ/Admanager";
import RecordManager from "../../TJ/RecordManager";
import { LwgScene, LwgAni2D, LwgAni3D, LwgData, LwgDialogue, LwgStorage, LwgTimer, LwgTools, LwgPlatform } from "../Lwg/Lwg";
import { LwgOPPO } from "../Lwg/LwgOPPO";
import { _3DDIYCloth, _3DScene } from "./_3D";
import { _GameAni } from "./_GameAni";
import { _DIYClothes, _Guide, _MakePattern, _Ranking, _Share, _Start, _Tweeting } from "./_GameData";
import { _Res } from "./_Res";
import { _SceneName } from "./_SceneName";
import { _UI } from "./_UI";

class _Item extends LwgData._Item {
    fX: number;
    diffX: number = 0;
    create: boolean = false;
    $button(): void {
        this._btnFour(this._ImgChild('Icon'),
            (e: Laya.Event) => {
                if (!this.$data.complete) {
                    switch (this.$data.unlockWay) {
                        case this.$unlockWayType.check:
                            LwgDialogue.createHint_Middle('请前往签到页面获取');
                            break;
                        case this.$unlockWayType.customs:
                            LwgDialogue.createHint_Middle(`制作${this.$data.conditionNum}件衣服才能获取！`);
                            break;
                        case this.$unlockWayType.ads:
                            ADManager.ShowReward(() => {
                                if (_MakePattern._Pattern._ins()._checkCondition(this.$data.name)) {
                                    LwgDialogue.createHint_Middle('恭喜获得新贴图！');
                                    _MakePattern._Pattern._ins()._setProperty(this.$data.name, _MakePattern._Pattern._ins()._property.complete, true);
                                }
                            })
                            break;
                        default:
                            break;
                    }
                }
                if (this.$data.name === 'ads' || !this.$data.name || !this.$data.complete) {
                    this['Cancal'] = true;
                    return;
                } else {
                    this['Cancal'] = false;
                }
                this.create = false;
                this.diffX = 0;
                this.fX = e.stageX;
                this._evNotify(_MakePattern.Event.close);
            },
            (e: Laya.Event) => {
                if (this['Cancal']) {
                    return;
                }
                if (!this.create) {
                    this.diffX = this.fX - e.stageX;
                    if (this.diffX >= 5) {
                        this._evNotify(_MakePattern.Event.createImg, [this.$data.name, this._Owner._lwg.gPoint]);
                        this.create = true;
                    }
                }
            },
            () => {
                if (this['Cancal']) {
                    return;
                }
                this.create = true;
                this._evNotify(_MakePattern.Event.close);
            },
            () => {
                if (this['Cancal']) {
                    return;
                }
                this.create = true;
            })
    }

    $render(): void {
        this._LableChild('UnlockWayNum').visible = false;
        if (this.$data.name === 'ads') {
            !this._BoxChild('NativeRoot') && LwgTools._Node.createPrefab(_Res._list.prefab2D.NativeRoot.prefab, this._Owner);
            this._LableChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = false;
        } else {
            if (!this.$data.complete) {
                if (this.$data.unlockWay === _MakePattern._Pattern._ins()._unlockWay.ads) {
                    this._ImgChild('AdsSign').visible = true;
                    this._LableChild('UnlockWay').visible = false;
                } else {
                    this._LableChild('AdsSign').visible = false;
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
                            this._LableChild('UnlockWayNum').text = `(${_Tweeting._completeNum} /${this.$data.conditionNum})`;
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
            this._ImgChild('Icon').gray = !this.$data.complete;
            if (this._BoxChild('NativeRoot')) this._BoxChild('NativeRoot').destroy();
            // 有些是空的占位置用的
            if (this.$data.name) {
                this._ImgChild('Icon').skin = `Pattern/${this.$data.name}.png`;
            } else {
                this._LableChild('Mask').visible = this._LableChild('UnlockWay').visible = this._ImgChild('AdsSign').visible = this._ImgChild('Icon').visible = false;
                this._ImgChild('Icon').skin = null;
            }
        }
    }
}

export default class MakePattern extends LwgScene._SceneBase {

    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.PageShow, 'tiehuapage');
        ADManager.TAPoint(TaT.LevelStart, `level_${_3DDIYCloth._ins().Present.name}`);

        _MakePattern._Pattern._ins()._List = this._ListVar('List');
        // 如果第一有了，选中就在第一列，否则停在第二列
        if (_MakePattern._Pattern._ins()._getProperty('newYear1', _MakePattern._Pattern._ins()._property.complete) || !_Guide._complete.value) {
            this.switchClassify('newYear');
            _MakePattern._Pattern._ins()._listArray = _MakePattern._Pattern._ins().newYearArr;
        } else {
            this.switchClassify('basic');
            _MakePattern._Pattern._ins()._listArray = _MakePattern._Pattern._ins().basicArr;
        }
        _MakePattern._Pattern._ins()._List.scrollBar.touchScrollEnable = false;
        _MakePattern._Pattern._ins()._listRenderScript = _Item;
        this.Tex.fDiffX = _MakePattern._PatternDiff._ins().fDiffX;
        this.Tex.fDiffY = _MakePattern._PatternDiff._ins().fDiffY;
        this.Tex.rDiffX = _MakePattern._PatternDiff._ins().rDiffX;
        this.Tex.rDiffY = _MakePattern._PatternDiff._ins().rDiffY;
    }

    lwgOpenAniAfter(): void {
        LwgTimer._frameOnce(60, this, () => {
            !_Guide._complete.value && this._openScene(_SceneName.Guide, false, false, () => {
                this._evNotify(_Guide.Event.MakePatternChooseClassify);
            })
        })
    }

    lwgAdaptive(): void {
        this._adaWidth([this._ImgVar('BtnR'), this._ImgVar('BtnL')]);
    }

    UI: _UI;
    lwgOnStart(): void {
        // 设置皮肤
        const url = _DIYClothes._ins().getPitchTexBasicUrl();
        this._ImgVar('Front').loadImage(url, Laya.Handler.create(this, () => {
            this._ImgVar('Reverse').loadImage(url, Laya.Handler.create(this, () => {
                _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
            }));
        }));

        LwgAni2D.fadeOut(this._ImgVar('BtnL'), 0, 1, 200, 200);
        LwgAni2D.fadeOut(this._ImgVar('BtnR'), 0, 1, 200, 200);

        this.UI = new _UI(this._Owner);
        this.UI.BtnAgain.pos(86, 630);
        LwgTimer._frameOnce(10, this, () => {
            this.UI.operationAppear(() => {
                this.UI.btnCompleteAppear(null, 400);
                this.UI.btnTurnFaceAppear(null, 200);
            });
            this.UI.btnBackAppear(null, 200);
            this.UI.btnRollbackAppear(null, 600);
            this.UI.btnAgainAppear(null, 800);
        })

        this._SpriteVar('Front').y = this._ImgVar('Reverse').y = this._SpriteVar('Front').height = this._ImgVar('Reverse').height = _3DDIYCloth._ins().texHeight;
    }

    /**设置分类*/
    switchClassify(_name: string): void {
        if (!_Guide._complete.value && _name !== 'basic') {
            return;
        }
        for (let index = 0; index < this._ImgVar('Part').numChildren; index++) {
            const element = this._ImgVar('Part').getChildAt(index) as Laya.Image;
            const name = element.getChildAt(0) as Laya.Label;
            if (_name === element.name) {
                if (!_Guide._complete.value) {
                    if (_Guide.MakePatternState === _Guide.MakePatternStateType.ChooseClassify) {
                        this._evNotify(_Guide.Event.MakePatternPattern1);
                    }
                }
                element.scale(1.1, 1.1);
                _MakePattern._Pattern._ins()._listArray = _MakePattern._Pattern._ins()[`${element.name}Arr`];
                _MakePattern._Pattern._ins()._pitchClassify = element.name;
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
            if (!_Guide._complete.value) {
                if (_Guide.MakePatternState === _Guide.MakePatternStateType.BtnCom) {
                    this._evNotify(_Guide.Event.closeGuide);
                } else {
                    return;
                }
            }
            // 渠道选择
            if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                RecordManager.stopAutoRecord();
                this._openScene(_SceneName.Share, false);
                _Share._whereFrom = _SceneName.MakePattern;
                return;
            } else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
                this.backStart();
            }
        }
        if (!_Guide._complete.value) return;
        this.UI.btnRollbackClick = () => {
            _3DScene._ins().cameraToSprite(this._Owner);
            this._openScene(_SceneName.MakeTailor, true, true);
        }
        this.UI.btnAgainClick = () => {
            this.Tex.again();
        }
    }
    /**回到主界面需要的操作*/
    backStart(): void {
        this.Tex.frameRestore();
        this.Tex.dir = this.Tex.dirType.Front;
        this.Tex.turnFace(() => {
            // 这次绘制的是微博照片
            _3DScene._ins().cameraToSprite(this._Owner);
            LwgTimer._frameOnce(5, this, () => {
                _Tweeting._photo.take(this._Owner, 1);
            })
            this.texStorage();
            LwgAni2D.fadeOut(this._ImgVar('BtnL'), 1, 0, 200);
            LwgAni2D.fadeOut(this._ImgVar('BtnR'), 1, 0, 200);
        });
        this.UI.operationVinish(() => {
            this.UI.btnBackVinish(null, 200);
            this.UI.btnBackVinish();
            this.UI.btnRollbackVinish();
            this.UI.btnAgainVinish(() => {
            })
            var close = () => {
                // 这次绘制是为了过场动画
                _3DScene._ins().cameraToSprite(this._Owner);
                _Start._whereFrom = _SceneName.MakePattern;
                this._openScene(_SceneName.Start, true, true);
            }
            if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
                LwgOPPO._screenShootByRatio((data: any) => {
                    LwgOPPO._picSave(data['tempFilePath'], _3DDIYCloth._ins().name);
                    close();
                }, 0.28, null, 0.72, null, null, 0.1);
            } else {
                close();
            }
        }, 200);
    }

    lwgEvent(): void {
        this._evReg(_MakePattern.Event.createImg, (name: string, gPoint: Laya.Point) => {
            this.Tex.state = this.Tex.stateType.move;
            this.Tex.createImg(name, gPoint);
            this.Tex.turnFace();
        })
        this._evReg(_MakePattern.Event.close, () => {
            if (!_Guide._complete.value) return;
            this.Tex.close();
            this.Tex.state = this.Tex.stateType.none;
        })
        this._evReg(_MakePattern.Event.byteDanceBackStart, () => {
            if (!_Guide._complete.value) return;
            this.backStart();
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
        LwgStorage._array(`${_3DDIYCloth._ins().name}/${_DIYClothes._ins()._otherPro.texF}`).value = fArr;
        LwgStorage._array(`${_3DDIYCloth._ins().name}/${_DIYClothes._ins()._otherPro.texR}`).value = rArr;
        _Ranking._whereFrom = _SceneName.Tweeting_GetFans;
        // } else {
        //     // 绘制到两张只有一半的sp上，节省本地存储的内存
        //     this._SpriteVar('Front').scaleY = this._SpriteVar('Reverse').scaleY = 1;
        //     const texF = LwgTools._Draw.drawToTex(this._SpriteVar('Front'));
        //     const texR = LwgTools._Draw.drawToTex(this._SpriteVar('Reverse'));
        //     texF.width = texF.height = texR.width = texR.height = 256;
        //     this._SpriteVar('DrawFront').graphics.drawTexture(texF);
        //     this._SpriteVar('DrawReverse').graphics.drawTexture(texR);
        //     LwgTimer._frameOnce(5, this, () => {
        //         const base64F = LwgTools._Draw.screenshot(this._SpriteVar('DrawFront'), 0.1);
        //         const base64R = LwgTools._Draw.screenshot(this._SpriteVar('DrawReverse'), 0.1);
        //         Laya.LocalStorage.setItem(`${_3DDIYCloth._ins().name}/${_DIYClothes._ins()._otherPro.texF}`, base64F);
        //         Laya.LocalStorage.setItem(`${_3DDIYCloth._ins().name}/${_DIYClothes._ins()._otherPro.texR}`, base64R);
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
                const out = LwgTools._3D.rayScanning(_3DScene._ins()._MainCamara, _3DScene._ins()._Owner, new Laya.Vector2(posArr[index].x, posArr[index].y), 'model');
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
                let angleXZ = LwgTools._Point.pointByAngleOld(_3DDIYCloth._ins().ModelTap.transform.position.x - out.point.x, _3DDIYCloth._ins().ModelTap.transform.position.z - out.point.z);
                // let _angleY: number;
                if (this.Tex.dir == this.Tex.dirType.Front) {
                    // _angleY = angleXZ + _3DDIYCloth._ins().simRY;
                    this.Tex.Img.x = _width - _width / 180 * (angleXZ + 90);
                } else {
                    // _angleY = angleXZ + _3DDIYCloth._ins().simRY - 180;
                    this.Tex.Img.x = - _width / 180 * (angleXZ - 90);
                }
                // console.log(this.Tex.Img.x);
                // 通过xy计算y
                let pH = out.point.y - _3DDIYCloth._ins().ModelTap.transform.position.y;//扫描点位置
                let _DirHeight = LwgTools._3D.getMeshSize(this.Tex.dir === this.Tex.dirType.Front ? _3DDIYCloth._ins().Front : _3DDIYCloth._ins().Reverse).y;
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
                const _out = LwgTools._3D.rayScanning(_3DScene._ins()._MainCamara, _3DScene._ins()._Owner, new Laya.Vector2(posArr[index].x, posArr[index].y), 'model');
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
        move: () => {
            this.Tex.disMove();
            this._ImgVar('Wireframe').visible = false;
            if (this.Tex.checkInside()) {
                this.Tex.setImgPos();
                this._ImgVar('Wireframe').visible = true;
                this.Tex.state = this.Tex.stateType.addTex;
                this._SpriteVar('Dispaly').visible = false;
            }
        },
        addTex: () => {
            this.Tex.disMove();
            let out = this.Tex.setImgPos();
            if (!out) {
                this._ImgVar('Wireframe').visible = false;
                this.Tex.state = this.Tex.stateType.move;
                this.Tex.Img.x = Laya.stage.width;
                this._SpriteVar('Dispaly').visible = true;
            }
            _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
        },
        scale: (e: Laya.Event): void => {
            if (!this.Tex.Img) {
                return;
            }
            const lPoint = this._ImgVar('Wireframe').globalToLocal(new Laya.Point(e.stageX, e.stageY));
            this._ImgVar('Wireframe').width = this._ImgVar('WConversion').x = lPoint.x;
            this._ImgVar('Wireframe').height = this._ImgVar('WConversion').y = lPoint.y;
            const gPoint = this._Owner.localToGlobal(new Laya.Point(this._ImgVar('Wireframe').x, this._ImgVar('Wireframe').y));
            this.Tex.Img.rotation = this.Tex.DisImg.rotation = this._ImgVar('Wireframe').rotation = LwgTools._Point.pointByAngleOld(e.stageX - gPoint.x, e.stageY - gPoint.y) + 45;
            const scaleWidth = this._ImgVar('Wireframe').width - this.Tex.wireframeSize[0];
            const scaleheight = this._ImgVar('Wireframe').height - this.Tex.wireframeSize[1];
            this.Tex.DisImg.width = this.Tex.Img.width = this.Tex.imgSize[0] + scaleWidth;
            this.Tex.DisImg.height = this.Tex.Img.height = this.Tex.imgSize[1] + scaleheight;
            _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
        },
        rotate: () => {
            if (!_Guide._complete.value) return;
            if (this.Tex.diffP.x > 0) {
                _3DDIYCloth._ins().rotate(1);
            } else {
                _3DDIYCloth._ins().rotate(0);
            }
        },
        again: () => {
            LwgTools._Node.removeAllChildren(this._SpriteVar('Front'));
            LwgTools._Node.removeAllChildren(this._SpriteVar('Reverse'));
            this.Tex.turnFace();
            _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
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
            _3DDIYCloth._ins().addTexture2D(this.Tex.getTex());
        },
        turnFace: (func?: Function) => {
            let time: number;
            let angle: number;
            if (this.Tex.dir == this.Tex.dirType.Front) {
                time = Math.abs(_3DDIYCloth._ins().Present.transform.localRotationEulerY - 180) * 2;
                angle = 180;
            } else {
                time = Math.abs(_3DDIYCloth._ins().Present.transform.localRotationEulerY) * 2;
                angle = 0;
            }
            LwgAni3D.rotateTo(_3DDIYCloth._ins().Present, new Laya.Vector3(0, angle, 0), time, this, null, () => {
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
                    if (!_Guide._complete.value) {
                        if (_Guide.MakePatternState === _Guide.MakePatternStateType.Frame1) {
                            this._evNotify(_Guide.Event.MakePatternTurnFace, [this._ImgVar('BtnTurnFace')._lwg.gPoint.x, this._ImgVar('BtnTurnFace')._lwg.gPoint.y]);
                        } else if (_Guide.MakePatternState === _Guide.MakePatternStateType.Frame2) {
                            this._evNotify(_Guide.Event.MakePatternBtnCom, [this._ImgVar('BtnComplete')._lwg.gPoint.x, this._ImgVar('BtnComplete')._lwg.gPoint.y]);
                        }
                    }
                })

            this._btnUp(this._ImgVar('BtnTurnFace'), (e: Laya.Event) => {
                if (!_Guide._complete.value) {
                    if (_Guide.MakePatternState === _Guide.MakePatternStateType.TurnFace) {
                        this._evNotify(_Guide.Event.MakePatternPattern2);
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

            if (!_Guide._complete.value) return;
            this._btnUp(this._ImgVar('WClose'), (e: Laya.Event) => {
                e.stopPropagation();
                this.Tex.close();
            })
            this._btnFour(this._ImgVar('BtnL'), () => {
                this.Tex.frameRestore();
                this.Tex.state = this.Tex.stateType.rotate;
                LwgTimer._frameLoop(1, this._ImgVar('BtnL'), () => {
                    _3DDIYCloth._ins().rotate(0);
                })
            }, null, () => {
                Laya.timer.clearAll(this._ImgVar('BtnL'));
            }, () => {
                Laya.timer.clearAll(this._ImgVar('BtnL'));
            })
            this._btnFour(this._ImgVar('BtnR'), () => {
                this.Tex.frameRestore();
                this.Tex.state = this.Tex.stateType.rotate;
                LwgTimer._frameLoop(1, this._ImgVar('BtnR'), () => {
                    _3DDIYCloth._ins().rotate(1);
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
            if (!_Guide._complete.value) {
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
            if (!_Guide._complete.value) return;
            if (this['slideFY']) {
                let diffY = this['slideFY'] - e.stageY;
                let index = _MakePattern._Pattern._ins()._List.startIndex;
                if (Math.abs(diffY) > 25) {
                    if (diffY > 0) {
                        _MakePattern._Pattern._ins()._List.tweenTo(index + 1, 100);
                    }
                    if (diffY < 0) {
                        _MakePattern._Pattern._ins()._List.tweenTo(index - 1, 100);
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
            this._evNotify(_MakePattern.Event.close);
        } else {
            // 在列表上抬起则关闭
            if (!this.Tex.checkInside()) {
                this.Tex.close();
            } else {
                if (!_Guide._complete.value) {
                    if (_Guide.MakePatternState === _Guide.MakePatternStateType.Pattern1) {
                        this._evNotify(_Guide.Event.MakePatternFrame1, [this._ImgVar('Wireframe')]);
                    } else if (_Guide.MakePatternState === _Guide.MakePatternStateType.Pattern2) {
                        this._evNotify(_Guide.Event.MakePatternFrame2, [this._ImgVar('Wireframe')]);
                    }
                };
            }
        }
    }

    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.PageLeave, 'tiehuapage');
        ADManager.TAPoint(TaT.LevelFinish, `level_${_3DDIYCloth._ins().Present.name}`);
    }
}