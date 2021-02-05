import Lwg, { LwgData, LwgDate, LwgPlatform, LwgScene, LwgStorage, LwgTimer, LwgTools } from "../Lwg/Lwg";
import { _3DScene, _3DDIYCloth } from "./_3D";
import { _Res } from "./_Res";
import { _SceneName } from "./_SceneName";

export module _Ranking {
    export class _mergePro extends Lwg.DataAdmin._BaseProperty {
        rankNum: any = 'rankNum';
        fansNum: any = 'fansNum';
        iconSkin: any = 'iconSkin';
    }
    /**从哪个界面进来*/
    export let _whereFrom = _SceneName.Start;
    export class _Data extends LwgData._Table {
        private static ins: _Data;
        static _ins() {
            if (!this.ins) {
                this.ins = new _Data('RankingData', _Res._ins().$json.Ranking.dataArr, true);
                this.ins._mergePro = new _mergePro();
                if (!this.ins._arr[0]['iconSkin']) {
                    for (let index = 0; index < this.ins._arr.length; index++) {
                        const element = this.ins._arr[index];
                        element['iconSkin'] = `Game/UI/Ranking/IconSkin/avatar_${element[this.ins._property.serial]}.png`;
                    }
                }
                this.ins._pitchName = '玩家';
                this.ins._sortByProperty(this.ins._mergePro.fansNum, this.ins._mergePro.rankNum);
            }
            return this.ins;
        }
        _classify = {
            other: 'other',
            self: 'self',
        }
    }
}
export module _Guide {
    export enum Event {
        closeGuide = 'Guide' + 'closeGuide',
        vanishGuide = 'Guide' + 'vanishGuide',

        StartBtnDress = 'Guide' + 'StartBtnDress',

        MakeTailorPulldown = 'Guide' + 'MakeTailorPulldown',
        MakeTailorChangeCloth = 'Guide' + 'MakeTailorChangeCloth',
        MakeTailorBtnCom = 'Guide' + 'MakeTailorBtnCom',
        MakeTailorStartTailor = 'Guide' + 'MakeTailorStartTailor',
        MakeTailorNewTailor = 'Guide' + 'MakeTailorNewTailor',
        MakeTailorCloseTailor = 'Guide' + 'MakeTailorCloseTailor',
        MakeTailorOpenTailor = 'Guide' + 'MakeTailorOpenTailor',

        MakePatternChooseClassify = 'Guide' + 'MakePatternChooseClassify',
        MakePatternPattern1 = 'Guide' + 'MakePatternPattern1',
        MakePatternFrame1 = 'Guide' + 'MakePatternFrame1',
        MakePatternTurnFace = 'Guide' + 'MakePatternTurnFace',
        MakePatternFrame2 = 'Guide' + 'MakePatternFrame2',
        MakePatternPattern2 = 'Guide' + 'MakePatternPattern2',
        MakePatternBtnCom = 'Guide' + 'MakePatternBtnCom',

        TweetingBtnChoosePhoto = 'Guide' + 'TweetingBtnChoosePhoto',
        TweetingChoosePhoto = 'Guide' + 'TweetingChoosePhoto',
        TweetingBtnSend = 'Guide' + 'TweetingBtnSend',
        TweetingBtnDoubleFans = 'Guide' + 'TweetingBtnDoubleFans',

        RankingCloseBtn = 'Guide' + 'RankingCloseBtn',

        PersonalInfoBtn = 'Guide' + 'PersonalInfoBtn',
        PersonalInfoWriteName = 'Guide' + 'PersonalInfoWriteName',
        PersonalInfoCloseBtn = 'Guide' + 'PersonalInfoCloseBtn',

        DelayBtnCheckIn = 'Start' + 'DelayBtnCheckIn',
        BtnCheckIn = 'Guide' + 'BtnCheckIn',
        CheckInGetReward = 'Guide' + 'CheckInGetReward',
        CheckInCloseBtn = 'Guide' + 'CheckInBtnClose',

