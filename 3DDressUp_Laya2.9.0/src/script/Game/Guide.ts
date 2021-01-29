import { Admin, Animation2D, Effects2D, Effects3D, EventAdmin, StorageAdmin, TimerAdmin, Tools, _SceneName } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";
/**裁剪界面的层级必须在最上面*/
export default class Guide extends Admin._SceneBase {
    lwgOpenAni(): number {
        return 200;
    }
    lwgOnAwake(): void {
        this._ImgVar('Hand').scale(0, 0);
        this._ImgVar('Slide').scale(0, 0);
    }
    clickEffcet(): void {
        Effects2D._Aperture._continuous(this._Owner, [this._ImgVar('Hand').x, this._ImgVar('Hand').y + 28], [6, 6], null, null, [Effects2D._SkinUrl.圆形小光环], null, this._ImgVar('Hand').zOrder - 1, [1.2, 1.2], [0.6, 0.6], [0.01, 0.01]);
    }
    /**
      * 在一个节点上绘制一个圆形反向遮罩,可以绘制很多个,但是不要同时存在多个interactionArea，清除直接删除node中的interactionArea节点即可
      * @param arr 数量信息数组[[x位置，y位置，radius半径]]
      * @param handX 手的位置
      * @param handY 手的位置
      * @param func 回调函数
      */
    boreholeCircle(arr: Array<[number, number, number]>, handX?: number, handY?: number, func?: Function): void {
        for (let index = 0; index < arr.length; index++) {
            const time = 80 / 8;
            let radiusBase = 15;
            const element = arr[index];
            const speed = (arr[index][2] - radiusBase) / time;
            TimerAdmin._frameNumLoop(1, time, this, () => {
                radiusBase += speed;
                element[2] = radiusBase;
                Tools._Draw.reverseCircleMask(this._ImgVar('Background'), arr, true);
            }, () => {
                func && func();
            }, true)
        }
        handX && this._ImgVar('Hand').pos(handX, handY - 30);
    }
    /**
      * 在一个节点上绘制一个圆形反向遮罩,可以绘制很多个，清除直接删除node中的子节点即可
      * 圆角矩形的中心点在节点的中间
      * @param arr  数量信息数组[[x位置，y位置，width宽，height高，round圆角角度]]
      * @param handX 手的位置
      * @param handY 手的位置
      */
    boreholeRoundrect(arr: Array<[number, number, number, number, number]>, handX?: number, handY?: number, func?: Function): void {
        handX && this._ImgVar('Hand').pos(handX, handY);
        for (let index = 0; index < arr.length; index++) {
            let widthBase = 0;
            let heightBase = 0;
            let radiuBase = 0;
            const element = arr[index];
            // 时间为长宽的平均值然后计算
            const time = 20;
            const speedX = (element[2] - widthBase) / time;
            const speedY = (element[3] - heightBase) / time;
            const speedR = (element[4] - radiuBase) / time;
            TimerAdmin._frameNumLoop(1, time, this, () => {
                widthBase += speedX;
                heightBase += speedY;
                radiuBase += speedR;
                element[2] = widthBase;
                element[3] = heightBase;
                element[4] = radiuBase;
                Tools._Draw.reverseRoundrectMask(this._ImgVar('Background'), arr, true);
            }, () => {
                func && func();
            }, true)
        }
        handX && this._ImgVar('Hand').pos(handX, handY);
    }

