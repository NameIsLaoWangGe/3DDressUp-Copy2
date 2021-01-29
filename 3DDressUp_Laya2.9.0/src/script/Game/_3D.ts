import { TimerAdmin, Tools } from "../Lwg/Lwg";
import { _CutInRes, _Res } from "./_Res";
export class _3DScene {
    private static ins: _3DScene;
    aniName = {
        Stand: 'Stand',
        Pose1: 'Pose1',
        Pose2: 'Pose2',
        DispalyCloth: 'DispalyCloth',
        Walk: 'Walk',
    }
    static _ins() {
        if (!this.ins) {
            this.ins = new _3DScene();
            this.ins._Owner = _Res._list.scene3D.MakeClothes.Scene;
            Laya.stage.addChild(this.ins._Owner);

            this.ins._Role = this.ins._Owner.getChildByName('Role') as Laya.MeshSprite3D;
            this.ins._RoleFPos = new Laya.Vector3(this.ins._Role.transform.position.x, this.ins._Role.transform.position.y, this.ins._Role.transform.position.z);

            this.ins._Root = this.ins._Role.getChildByName('Root') as Laya.MeshSprite3D;
            this.ins._DIY = this.ins._Root.getChildByName('DIY') as Laya.MeshSprite3D;
            this.ins._General = this.ins._Root.getChildByName('General') as Laya.MeshSprite3D;

            this.ins._DBottoms = this.ins._DIY.getChildByName('Bottoms') as Laya.MeshSprite3D;
            this.ins._DTop = this.ins._DIY.getChildByName('Top') as Laya.MeshSprite3D;
            this.ins._DDress = this.ins._DIY.getChildByName('Dress') as Laya.MeshSprite3D;

            this.ins._GBottoms = this.ins._General.getChildByName('Bottoms') as Laya.MeshSprite3D;
            this.ins._GTop = this.ins._General.getChildByName('Top') as Laya.MeshSprite3D;
            this.ins._GDress = this.ins._General.getChildByName('Dress') as Laya.MeshSprite3D;

            this.ins._RoleAni = this.ins._Role.getComponent(Laya.Animator) as Laya.Animator;

            this.ins._MainCamara = this.ins._Owner.getChildByName('Main Camera') as Laya.Camera;
            this.ins._MirrorCamera = this.ins._Owner.getChildByName('MirrorCamera') as Laya.Camera;
            this.ins._Mirror = this.ins._Owner.getChildByName('Mirror') as Laya.MeshSprite3D;
            this.ins._Bg1 = this.ins._Owner.getChildByName('Bg1') as Laya.MeshSprite3D;
            this.ins._bg1Mat = this.ins._Bg1.meshRenderer.material as Laya.UnlitMaterial;
            this.ins._Bg2 = this.ins._Owner.getChildByName('Bg2') as Laya.MeshSprite3D;

            this.ins._BtnDress = this.ins._Owner.getChildByName('BtnDress') as Laya.MeshSprite3D;
            this.ins._BtnTop = this.ins._Owner.getChildByName('BtnTop') as Laya.MeshSprite3D;
            this.ins._BtnBottoms = this.ins._Owner.getChildByName('BtnBottoms') as Laya.MeshSprite3D;
            this.ins._BtnDressingRoom = this.ins._Owner.getChildByName('BtnDressingRoom') as Laya.MeshSprite3D;

            this.ins._DIYHanger = this.ins._Owner.getChildByName('DIYHanger') as Laya.MeshSprite3D;


            this.ins.fillLight_Right1 = this.ins._Owner.getChildByName('fillLight_Right1') as Laya.PointLight;
            this.ins.fillLight_Right2 = this.ins._Owner.getChildByName('fillLight_Right2') as Laya.PointLight;
            this.ins.fillLight_Left1 = this.ins._Owner.getChildByName('fillLight_Left1') as Laya.PointLight;
            this.ins.fillLight_Left2 = this.ins._Owner.getChildByName('fillLight_Left2') as Laya.PointLight;
            this.ins.fillLight_Back1 = this.ins._Owner.getChildByName('fillLight_Back1') as Laya.PointLight;
            this.ins.fillLight_Bottom1 = this.ins._Owner.getChildByName('fillLight_Bottom1') as Laya.PointLight;
            this.ins.fillLight_Bottom2 = this.ins._Owner.getChildByName('fillLight_Bottom2') as Laya.PointLight;

            this.ins.fillLight_Left1.intensity = 0.15;
            this.ins.fillLight_Right1.intensity = 0.15;
            this.ins.fillLight_Bottom2.active = false;

            this.ins.fillLight_Left2.intensity = 0.4;
            this.ins.fillLight_Right2.intensity = 0.4;
        }
        return this.ins;
    }
    _Owner: Laya.Scene3D;
    _MainCamara: Laya.Camera;
    _Role: Laya.MeshSprite3D;
    _RoleFPos: Laya.Vector3;