        StartOtherBtnClick = 'Guide' + 'StartOtherBtnClick',
    }
    /**引导是否完成*/
    export let _complete = {
        get value(): boolean {
            return LwgStorage._bool('_Guide_complete').value;
        },
        set value(val: boolean) {
            LwgStorage._bool('_Guide_complete').value = val;
        }
    }
    export let MmakeTailorPulldownSwicth: boolean = false;
    export let MmakeTailorBtnComSwicth: boolean = false;

    export let MakePatternState = 'ChooseClassify';
    export let MakePatternStateType = {
        ChooseClassify: `ChooseClassify`,
        Pattern1: 'Pattern1',
        Frame1: 'Frame1',
        TurnFace: 'TurnFace',
        Frame2: 'Frame2',
        Pattern2: 'Pattern2',
        BtnCom: 'BtnCom',
        closeGuide: 'closeGuide',
    }

    export let CheckInCloseBtn = false;
}
export module _PersonalInfo {
    export let _name = {
        get value(): string {
            return LwgStorage._str('playerName', null, 'You').value;
        },
        set value(str: string) {
            LwgStorage._str('playerName').value = str;
        }
    }
}
export module _BackHint {
    export let _3dToSp: Laya.Sprite;
    export let _whereScene: Laya.Scene;
}
export module _PreLoadCutIn {
    /**是不是从返回按钮中进来的，返回按钮中进来回主界面不会换装*/
    export let _fromBack = false;
}
export module _Start {
    export let _whereFrom: string;
    export enum Event {
        photo = 'Start' + 'photo',
        updateRanking = 'Start' + 'updateRanking',
        BtnPersonalInfo = 'Start' + 'BtnPersonalInfo',
    }
}