    btnComX = Laya.stage.width - 250;
    btnComY = 70;
    handAppear(delay?: number, func?: Function): void {
        const time = 200;
        Animation2D.scale(this._ImgVar('Hand'), 0, 0, 1, 1, time, delay ? delay : 0, () => {
            func && func();
        })
        this._ImgVar('HandPic').rotation = -17;
    }
    bgAppear(delay?: number, func?: Function): void {
        Tools._Node.destroyAllChildren(this._ImgVar('Background'));
        const time = 300;
        this._ImgVar('HandPic').rotation = -17;
        Animation2D.fadeOut(this._ImgVar('Background'), 0, 1, time, delay ? delay : 0, () => {
            func && func();
        });
    }
    handVanish(delay?: number, func?: Function): void {
        const time = 300;
        this._ImgVar('HandPic').rotation = -17;
        Animation2D.scale(this._ImgVar('Hand'), 1, 1, 0, 0, time, delay ? delay : 0, () => {
            func && func();
        })
    }
    bgVanish(delay?: number, func?: Function): void {
        const time = 300;
        Animation2D.fadeOut(this._ImgVar('Background'), 1, 0, time, delay ? delay : 0, () => {
            func && func();
        });
    }
    bgType = {
        present: 'present',
        vanish: 'vanish',
        appear: 'appear',
    }
    handMove(x: number, y: number, func?: Function, bgType?: string): void {
        this.handClear();
        const _y = y - 30;
        const point = new Laya.Point(this._ImgVar('Hand').x, this._ImgVar('Hand').y);
        const time = point.distance(x, _y);
        Animation2D.move(this._ImgVar('Hand'), x, _y, time, () => {
            func && func();
        })
        this._ImgVar('Hand').scale(1, 1);
        Animation2D.move(this._ImgVar('HandPic'), 75, 56, time);
        switch (bgType) {
            case this.bgType.vanish:
                this.bgVanish();
                break;
            case this.bgType.appear:
                this.bgAppear();
                break;
            default:
                break;
        }
    }
    handClear(): void {
        this.lineStop();
        TimerAdmin._clearAll([this._ImgVar('Hand')]);
        Animation2D._clearAll([this._ImgVar('Hand')]);
        this._AniVar('Frame').stop();
        this._AniVar('Click').stop();
        this._AniVar('ClickOne').stop();
        this._ImgVar('Hand').visible = true;
        this._ImgVar('HandPic').scale(1, 1);
        this._ImgVar('HandPic').rotation = -17;
        this._ImgVar('Hand').pos(this._ImgVar('HandPic')._lwg.gPoint.x - 75, this._ImgVar('HandPic')._lwg.gPoint.y - 56);
        this._ImgVar('HandPic').pos(75, 56);
    }

    /**
     * 单个矩形的出现，滑动动作出现
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} radius 圆角角度
     * @memberof Guide
     */
    slideUpAppear(x: number, y: number, width: number, height: number, radius: number, delay?: number): void {
        this.bgAppear(delay ? delay : 0, () => {
            this.boreholeRoundrect([[x, y, width, height, radius]], null, null, () => {
                this._ImgVar('Hand').scale(0, 0);
                this._ImgVar('Slide').scale(1, 1);
                this._ImgVar('Slide').pos(x, y);
                this._AniVar('SlideUp').play();
            });
        });
    }

    /**
     * 单个矩形的出现
     * @param {number} x x位置
     * @param {number} y y位置
     * @param {number} width 宽度
     * @param {number} height 高度
     * @param {number} radius 圆角角度
     * @memberof Guide
     */
    noMoveRoundrect(x: number, y: number, width: number, height: number, radius: number, delay?: number, handX?: number, handY?: number): void {
        this.bgAppear(delay ? delay : 0, () => {
            this.boreholeRoundrect([[x, y, width, height, radius]], handX ? handX : x, handY ? handY : y - 30, () => {
                this.handAppear(null, () => {
                    this._AniVar('Click').play();
                });
            });
        });
    }

    moveRoundrectNoBg(x: number, y: number, width: number, height: number, radius: number, delay?: number): void {
        this.boreholeRoundrect([[x, y, width, height, radius]], null, null, () => {
            this.handMove(x, y, () => {
                this._AniVar('Click').play();
            });
        });
    }

    /**
    * 引导开始时单个圆形的出现
    * @param {number} x x坐标
    * @param {number} y y坐标
    * @param {number} radius 半径
    * @memberof Guide
    */
    noMoveCircle(x: number, y: number, radius: number): void {
        this.bgAppear(0, () => {
            this.boreholeCircle([[x, y, radius]], x, y, () => {
                this.handAppear(200, () => {
                    this._AniVar('Click').play();
                });
            });
        })
    }