    _RoleAni: Laya.Animator;
    _Root: Laya.MeshSprite3D;
    _DIY: Laya.MeshSprite3D;
    _DTop: Laya.MeshSprite3D;
    _DDress: Laya.MeshSprite3D;
    _DBottoms: Laya.MeshSprite3D;
    _General: Laya.MeshSprite3D;
    _GTop: Laya.MeshSprite3D;
    _GDress: Laya.MeshSprite3D;
    _GBottoms: Laya.MeshSprite3D;
    _SecondCameraTag: Laya.MeshSprite3D;
    _MirrorCamera: Laya.Camera;
    _Mirror: Laya.MeshSprite3D;
    _Bg1: Laya.MeshSprite3D;
    _bg1Mat: Laya.UnlitMaterial;
    _Bg2: Laya.MeshSprite3D;
    _BtnDress: Laya.MeshSprite3D;
    _BtnTop: Laya.MeshSprite3D;
    _BtnBottoms: Laya.MeshSprite3D;
    _BtnDressingRoom: Laya.MeshSprite3D;
    _DIYHanger: Laya.MeshSprite3D;

    fillLight_Right1: Laya.PointLight;
    fillLight_Right2: Laya.PointLight;
    fillLight_Left1: Laya.PointLight;
    fillLight_Left2: Laya.PointLight;
    fillLight_Back1: Laya.PointLight;
    fillLight_Bottom1: Laya.PointLight;
    fillLight_Bottom2: Laya.PointLight;

    playDispalyAni(): void {
        this._RoleAni.play(this.aniName.Stand);
        this._RoleAni.play(this.aniName.DispalyCloth);
        Laya.timer.clearAll(this._Role);
        TimerAdmin._once(3200, this._Role, () => {
            this._RoleAni.crossFade(this.aniName.Stand, 0.3);
        })
    }
    playPoss1Ani(): void {
        this._RoleAni.crossFade(this.aniName.Pose1, 0.3);
        Laya.timer.clearAll(this._Role);
        TimerAdmin._once(3200, this._Role, () => {
            this._RoleAni.crossFade(this.aniName.Stand, 0.3);
        })
    }

    playPoss2Ani(): void {
        this._RoleAni.crossFade(this.aniName.Pose2, 0.3);
        Laya.timer.clearAll(this._Role);
        TimerAdmin._once(3200, this._Role, () => {
            this._RoleAni.crossFade(this.aniName.Stand, 0.3);
        })
    }

    playStandAni(): void {
        Laya.timer.clearAll(this);
        Laya.timer.clearAll(this._Role);
        this._RoleAni.crossFade(this.aniName.Stand, 0.3);
    }

    playRandomPose(): void {
        TimerAdmin._frameLoop(500, this, () => {
            Tools._Number.randomOneHalf() == 0 ? _3DScene._ins().playPoss1Ani() : _3DScene._ins().playPoss2Ani();
        }, true);
    }

    get btnDressPos(): Laya.Vector2 {
        return Tools._3D.posToScreen(this._BtnDress.transform.position, this._MainCamara);
    }
    get btnTopPos(): Laya.Vector2 {
        return Tools._3D.posToScreen(this._BtnTop.transform.position, this._MainCamara);
    }
    get btnBottomsPos(): Laya.Vector2 {
        return Tools._3D.posToScreen(this._BtnBottoms.transform.position, this._MainCamara);
    }
    get btnDressingRoomPos(): Laya.Vector2 {
        return Tools._3D.posToScreen(this._BtnDressingRoom.transform.position, this._MainCamara);
    }

    /**将3D场景绘制到2D屏幕上*/
    cameraToSprite(scene: Laya.Scene): Laya.Sprite {
        _3DScene._ins().mirrorSurface = false;
        const Sp = new Laya.Sprite;
        Sp.zOrder = -1;
        scene.addChild(Sp)['size'](Laya.stage.width, Laya.stage.height);
        Tools._Draw.cameraToSprite(this._MainCamara, Sp);
        return Sp;
    }