export class _mergeProAllClothes extends Lwg.DataAdmin._BaseProperty {
    icon: any = 'icon';
    putOn: any = 'putOn';
    part: any = 'part';
}
/**服装总数据*/
export class _AllClothes extends LwgData._Table {
    private static ins: _AllClothes;
    static _ins() {
        if (!this.ins) {
            this.ins = new _AllClothes('ClothesGeneral', _Res._ins().$json.GeneralClothes.dataArr, true);
            this.ins._mergePro = new _mergeProAllClothes();
            if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                this.ins._deleteObjByName('ads');
            }
        }
        return this.ins;
    }
    _classify = {
        DIY: 'DIY',
        General: 'General',
    };
    /**部位*/
    _part = {
        Dress: 'Dress',
        Top: 'Top',
        Bottoms: 'Bottoms',
        FaceMask: 'FaceMask',
        Accessories: 'Accessories',
        Shoes: 'Shoes',
        Hair: 'Hair',
    }
    getDIYTexBasicUrl(clothesName: string): string {
        return `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/DIYTexbasic/${clothesName.substr(0, clothesName.length - 5)}basic.png`;
    }
    getGeneralIcon(clothesName: string): string {
        return `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Icon/General/${clothesName}.png`;
    };
    /**
     *将DIY服装汇总进去
     * */
    collectDIY(): any[] {
        let DIYArr = _DIYClothes._ins()._getArrByNoProperty(_DIYClothes._ins()._otherPro.icon, "");
        const copyArr = LwgTools._ObjArray.arrCopy(DIYArr);
        // 将类型修改为'DIY'
        LwgTools._ObjArray.modifyProValue(copyArr, this._property.classify, 'DIY');
        this._addObjectArr(copyArr);
        return copyArr;
    }

    /**
     * 当前服装制作完毕后的换装
     */
    changeAfterMaking(): void {
        this.collectDIY();
        this.accurateChange(_DIYClothes._ins()._getPitchProperty('part'), _DIYClothes._ins()._pitchName);
    }

    private changeClass(classify: string, partArr: Array<any>, playAni?: boolean, start?: boolean): void {
        const _classify = _3DScene._ins()._Root.getChildByName(classify) as Laya.MeshSprite3D;
        for (let i = 0; i < _classify.numChildren; i++) {
            const _classifySp = _classify.getChildAt(i) as Laya.MeshSprite3D;
            _classifySp.active = false;
            for (let j = 0; j < partArr.length; j++) {
                const obj = partArr[j];
                if (obj[this._mergePro.part] === _classifySp.name) {
                    _classifySp.active = true;
                    for (let k = 0; k < _classifySp.numChildren; k++) {
                        const cloth = _classifySp.getChildAt(k) as Laya.SkinnedMeshSprite3D;
                        if (cloth.name === obj[this._property.name]) {
                            cloth.active = true;
                            const delay = start ? 40 : 15;
                            if (classify === 'DIY') {
                                const url = this.getDIYTexBasicUrl(cloth.name);
                                const fSp = new Laya.Sprite;
                                fSp.visible = false;
                                Laya.stage.addChild(fSp);
                                fSp.zOrder = 1000;
                                fSp.size(512, 512);
                                fSp.scale(1, -1);
                                fSp.pos(0, 512);
                                const FImg = new Laya.Image;
                                FImg.skin = url;
                                fSp.addChild(FImg);
                                FImg.size(512, 512);
                                FImg.pos(0, 0);
                                const ftexData = LwgStorage._array(`${cloth.name}/${_DIYClothes._ins()._otherPro.texF}`).value;
                                for (let index = 0; index < ftexData.length; index++) {
                                    const data = ftexData[index];
                                    const Img = new Laya.Image;
                                    fSp.addChild(Img);
                                    Img.skin = `Pattern/${data['name']}.png`;
                                    Img.x = data['x'];
                                    Img.y = data['y'];
                                    Img.anchorX = data['anchorX'];
                                    Img.anchorY = data['anchorY'];
                                    Img.width = data['width'];
                                    Img.height = data['height'];
                                    Img.height = data['height'];
                                    Img.rotation = data['rotation'];
                                    Img.zOrder = data['zOrder'];
                                }
                                const front = cloth.getChildByName(`${cloth.name}_0`) as Laya.SkinnedMeshSprite3D;
                                const matF = front.skinnedMeshRenderer.material as Laya.BlinnPhongMaterial;
                                // 稍加延迟，需要加载
                                LwgTimer._frameOnce(delay, this, () => {
                                    matF.albedoTexture && matF.albedoTexture.destroy();
                                    matF.albedoTexture = fSp.drawToTexture(fSp.width, fSp.height, fSp.x, fSp.y + fSp.height) as Laya.RenderTexture2D;
                                    fSp.removeSelf();
                                })

                                const rSp = new Laya.Sprite;
                                rSp.visible = false;
                                Laya.stage.addChild(rSp);
                                rSp.zOrder = 1000;
                                rSp.size(512, 512);
                                rSp.scale(1, -1);
                                const RImg = new Laya.Image;
                                RImg.skin = url;
                                rSp.addChild(RImg);
                                RImg.size(512, 512);
                                rSp.pos(512, 0);
                                const rtexData = LwgStorage._array(`${cloth.name}/${_DIYClothes._ins()._otherPro.texR}`).value;
                                for (let index = 0; index < rtexData.length; index++) {
                                    const data = rtexData[index];
                                    const Img = new Laya.Image;
                                    rSp.addChild(Img);
                                    Img.skin = `Pattern/${data['name']}.png`;
                                    Img.x = data['x'];
                                    Img.y = data['y'];
                                    Img.anchorX = data['anchorX'];
                                    Img.anchorY = data['anchorY'];
                                    Img.width = data['width'];
                                    Img.height = data['height'];
                                    Img.height = data['height'];
                                    Img.rotation = data['rotation'];
                                    Img.zOrder = data['zOrder'];
                                }
                                const reverse = cloth.getChildByName(`${cloth.name}_1`) as Laya.SkinnedMeshSprite3D;
                                const matR = reverse.skinnedMeshRenderer.material as Laya.BlinnPhongMaterial;
                                LwgTimer._frameOnce(delay, this, () => {
                                    matR.albedoTexture && matR.albedoTexture.destroy();
                                    matR.albedoTexture = rSp.drawToTexture(rSp.width, rSp.height, rSp.x, rSp.y + rSp.height) as Laya.RenderTexture2D;
                                    rSp.removeSelf();
                                })
                            }
                        } else {
                            cloth.active = false;
                        }
                    }
                }
            }
        }
        playAni && _3DScene._ins().playDispalyAni();
    }
    changeClothStart(): void {
        this.collectDIY();
        const arr = this._getArrByProperty(this._mergePro.putOn, true);
        this.changeClass(this._classify.DIY, arr, false, true);
        this.changeClass(this._classify.General, arr, false, true);
        this.startSpecialSet();
    }
    /**换装规则*/
    changeCloth(): void {
        const arr = this._getArrByProperty(this._mergePro.putOn, true);
        this.changeClass(this._classify.DIY, arr, true);
        this.changeClass(this._classify.General, arr, true);
    }

    /**进游戏时的特殊设置*/
    private startSpecialSet(): void {
        if (LwgStorage._bool('DressState').value) {
            _3DScene._ins()._GBottoms.active = _3DScene._ins()._GTop.active = _3DScene._ins()._DBottoms.active = _3DScene._ins()._DTop.active = false;
        } else {
            _3DScene._ins()._GDress.active = _3DScene._ins()._DDress.active = false;
        }
    }

    /**特殊设置*/
    specialSet(part?: string): void {
        if (part === this._part.Dress) {
            LwgStorage._bool('DressState').value = true;
        } else if (part === this._part.Top || part === this._part.Bottoms) {
            LwgStorage._bool('DressState').value = false;
        }
        if (LwgStorage._bool('DressState').value) {
            _3DScene._ins().displayDress();
        } else {
            _3DScene._ins().displayTopAndBotton();
        }
    }

    /**
     * 精确换装
     * @param {*} partValue 部位
     * @param {string} name 名称
     * @memberof  _AllClothes
     */
    accurateChange(partValue: any, name: string): void {
        const arr = _AllClothes._ins()._getArrByProperty('part', partValue);
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (name === element['name']) {
                element['putOn'] = true;
            } else {
                element['putOn'] = false;
            }
        }
        _DIYClothes._ins()._setProperty(_DIYClothes._ins()._pitchName, 'putOn', true);
        _AllClothes._ins().changeCloth();
        _AllClothes._ins().specialSet(partValue);
        _AllClothes._ins()._refreshAndStorage();
    }
}
/**DIY服装总数据*/
export class _DIYClothes extends LwgData._Table {
    private static ins: _DIYClothes;
    static _ins() {
        if (!this.ins) {
            this.ins = new _DIYClothes('DIYClothes', _Res._ins().$json.DIYClothes.dataArr, true);
            if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                this.ins._deleteObjByName('ads');
            }
        }
        return this.ins;
    };
    _classify = {
        Dress: 'Dress',
        Top: 'Top',
        Bottoms: 'Bottoms',
        ads: 'ads',
    };
    _otherPro = {
        color: 'color',
        icon: 'icon',
        diffX: 'diffX',
        diffY: 'diffY',
        texR: 'texR',
        texF: 'texF',
    };
    /**获取基本3d贴图样式*/
    getPitchTexBasicUrl(): string {
        return `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/DIYTexbasic/${this._pitchName.substr(0, this._pitchName.length - 5)}basic.png`;
    }

    /**获取图片地址*/
    getDIYCutIcon(name: string): string {
        return `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Icon/DIY/${name.substr(0, name.length - 5)}cut.png`;
    }

    /**获取裁剪碎片的颜色*/
    getColor(): Array<any> {
        let obj = this._getPitchObj();
        return [obj[`${this._otherPro.color}1`], obj[`${this._otherPro.color}2`]];
    }

    ClothesArr: Array<Laya.Sprite>;
    /**当前选中的类别中所有的服装*/
    getClothesArr(): Array<any> {
        if (!this.ClothesArr) {
            this.ClothesArr = [];
            const dataArr = _DIYClothes._ins()._arr;
            for (let index = 0; index < dataArr.length; index++) {
                if (`${dataArr[index]['name']}` !== 'ads') {
                    let CloBox = this.createClothes(`${dataArr[index]['name']}`);
                    this.ClothesArr.push(CloBox);
                } else {
                    // this.ClothesArr.push(CloBox);
                }
            }
        }
        return this.ClothesArr;
    }
    /**创建一件衣服*/
    createClothes(name: string, Scene?: Laya.Scene): Laya.Sprite {
        const Cloth = LwgTools._Node.createPrefab(_Res._ins().$prefab2D[name]['prefab']);
        // 增加一个和舞台一样大小的父节点方便移动
        const CloBox = new Laya.Sprite;
        CloBox.width = Laya.stage.width;
        CloBox.height = Laya.stage.height;
        CloBox.pivotX = CloBox.width / 2;
        CloBox.pivotY = CloBox.height / 2;
        CloBox.x = Laya.stage.width / 2;
        CloBox.y = Laya.stage.height / 2;
        CloBox.addChild(Cloth);
        CloBox.name = name;
        if (Scene) {
            Scene.addChild(CloBox);
            CloBox.zOrder = 20;
        }
        return CloBox;
    }
}
export module _MakeTailor {
    export enum Event {
        scissorTrigger = '_MakeTailor_scissorTrigger',
        completeEffcet = '_MakeTailor_completeAni',
        changeClothes = '_MakeTailor_changeClothes',
        scissorAppear = '_MakeTailor_scissorAppear',
        scissorPlay = '_MakeTailor_scissorPlay',
        scissorStop = '_MakeTailor_scissorStop',
        scissorRotation = '_MakeTailor_scissorRotation',
        scissorAgain = '_MakeTailor_scissorSitu',
        scissorRemove = '_MakeTailor_scissorRemove',
    }
}
export module _MakePattern {
    export enum Event {
        close = '_MakePattern/close',
        createImg = '_MakePattern/createImg',
        byteDanceBackStart = '_MakePattern/byteDanceBackStart',
    }
    export class _Pattern extends LwgData._Table {
        private static ins: _Pattern;
        static _ins(): _Pattern {
            if (!this.ins) {
                this.ins = new _Pattern('_Pattern', _Res._ins().$json.MakePattern.dataArr, true);
                this.ins._pitchClassify = this.ins._classify.newYear;
                if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
                    this.ins._deleteObjByName('ads');
                }
                //空位置用于站位 
                this.ins.newYearArr = this.ins._getArrByClassify(this.ins._classify.newYear);
                this.ins.newYearArr.push({}, {});

                this.ins.basicArr = this.ins._getArrByClassify(this.ins._classify.basic);
                this.ins.basicArr.push({}, {});

                this.ins.catArr = this.ins._getArrByClassify(this.ins._classify.cat);
                this.ins.catArr.push({}, {});

                this.ins.pinkArr = this.ins._getArrByClassify(this.ins._classify.pink);
                this.ins.pinkArr.push({}, {});

                this.ins.expressionArr = this.ins._getArrByClassify(this.ins._classify.expression);
                this.ins.expressionArr.push({}, {});
            }
            return this.ins;
        }
        newYearArr: any[];
        catArr: any[];
        pinkArr: any[];
        basicArr: any[];
        expressionArr: any[];
        _classify = {
            newYear: 'newYear',
            basic: 'basic',
            cat: 'cat',
            pink: 'pink',
            expression: 'expression',
        }
    }
    /**贴图位置偏移*/
    export class _PatternDiff extends LwgData._Table {
        private static ins: _PatternDiff;
        static _ins(): _PatternDiff {
            if (!this.ins) {
                this.ins = new _PatternDiff('_DIYClothesDiff', _Res._ins().$json.DIYClothesDiff.dataArr, false);
            }
            return this.ins;
        }
        _otherPro = {
            fDiffX: 'fDiffX',
            fDiffY: 'fDiffY',
            rDiffX: 'rDiffX',
            rDiffY: 'rDiffY',
        }
        get fDiffX(): number {
            return _PatternDiff._ins()._getProperty(_3DDIYCloth._ins().name, 'fDiffX');
        };
        get fDiffY(): number {
            return _PatternDiff._ins()._getProperty(_3DDIYCloth._ins().name, 'fDiffY');
        };

        get rDiffX(): number {
            return _PatternDiff._ins()._getProperty(_3DDIYCloth._ins().name, 'rDiffX');
        };
        get rDiffY(): number {
            return _PatternDiff._ins()._getProperty(_3DDIYCloth._ins().name, 'rDiffY');
        };
    }
}
export module _DressingRoom {
    export enum Event {
        byteDanceBackStart = '_DressingRoom/byteDanceBackStart',
    }
}
export module _Tweeting {
    /**过程中的照相*/
    export let _photo = {
        arr: [] as Laya.Texture[],
        take: (Scene: Laya.Scene, index: number) => {
            _Tweeting._photo.arr[index] && _Tweeting._photo.arr[index].destroy();
            _Tweeting._photo.arr[index] = Scene.drawToTexture(Laya.stage.width, Laya.stage.height, 0, 0) as Laya.Texture;
        },
        clear: () => {
            for (let index = 0; index < _Tweeting._photo.arr.length; index++) {
                const element = _Tweeting._photo.arr[index]
                element && element.destroy();
            }
            _Tweeting._photo.arr = [];
            Laya.Resource.destroyUnusedResources();
        }
    };
    /**关注数*/
    export let _attentionNum = {
        get value(): number {
            return LwgStorage._num('_MakePattern/attention', null, 180).value;
        },
        set value(val: number) {
            LwgStorage._num('_MakePattern/attention').value = val;
        }
    }
    /**完成次数*/
    export let _completeNum = {
        get value(): number {
            return LwgStorage._num('_MakePattern/completeNum').value;
        },
        set value(val: number) {
            LwgStorage._num('_MakePattern/completeNum').value = val;
        }
    }