    /** 
     * 移动到另一个创建的圆上
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {number} radius 半径
     * @memberof Guide
     */
    moveCircleBg(x: number, y: number, radius: number): void {
        this.bgAppear(0, () => {
            this.boreholeCircle([[x, y, radius]], null, null, () => {

                this.handMove(x, y, () => {
                    this._AniVar('Click').play();
                });
            });
        });
    }
    /** 
     * 移动到另一个创建的圆上
     * @param {number} x x坐标
     * @param {number} y y坐标
     * @param {number} radius 半径
     * @memberof Guide
     */
    moveCircleNoBg(x: number, y: number, radius: number): void {
        this.boreholeCircle([[x, y, radius]], null, null, () => {
            this.handMove(x, y, () => {
                this._AniVar('Click').play();
            });
        });
    }

    _closeLine: boolean;
    _stepTailor = 0;
    _Scissor: Laya.Sprite;
    getGuideScissorTime(x: number, y: number): number {
        const point = Tools._Node.getNodeGP(this._Scissor);
        return point.distance(x, y);
    }
    posArr = [
        [Laya.stage.width / 2 + 110, 140],
        [Laya.stage.width / 2 - 110, Laya.stage.height / 2 - 220],
        [Laya.stage.width / 2 + 100, Laya.stage.height / 2 - 200],
        [Laya.stage.width / 2 + 200, Laya.stage.height - 150],
    ];

    scissorTailor(first?: boolean,): void {
        if (!this._Scissor || this._closeLine) return;
        this._ImgVar('Hand').pos(this._Scissor.x, this._Scissor.y);
        const index = Number(this.presentName.substr(4));
        const pos = this.posArr[index - 1];
        var func = () => {
            this._AniVar('Click').play(0, false);
            Animation2D.move(this._ImgVar('Hand'), pos[0], pos[1], this.getGuideScissorTime(pos[0], pos[1]), () => {
                this._AniVar(this.presentName).play(0, false);
            }, 1500);
        }
        if (first) {
            func();
        } else {
            TimerAdmin._loop(6000, this._ImgVar('Hand'), () => {
                this.handAppear(0, () => {
                    func();
                })
            }, true);
        }
    }
    startScissorTailor(Scissor?: Laya.Sprite): void {
        if (Scissor) this._Scissor = Scissor;
        this.presentName = 'Line01';
        this._ImgVar('Hand').scale(1, 1);
        Animation2D.move(this._ImgVar('Hand'), this._Scissor.x, this._Scissor.y, this.getGuideScissorTime(this._ImgVar('Hand').x, this._ImgVar('Hand').y), () => {
            this.scissorTailor(true);
            TimerAdmin._once(5000, this._ImgVar('Hand'), () => {
                this.scissorTailor();
            })
        })
    }
    nameArr = ['Line01', 'Line02', 'Line03', 'Line04'];
    presentName = null;
    lineStop(): void {
        this._AniVar('Line01').stop();
        this._AniVar('Line02').stop();
        this._AniVar('Line03').stop();
        this._AniVar('Line04').stop();
    }
    newScissorTailor(LineName?: string): void {
        this.handClear();
        if (this.nameArr.length > 1) {
            for (let index = 0; index < this.nameArr.length; index++) {
                const element = this.nameArr[index];
                if (LineName === element) {
                    this.nameArr.splice(index, 1);
                    break;
                }
            }
            this.presentName = this.nameArr[0];
            this.scissorTailor();
        } else {
            this.presentName = null;
            this._ImgVar('Hand').visible = false;
            this._Owner.close();
        }
    }


    /**拉伸框子*/
    _Wireframe: Laya.Image;