    openStartAni(func: Function): void {
        func();
        this.playRandomPose();
        this._DIYHanger.active = false;
        this._Role.active = true;
        this._MirrorCamera.active = false;
        // this._RoleAni.play(this.aniName.Walk);
        // const dis = Tools._Number.randomOneHalf() == 0 ? - 3 : 3;
        // const time = 180;
        // const rotate = dis == 3 ? 90 : -90;
        // this._Role.transform.position = new Laya.Vector3(this._RoleFPos.x + dis, this._RoleFPos.y, this._RoleFPos.z);
        // this._Role.transform.localRotationEuler = new Laya.Vector3(0, this._Role.transform.localRotationEuler.y + rotate, 0);

        // this._Role.transform.localRotationEuler = new Laya.Vector3(-10, this._Role.transform.localRotationEuler.y, 0);

        // const CaRotate = Tools._Number.randomOneHalf() == 0 ? - 5 : 5;
        // this._MainCamara.transform.localRotationEuler.x += CaRotate;
        // TimerAdmin._frameNumLoop(1, time, this, () => {

        //     this._MainCamara.transform.localRotationEuler = new Laya.Vector3(this._MainCamara.transform.localRotationEuler.x - CaRotate / time, this._MainCamara.transform.localRotationEuler.y, this._MainCamara.transform.localRotationEuler.z);

        //     this._Role.transform.localRotationEuler = new Laya.Vector3(this._Role.transform.localRotationEuler.x + 10 / time, this._Role.transform.localRotationEuler.y, 0);

        //     this._Role.transform.position = new Laya.Vector3(this._Role.transform.position.x - dis / time, this._Role.transform.position.y, this._Role.transform.position.z);
        // })
        // TimerAdmin._frameOnce(time - 45, this, () => {
        //     TimerAdmin._frameNumLoop(1, 45, this, () => {
        //         const speed = rotate > 0 ? 2 : -2;
        //         this._Role.transform.localRotationEuler = new Laya.Vector3(this._Role.transform.localRotationEuler.x, this._Role.transform.localRotationEuler.y -= speed, 0);
        //     }, () => {
        //         Tools._Number.randomOneHalf() == 0 ? this._RoleAni.crossFade(this.aniName.Pose1, 0.3) :
        //             this._RoleAni.crossFade(this.aniName.Pose2, 0.1);
        //         TimerAdmin._once(3000, this, () => {
        //             this._RoleAni.crossFade(this.aniName.Stand, 0.1);
        //             func();
        //             this.playRandomPose();
        //         })
        //     })
        // })
    }
    intoStart(whereFrom?: string): void {
        this.playStandAni();
        this._Owner.active = true;
        this._DIYHanger.active = false;
        this.fillLight_Left1.active = false;
        this.fillLight_Right1.active = false;
        this._MirrorCamera.active = false;
        if (whereFrom == 'preload') {
            this._bg1Mat.albedoTexture = _Res._list.texture2D.bgStart.texture2D;
        } else {
            this._bg1Mat.albedoTexture = _CutInRes.Start.texture2D.bgStart.texture2D;
        }
    }
    intogeDressingRoom(): void {
        _3DScene._ins().playStandAni();
        this._MirrorCamera.active = true;
        this._bg1Mat.albedoTexture = _CutInRes.DressingRoom.texture2D.bgDressingRoom.texture2D;
    }
    /**镜子的渲染的开关*/
    get mirrorSurface(): boolean {
        return this['_mirrorSurface'];
    };
    set mirrorSurface(bool: boolean) {
        this['_mirrorSurface'] = bool;
    }

    /**2D图片有遮罩的时候无法实时渲染，需要每帧渲染，所以需要手动清理前一帧的贴图，必须是可查找变量，否则无法手动回收*/
    mirrortex: Laya.Texture;
    openMirror(_Sp: Laya.Image): void {
        this.mirrorSurface = true;
        TimerAdmin._clearAll([this._Mirror]);
        TimerAdmin._frameLoop(1, this._Mirror, () => {
            if (this.mirrorSurface) {
                //选择渲染目标为纹理
                this._MirrorCamera.renderTarget = new Laya.RenderTexture(_Sp.width, _Sp.height);
                //渲染顺序
                this._MirrorCamera.renderingOrder = -1;
                //清除标记
                this._MirrorCamera.clearFlag = Laya.CameraClearFlags.Sky;
                // 频繁更换需要删除
                this.mirrortex && this.mirrortex.destroy();
                this.mirrortex = new Laya.Texture(((<Laya.Texture2D>(this._MirrorCamera.renderTarget as any))), Laya.Texture.DEF_UV);
                //设置网格精灵的纹理
                _Sp.graphics.drawTexture(this.mirrortex);
            }
        })
    }
    closeMirror(): void {
        this.mirrorSurface = false;
    }