    /**被分享数*/
    export let _forwardedNum = {
        get value(): number {
            return LwgStorage._num('Tweeting/forwarded', null, LwgTools._Number.randomOneBySection(75, 125, true)).value;
        },
        set value(val: number) {
            LwgStorage._num('Tweeting/forwarded').value = val;
        }
    }

    /**被评论数*/
    export let _commentNum = {
        get value(): number {
            return LwgStorage._num('Tweeting/Comment', null, LwgTools._Number.randomOneBySection(100, 150, true)).value;
        },
        set value(val: number) {
            LwgStorage._num('Tweeting/Comment').value = val;
        }
    }

    /**被点赞数*/
    export let _likeNum = {
        get value(): number {
            return LwgStorage._num('Tweeting/like', null, LwgTools._Number.randomOneBySection(200, 250, true)).value;
        },
        set value(val: number) {
            LwgStorage._num('Tweeting/like').value = val;
        }
    }

    /**玩家简介*/
    export let _brief = {
        getThree: (): string[] => {
            return LwgTools._Array.randomGetOut(_Tweeting._brief.all, 3);
        },
        getOne: (): string[] => {
            return LwgTools._Array.randomGetOut(_Tweeting._brief.all);
        },
        all: [
            '世界很烦，但我要很可爱',
            '生活就是见招拆招',
            '忠于自己，热爱生活',
            '我很有个性，但我不想签名',
            'T^T	',
            '你最怕什么',
            '宁缺毋滥',
            '围脖红人',
            '剪裁大师',
            '剪裁王',
        ]
    }

