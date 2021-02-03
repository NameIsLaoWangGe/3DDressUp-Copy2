import ADManager, { TaT } from "../../TJ/Admanager";
import { LwgScene, LwgAni2D, LwgClick, LwgTools, LwgPlatform, LwgTimer } from "../Lwg/Lwg";
import { _3DScene } from "./_3D";
import { _BackHint, _Guide, _PreLoadCutIn } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _Res } from "./_Res";
import { _SceneName } from "./_SceneName";

/**通用UI*/
export class _UI {
    constructor(_Scene: Laya.Scene) {
        if (!_Scene) {
            return;
        }
        this.Scene = _Scene;
        this.Operation = _Scene['Operation'];

        this.BtnAgain = LwgTools._Node.createPrefab(_Res._list.prefab2D.BtnAgain.prefab, _Scene, [200, 79]) as Laya.Image;
        LwgClick._on(LwgClick._Use.value, this.BtnAgain, this, null, null, () => {
            ADManager.TAPoint(TaT.BtnShow, 'next_lose');
            this.btnAgainClick && this.btnAgainClick();
        })

        this.BtnComplete = _Scene['BtnComplete'];
        LwgClick._on(LwgClick._Use.value, this.BtnComplete, this, null, null, (e: Laya.Event) => {
            e.stopPropagation();
            this.btnCompleteClick && this.btnCompleteClick();
        })

        this.BtnBack = LwgTools._Node.createPrefab(_Res._list.prefab2D.BtnBack.prefab, _Scene, [77, 79]) as Laya.Image;
        LwgClick._on(LwgClick._Use.value, this.BtnBack, this, null, null, () => {
            if (!_Guide._complete) return;

            if (_3DScene._ins()._Owner.active) {
                _BackHint._3dToSp = _3DScene._ins().cameraToSprite(this.Scene);
            }
            ADManager.TAPoint(TaT.BtnShow, 'back_main');
            if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
                _BackHint._whereScene = this.Scene;
                LwgScene._openScene(_SceneName.BackHint);
            } else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                _PreLoadCutIn._fromBack = true;
                LwgTimer._frameOnce(10,this,()=>{
                    this.Scene[this.Scene.name]._openScene(_SceneName.Start, true, true);
                })
            }
        })

        this.BtnRollback = LwgTools._Node.createPrefab(_Res._list.prefab2D.BtnRollback.prefab, _Scene, [200, 79]) as Laya.Image;
        LwgClick._on(LwgClick._Use.value, this.BtnRollback, this, null, null, () => {
            if (!_Guide._complete) return;
            this.btnRollbackClick && this.btnRollbackClick();
        })

        this.Operation.pos(Laya.stage.width + 500, 20);
        this.BtnComplete.scale(0, 0);
        this.BtnBack.scale(0, 0);
        this.BtnAgain.scale(0, 0);
        this.BtnRollback.scale(0, 0);
        ADManager.TAPoint(TaT.BtnShow, 'back_main');
        ADManager.TAPoint(TaT.BtnShow, 'next_lose');
        this.BtnTurnFace = this.Scene['BtnTurnFace'];
        if (this.BtnTurnFace) {
            ADManager.TAPoint(TaT.BtnShow, 'Amian');
            ADManager.TAPoint(TaT.BtnShow, 'Bmian');
            this.BtnTurnFace.scale(0, 0);
        }

        this.BtnRollback.zOrder = this.BtnAgain.zOrder = this.BtnBack.zOrder = this.BtnComplete.zOrder = this.Operation.zOrder = 45;

        this.moveTargetX = Laya.stage.width - this.Operation.width + 50;
    }

    btnAgainClick: Function;
    btnCompleteClick: Function;
    btnRollbackClick: Function;

    Scene: Laya.Scene;
    Operation: Laya.Image;
    BtnRollback: Laya.Image;
    BtnAgain: Laya.Image;
    BtnBack: Laya.Image;
    BtnComplete: Laya.Image;
    BtnTurnFace: Laya.Image;

    time: number = 100;
    delay: number = 100;
    scale: number = 1.4;
    moveTargetX: number;

    btnRollbackAppear(func?: Function, delay?: number): void {
        LwgAni2D.bombs_Appear(this.BtnRollback, 0, 1, this.scale, 0, this.time * 2, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnRollbackVinish(func?: Function, delay?: number): void {
        LwgAni2D.bombs_Vanish(this.BtnRollback, 0, 0, 0, this.time * 4, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnAgainAppear(func?: Function, delay?: number): void {
        LwgAni2D.bombs_Appear(this.BtnAgain, 0, 1, this.scale, 0, this.time * 2, () => {
            func && func();
        }, delay ? delay : 0);
    };

    btnAgainVinish(func?: Function, delay?: number): void {
        LwgAni2D.bombs_Vanish(this.BtnAgain, 0, 0, 0, this.time * 4, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnBackAppear(func?: Function, delay?: number): void {
        LwgAni2D.bombs_Appear(this.BtnBack, 0, 1, this.scale, 0, this.time * 2, () => {
            func && func();
        }, delay ? delay : 0);
    };
    btnBackVinish(func?: Function, delay?: number): void {
        LwgAni2D.bombs_Vanish(this.BtnBack, 0, 0, 0, this.time * 4, () => {
            func && func();
        }, delay ? delay : 0);
    };

    btnCompleteAppear(func?: Function, delay?: number): void {
        _GameEffects2D._circleExplode(this.Operation, new Laya.Point(this.BtnComplete.x, this.BtnComplete.y), delay);
        LwgAni2D.bombs_Appear(this.BtnComplete, 0, 1, this.scale, 0, this.time * 2, () => {
            func && func();
        }, delay ? delay : 0);
    }
    btnCompleteVinish(func?: Function, delay?: number): void {
        LwgAni2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
            func && func();
        }, delay ? delay : 0);
    };

    btnTurnFaceAppear(func?: Function, delay?: number): void {
        if (this.BtnTurnFace) {
            _GameEffects2D._circleExplode(this.Operation, new Laya.Point(this.BtnTurnFace.x, this.BtnTurnFace.y), delay);
            LwgAni2D.bombs_Appear(this.BtnTurnFace, 0, 1, this.scale, 0, this.time * 2, () => {
                func && func();
            });
        }
    }

    btnTurnFaceVinish(func?: Function, delay?: number): void {
        if (this.BtnTurnFace) {
            LwgAni2D.bombs_Vanish(this.BtnTurnFace, 0, 0, 0, this.time * 4, () => {
                func && func();
            }, delay ? delay : 0);
        }
    }

    operationAppear(func?: Function, delay?: number): void {
        if (this.Scene.name === 'MakeTailor') {
            LwgAni2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 1, 500);
        }
        LwgAni2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time * 4, () => {
            LwgAni2D.move(this.Operation, this.moveTargetX, this.Operation.y, this.time, () => {
                func && func();
            })
        }, delay ? delay : 0)
    };
    operationVinish(func?: Function, delay?: number): void {
        if (this.Scene.name === 'MakeTailor') {
            LwgAni2D.fadeOut(this.Scene['BG2'], this.Scene['BG2'].alpha, 0, 500);
        }
        LwgAni2D.bombs_Vanish(this.BtnComplete, 0, 0, 0, this.time * 4, () => {
            LwgAni2D.move(this.Operation, this.moveTargetX - 40, this.Operation.y, this.time, () => {
                LwgAni2D.move(this.Operation, Laya.stage.width + 500, this.Operation.y, this.time * 4, () => {
                    func && func();
                });
            });
        }, delay ? delay : 0)
    }

}