    pattenAni(ftx: number, fty: number, tx: number, ty: number): void {
        this.handMove(ftx, fty, () => {
            const time = 700;
            const delay = 1000;
            TimerAdmin._loop(time * 3 + delay, this._ImgVar('Hand'), () => {
                this._ImgVar('Hand').scale(1, 1);
                TimerAdmin._once(200, this._ImgVar('Hand'), () => {
                    this._AniVar('ClickOne').play(0, false);
                })
                Animation2D.move(this._ImgVar('Hand'), tx, ty, time, () => {
                    this.handVanish(300, () => {
                        this._ImgVar('Hand').pos(ftx, fty - 30);
                    });
                }, delay);
            }, true);
        })
    }

    lwgEvent(): void {
        this._AniVar('Click').on(Laya.Event.LABEL, this, (e: string) => {
            if (e === 'effect') {
                this.clickEffcet();
            }
        })
        this._AniVar('ClickOne').on(Laya.Event.LABEL, this, (e: string) => {
            if (e === 'effect') {
                this.clickEffcet();
            }
        })
        this._AniVar('Frame').on(Laya.Event.LABEL, this, (e: string) => {
            if (e === 'effect') {
                this.clickEffcet();
            }
        })
        for (let index = 0; index < 4; index++) {
            const element = this._AniVar(`Line0${index + 1}`);
            element.on(Laya.Event.LABEL, this, (e: string) => {
                if (e === 'com') {
                    this._ImgVar('Hand').pos(this._Scissor.x, this._Scissor.y);
                    this._ImgVar('Hand').scale(0, 0);
                    this._ImgVar('HandPic').scale(1, 1);
                }
            })
        }

        const radius = 80;
        this._evReg(_GameData._Guide.event.StartBtnDress, (x: number, y: number) => {
            this.noMoveCircle(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.MakeTailorPulldown, () => {
            const x = Laya.stage.width - 95;
            const y = Laya.stage.height / 2;
            this.slideUpAppear(x, y, 165, 450, 20);
        })

        this._evReg(_GameData._Guide.event.MakeTailorChangeCloth, () => {
            this._ImgVar('Hand').pos(this._ImgVar('SlideHand')._lwg.gPoint.x, this._ImgVar('SlideHand')._lwg.gPoint.y);
            this._ImgVar('Hand').scale(1, 1);
            this._ImgVar('Slide').scale(0, 0);
            const x = Laya.stage.width - 95;
            const y = 370;
            this.moveCircleNoBg(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.MakeTailorBtnCom, () => {
            this._AniVar('Click').stop();
            this.boreholeCircle([[this.btnComX, this.btnComY, radius], [Laya.stage.width / 2, Laya.stage.height / 2, 350]], null, null, () => {
                this.handMove(this.btnComX, this.btnComY, () => {
                    this._AniVar('Click').play();
                });
            });
        })
        this._evReg(_GameData._Guide.event.MakeTailorStartTailor, (Scissor: Laya.Sprite) => {
            this.bgVanish();
            this.handClear();
            this.startScissorTailor(Scissor);
        })
        this._evReg(_GameData._Guide.event.MakeTailorNewTailor, (LineName: string) => {
            this.newScissorTailor(LineName);
        })
        this._evReg(_GameData._Guide.event.MakeTailorCloseTailor, () => {
            if (!this.presentName) return;
            this._closeLine = true;
            this.handClear();
            this._ImgVar('Hand').scale(0, 0);
        })
        this._evReg(_GameData._Guide.event.MakeTailorOpenTailor, () => {
            if (!this.presentName) return;
            this._closeLine = false;
            this.handClear();
            this.scissorTailor();
        })

        this._evReg(_GameData._Guide.event.MakePatternChooseClassify, () => {
            _GameData._Guide.MakePatternState = _GameData._Guide.MakePatternStateType.ChooseClassify;
            const x = Laya.stage.width - 53;
            const y = 270;
            this.noMoveCircle(x, y, 60);
        })

        this._evReg(_GameData._Guide.event.MakePatternPattern1, () => {
            _GameData._Guide.MakePatternState = _GameData._Guide.MakePatternStateType.Pattern1;
            const x = Laya.stage.width - 152;
            const y = 310;
            this.pattenAni(x, y, Laya.stage.width / 2, y);
            this.bgVanish();
        })

        var frameFunc = () => {
            const WConversion = this._Wireframe.getChildByName('WConversion') as Laya.Image;
            const gP = this._Wireframe.localToGlobal(new Laya.Point(WConversion.x, WConversion.y));
            this.handMove(gP.x, gP.y, () => {
                this._AniVar('Frame').play();
            })
        }

        this._AniVar('Frame').on(Laya.Event.LABEL, this, (label: string) => {
            if (label === 'com') {
                if (this._Wireframe) {
                    frameFunc();
                }
            }
        })

        this._evReg(_GameData._Guide.event.MakePatternFrame1, (Wireframe: Laya.Image) => {
            _GameData._Guide.MakePatternState = _GameData._Guide.MakePatternStateType.Frame1;
            if (Wireframe) this._Wireframe = Wireframe;
            frameFunc();
        })

        this._evReg(_GameData._Guide.event.MakePatternTurnFace, (x: number, y: number) => {
            _GameData._Guide.MakePatternState = _GameData._Guide.MakePatternStateType.TurnFace;
            this.handClear();
            this.moveCircleBg(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.MakePatternPattern2, () => {
            _GameData._Guide.MakePatternState = _GameData._Guide.MakePatternStateType.Pattern2;
            const x = Laya.stage.width - 152;
            const y = 420;
            this.pattenAni(x, y, Laya.stage.width / 2, y);
            this.bgVanish();
        })

        this._evReg(_GameData._Guide.event.MakePatternFrame2, (Wireframe: Laya.Image) => {
            _GameData._Guide.MakePatternState = _GameData._Guide.MakePatternStateType.Frame2;
            if (Wireframe) this._Wireframe = Wireframe;
            frameFunc();
        })

        this._evReg(_GameData._Guide.event.MakePatternBtnCom, (x: number, y: number) => {
            _GameData._Guide.MakePatternState = _GameData._Guide.MakePatternStateType.BtnCom;
            this.handClear();
            this.moveCircleBg(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.TweetingBtnChoosePhoto, (x: number, y: number, handX: number, handY: number) => {
            this.noMoveRoundrect(x, y, Laya.stage.width - 320 - 260, 290, 20, 500, handX, handY);
        })

        this._evReg(_GameData._Guide.event.TweetingChoosePhoto, (x: number, y: number) => {
            this.noMoveRoundrect(x, y, 260, 260, 20);
        })

        this._evReg(_GameData._Guide.event.TweetingBtnSend, (x: number, y: number) => {
            this.moveRoundrectNoBg(x, y, 220, 120, 20);
        })

        this._evReg(_GameData._Guide.event.TweetingBtnDoubleFans, (x: number, y: number) => {
            this.noMoveRoundrect(x, y, 230, 120, 20);
        })

        this._evReg(_GameData._Guide.event.RankingCloseBtn, (x: number, y: number) => {
            this.noMoveCircle(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.PersonalInfoBtn, (x: number, y: number) => {
            this.noMoveCircle(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.PersonalInfoWriteName, (x: number, y: number) => {
            this.noMoveCircle(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.PersonalInfoCloseBtn, (x: number, y: number) => {
            this.noMoveCircle(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.BtnCheckIn, (x: number, y: number) => {
            this.noMoveCircle(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.CheckInGetReward, (x: number, y: number) => {
            this.noMoveCircle(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.CheckInCloseBtn, (x: number, y: number) => {
            this.moveCircleBg(x, y, radius);
        })

        this._evReg(_GameData._Guide.event.vanishGuide, () => {
            this._AniVar('Click').stop();
            this.handVanish();
            this.bgVanish();
        })

        this._evReg(_GameData._Guide.event.closeGuide, () => {
            this._closeScene();
        })
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Hand'), this._ImgVar('Background'));
    }
    lwgOnDisable(): void {
        // Background被缓存成位图后续手动销毁
        this._ImgVar('Background').destroy();
    }
}