    /**微博正文*/
    export let _mainBody = {
        getOne: (): string => {
            _Tweeting._mainBody.present = LwgTools._Array.randomGetOne(_Tweeting._mainBody.all);
            return _Tweeting._mainBody.present;
        },
        present: null as string,
        all: [
            '不管几岁，反正少女心万岁≧▽≦',
            '此处可爱贩卖机  24小时正常营业	',
            '欢迎光临我的手工小店，我会制作更多大家喜欢的衣服哦',
            '现在一定有个很可爱的人，在看我的这句话',
            '辛辛苦苦做了好久，结果很满意，好喜欢哦',
            '大家觉得我这套衣服怎么样',
            '闲来无事，做了一套衣服，感觉还不错',
            '我觉得吧，这次发挥的一般，下次会更好，敬请期待',
            '浮游于这个世界所产生的热能 也比不过喜欢你的热忱	',
            '时间会把对你最好的人留在最后，毕竟喜欢是一阵风，而爱是细水长流',
            '人生难免遇上些许不如意，翻过这一页就会发现生活处处有美好',
            '也许，只有制作衣服的时候，才会让自己的心静下来',
            '讲道理，我觉得我的手艺还不错，我是不是可以考虑开一家店了？',
            '技术还不太行，需要多多磨炼，再努力做几件衣服吧~',
            '今天心情好，早早地起来做衣服了，我是可爱的小裁缝~啦啦啦~',
            '给妈妈做了件衣服，妈妈说好喜欢~',
            '还有什么可以比做自己喜欢的事更加让人开心的呢~',
            '一些些自己的小设计，就可以让一件衣服焕发生机',
            '也许只是一瞬间的灵感，我将会付之于行动来实现它',
            '对于剪裁和搭配的热情，我不会输给任何人的~',
            '加油，我会成为最好的设计师的，我会爆火！~',
            '坚持不懈，认真对待自己的，努力成为最好的设计师！~',
            '感谢大家的支持，我会努力的',
        ]
    };
    /**网友回复*/
    export let _reply = {
        getTow: (): string[] => {
            return LwgTools._Array.randomGetOut(_Tweeting._reply.all, 2);
        },
        all: [
            '加油，坚持，我看好你哦',
            '好好看，我也想要',
            '那么请问在哪里可以买到呢',
            '有一说一，真的还可以',
            '感觉，你做的越来越好了',
            '我也想和你一样拥有如此灵巧的双手',
            '真的好看，加油',
            '我的天，这也太美了吧',
            'OMG，买他买他！~',
            '沙发~~',
            '点赞这条回复，你会好运连连',
            '求翻牌，你这也太美了吧',
            '太适合仙女了吧',
            '我也想学学，能教教我吗',
            '感觉你能火，坚持，加油',
            '感觉没有什么可以难倒你',
            '我想和你一样心灵手巧',
            '我的天，这是真的太好看了',
            ' U1S1，是真漂亮~',
            '我觉得你还可以更优秀~',
            '不是我杠精，你这个真的，真可以，没的杠',
            '好看是真好看，难也是真的难',
            '感觉我学不会，咋办，好美',
            '仙女穿起来也太好看了吧',
            '花痴脸~这也太美了',
            '坚持，我看好你哦，感觉你能火',
            '天哪，这也太美了吧',
        ]
    }
    /**当前被选中的照片*/
    export let _photoIndex = 0;

}
export module _CheckIn {
    export class _Data extends LwgData._Table {
        private static ins: _Data;
        static _ins(): _Data {
            if (!this.ins) {
                this.ins = new _Data('CheckIn', _Res._ins().$json.CheckIn.dataArr, true);
            }
            return this.ins;
        }
        _otherPro = {
            checkAddition: 'checkAddition',
            otherRewardType: 'otherRewardType',
            otherRewardNum: 'otherRewardNum',
            otherCompelet: 'otherCompelet',
        }
    }