    intoMakePattern(): void {
        this._Owner.active = true;
        this.fillLight_Left1.active = true;
        this.fillLight_Right1.active = true;
        this._bg1Mat.albedoTexture = _CutInRes.MakePattern.texture2D.bgMakePattern.texture2D;
    }
    intoMakeTailor(): void {
        _3DScene._ins()._Owner.active = false;
    }
    photoBg(): void {
        this._bg1Mat.albedoTexture = _CutInRes.MakePattern.texture2D.bgPhoto.texture2D;
    }

    displayDress(): void {
        this._GBottoms.active = this._GTop.active = this._DBottoms.active = this._DTop.active = false;
    }
    displayTopAndBotton(): void {
        this._GDress.active = this._DDress.active = false;
    }
}
export class _3DDIYCloth {
    private static ins: _3DDIYCloth;
    static _ins() {
        if (!this.ins) {
            this.ins = new _3DDIYCloth();
        }
        return this.ins;
    }
    constructor() {
    }
    name: string;
    Present: Laya.MeshSprite3D;
    Front: Laya.MeshSprite3D;
    frontMat: Laya.BlinnPhongMaterial;
    Reverse: Laya.MeshSprite3D;
    reverseMat: Laya.BlinnPhongMaterial;
    ModelTap: Laya.MeshSprite3D;//触摸模型
    hanger: Laya.MeshSprite3D;//衣服模架
    texHeight: number;//操作贴图的高度也是模型在屏幕上映射的高度
    remake(classify: string, pitchName: string): void {
        this.name = pitchName;
        _3DScene._ins()._DIYHanger.active = true;
        _3DScene._ins()._Role.active = false;

        const Classify = _3DScene._ins()._DIYHanger.getChildByName(classify) as Laya.MeshSprite3D;
        Tools._Node.showExcludedChild3D(_3DScene._ins()._DIYHanger, [Classify.name]);

        this.Present = Classify.getChildByName(pitchName) as Laya.MeshSprite3D;
        Tools._Node.showExcludedChild3D(Classify, [this.Present.name]);

        this.Present.transform.localRotationEulerY = 180;

        this.Front = this.Present.getChildByName(`${this.Present.name}_0`) as Laya.MeshSprite3D;
        this.frontMat = this.Front.meshRenderer.material as Laya.BlinnPhongMaterial;

        this.Reverse = this.Present.getChildByName(`${this.Present.name}_1`) as Laya.MeshSprite3D;
        this.reverseMat = this.Reverse.meshRenderer.material as Laya.BlinnPhongMaterial;

        this.ModelTap = this.Present.getChildByName('ModelTap') as Laya.MeshSprite3D;
        this.ModelTap.transform.position = new Laya.Vector3(this.Present.transform.position.x, this.ModelTap.transform.position.y, this.Present.transform.position.z);

        this.hanger = this.Present.getChildByName('hanger') as Laya.MeshSprite3D;
        this.hanger.active = true;

        let center = this.Front.meshRenderer.bounds.getCenter();
        let extent = this.Front.meshRenderer.bounds.getExtent();

        //映射贴图图片宽高
        let p1 = new Laya.Vector3(center.x, center.y + extent.y, center.z);
        let p2 = new Laya.Vector3(center.x, center.y - extent.y, center.z);
        let point1 = Tools._3D.posToScreen(p1, _3DScene._ins()._MainCamara);
        let point2 = Tools._3D.posToScreen(p2, _3DScene._ins()._MainCamara);
        this.texHeight = point2.y - point1.y;
    }
    addTexture2D(arr: any[]): void {
        this.frontMat.albedoTexture && this.frontMat.albedoTexture.destroy();
        this.frontMat.albedoTexture = arr[0];
        this.reverseMat.albedoTexture && this.reverseMat.albedoTexture.destroy();
        this.reverseMat.albedoTexture = arr[1];
    }
    /**方向*/
    rotate(num: number): void {
        if (num == 1) {
            this.Present.transform.localRotationEulerY++;
        } else {
            this.Present.transform.localRotationEulerY--;
        }
    }
}