    /**提前解锁全部奖励按广告，解锁了几次*/
    export let _immediately = {
        get value(): number {
            return LwgStorage._num('_CheckIn/immediately').value;
        },
        set value(val: number) {
            LwgStorage._num('_CheckIn/immediately').value = val;
        }
    }

    /**当前签到第几天了，4日签到为4天一个循环*/
    export let _checkInNum = {
        /**提前解锁全部奖励按钮，解锁了几次*/
        get value(): number {
            return LwgStorage._num('_CheckIn/checkInNum').value;
        },
        set value(val: number) {
            LwgStorage._num('_CheckIn/checkInNum').value = val;
        }
    }

    /**当前签到第几天了，4日签到为4天一个循环*/
    export let _lastCheckDate = {
        get value(): number {
            return LwgStorage._num('_CheckIn/lastCheckDate').value;
        },
        set value(val: number) {
            LwgStorage._num('_CheckIn/lastCheckDate').value = val;
        }
    }

    /**当前签到第几天了，4日签到为4天一个循环*/
    export let _todayCheckIn = {
        get value(): boolean {
            return _lastCheckDate.value == LwgDate._date.date ? true : false;
        },
    }
}
export module _Share {
    export let _whereFrom: string = 'MakePattern';
    export let _DressingRoomSp: Laya.Sprite;
}


