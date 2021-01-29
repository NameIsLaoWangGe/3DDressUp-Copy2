import { DataAdmin, DateAdmin, StorageAdmin, TimerAdmin, Tools } from "../Lwg/Lwg";
import { _3D } from "./_3D";
import { _Res } from "./_Res";


export class _GameData1 {
    // static get _AllClothes(): _AllClothes {
    //     return _AllClothes._ins();
    // }
    // static get _DIYClothes(): _DIYClothes {
    //     return _DIYClothes._ins();
    // }
    // static get _Ranking(): _Ranking {
    //     return _Ranking;
    // }
    // static get _Guide(): _Guide {
    //     return _Guide;
    // }
    // static get _PersonalInfo(): _PersonalInfo {
    //     return _PersonalInfo;
    // }
    // static get _BackHint(): _BackHint {
    //     return _BackHint;
    // }
    // static get _MakeTailor(): _MakeTailor {
    //     return _MakeTailor;
    // }
    // static get _MakePattern(): _MakePattern {
    //     return _MakePattern;
    // }
    // static get _DressingRoom(): _DressingRoom {
    //     return _DressingRoom;
    // }
    // static get _Tweeting(): _Tweeting {
    //     return _Tweeting;
    // }
    // static get _CheckIn(): _CheckIn {
    //     return _CheckIn;
    // }
}
export module _GameData {
    export class _Guide {
        static event = {
            closeGuide: 'Guide' + 'closeGuide',
            vanishGuide: 'Guide' + 'vanishGuide',

            StartBtnDress: 'Guide' + 'StartBtnDress',

            MakeTailorPulldown: 'Guide' + 'MakeTailorPulldown',
            MakeTailorChangeCloth: 'Guide' + 'MakeTailorChangeCloth',
            MakeTailorBtnCom: 'Guide' + 'MakeTailorBtnCom',
            MakeTailorStartTailor: 'Guide' + 'MakeTailorStartTailor',
            MakeTailorNewTailor: 'Guide' + 'MakeTailorNewTailor',
            MakeTailorCloseTailor: 'Guide' + 'MakeTailorCloseTailor',
            MakeTailorOpenTailor: 'Guide' + 'MakeTailorOpenTailor',

            MakePatternChooseClassify: 'Guide' + 'MakePatternChooseClassify',
            MakePatternPattern1: 'Guide' + 'MakePatternPattern1',
            MakePatternFrame1: 'Guide' + 'MakePatternFrame1',
            MakePatternTurnFace: 'Guide' + 'MakePatternTurnFace',
            MakePatternFrame2: 'Guide' + 'MakePatternFrame2',
            MakePatternPattern2: 'Guide' + 'MakePatternPattern2',
            MakePatternBtnCom: 'Guide' + 'MakePatternBtnCom',

            TweetingBtnChoosePhoto: 'Guide' + 'TweetingBtnChoosePhoto',
            TweetingChoosePhoto: 'Guide' + 'TweetingChoosePhoto',
            TweetingBtnSend: 'Guide' + 'TweetingBtnSend',
            TweetingBtnDoubleFans: 'Guide' + 'TweetingBtnDoubleFans',

            RankingCloseBtn: 'Guide' + 'RankingCloseBtn',

            PersonalInfoBtn: 'Guide' + 'PersonalInfoBtn',
            PersonalInfoWriteName: 'Guide' + 'PersonalInfoWriteName',
            PersonalInfoCloseBtn: 'Guide' + 'PersonalInfoCloseBtn',

            DelayBtnCheckIn: 'Start' + 'DelayBtnCheckIn',
            BtnCheckIn: 'Guide' + 'BtnCheckIn',
            CheckInGetReward: 'Guide' + 'CheckInGetReward',
            CheckInCloseBtn: 'Guide' + 'CheckInBtnClose',

            StartOtherBtnClick: 'Guide' + 'StartOtherBtnClick',
        }
        /**引导是否完成*/
        static get _complete(): boolean {
            return StorageAdmin._bool('_Guide_complete').value;
        };
        static set _complete(val: boolean) {
            StorageAdmin._bool('_Guide_complete').value = val;
        }
        static MmakeTailorPulldownSwicth: boolean = false;
        static MmakeTailorBtnComSwicth: boolean = false;

        static get MakePatternState(): string {
            return this['/MakePatternState'] ? this['/MakePatternState'] : 'ChooseClassify';
        };
        static set MakePatternState(_state: string) {
            this['/MakePatternState'] = _state;
        }
        static MakePatternStateType = {
            ChooseClassify: `ChooseClassify`,
            Pattern1: 'Pattern1',
            Frame1: 'Frame1',
            TurnFace: 'TurnFace',
            Frame2: 'Frame2',
            Pattern2: 'Pattern2',
            BtnCom: 'BtnCom',
            closeGuide: 'closeGuide',
        }

        static CheckInCloseBtn: boolean = false;
    }
    export class _PersonalInfo {
        static get _name(): string {
            return StorageAdmin._str('playerName', null, 'You').value;
        };
        static set _name(str: string) {
            StorageAdmin._str('playerName').value = str;
        }
    }
    export class _BackHint {
        static _3dToSp: Laya.Sprite;
        static _fromScene: Laya.Scene;
    }
    export class _PreLoadCutIn {
        /**是不是从返回按钮中进来的，返回按钮中进来回主界面不会换装*/
        static _fromBack: boolean = false;
    }
    export class _Start {
        static _whereFrom: string;
        static event = {
            photo: 'Start' + 'photo',
            updateRanking: 'Start' + 'updateRanking',
            BtnPersonalInfo: 'Start' + 'BtnPersonalInfo',
        }
    }
    export class _AllClothes extends DataAdmin._Table {
        private static ins: _AllClothes;
        static _ins() {
            if (!this.ins) {
                this.ins = new _AllClothes('ClothesGeneral', _Res._list.json.GeneralClothes.dataArr, true);
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
        _otherPro = {
            putOn: 'putOn',
            part: 'part'
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
            const copyArr = Tools._ObjArray.arrCopy(DIYArr);
            // 将类型修改为'DIY'
            Tools._ObjArray.modifyProValue(copyArr, this._property.$classify, 'DIY');
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
            const _classify = _3D._Scene._ins()._Root.getChildByName(classify) as Laya.MeshSprite3D;
            for (let i = 0; i < _classify.numChildren; i++) {
                const _classifySp = _classify.getChildAt(i) as Laya.MeshSprite3D;
                _classifySp.active = false;
                for (let j = 0; j < partArr.length; j++) {
                    const obj = partArr[j];
                    if (obj[this._otherPro.part] === _classifySp.name) {
                        _classifySp.active = true;
                        for (let k = 0; k < _classifySp.numChildren; k++) {
                            const cloth = _classifySp.getChildAt(k) as Laya.SkinnedMeshSprite3D;
                            if (cloth.name === obj[this._property.$name]) {
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
                                    const ftexData = StorageAdmin._array(`${cloth.name}/${_DIYClothes._ins()._otherPro.texF}`).value;
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
                                    TimerAdmin._frameOnce(delay, this, () => {
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
                                    const rtexData = StorageAdmin._array(`${cloth.name}/${_DIYClothes._ins()._otherPro.texR}`).value;
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
                                    TimerAdmin._frameOnce(delay, this, () => {
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
            playAni && _3D._Scene._ins().playDispalyAni();
        }
        changeClothStart(): void {
            this.collectDIY();
            const arr = this._getArrByProperty(this._otherPro.putOn, true);
            this.changeClass(this._classify.DIY, arr, false, true);
            this.changeClass(this._classify.General, arr, false, true);
            this.startSpecialSet();
        }
        /**换装规则*/
        changeCloth(): void {
            const arr = this._getArrByProperty(this._otherPro.putOn, true);
            this.changeClass(this._classify.DIY, arr, true);
            this.changeClass(this._classify.General, arr, true);
        }

        /**进游戏时的特殊设置*/
        private startSpecialSet(): void {
            if (StorageAdmin._bool('DressState').value) {
                _3D._Scene._ins()._GBottoms.active = _3D._Scene._ins()._GTop.active = _3D._Scene._ins()._DBottoms.active = _3D._Scene._ins()._DTop.active = false;
            } else {
                _3D._Scene._ins()._GDress.active = _3D._Scene._ins()._DDress.active = false;
            }
        }

        /**特殊设置*/
        specialSet(part?: string): void {
            if (part === this._part.Dress) {
                StorageAdmin._bool('DressState').value = true;
            } else if (part === this._part.Top || part === this._part.Bottoms) {
                StorageAdmin._bool('DressState').value = false;
            }
            if (StorageAdmin._bool('DressState').value) {
                _3D._Scene._ins().displayDress();
            } else {
                _3D._Scene._ins().displayTopAndBotton();
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
    /**DIY服装总数据数据*/
    export class _DIYClothes extends DataAdmin._Table {
        private static ins: _DIYClothes;
        static _ins() {
            if (!this.ins) {
                this.ins = new _DIYClothes('DIYClothes', _Res._list.json.DIYClothes.dataArr, true);
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
            return [obj[`${this._otherPro.color}1`], obj[`${this._otherPro.color}2`]]
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
            const Cloth = Tools._Node.createPrefab(_Res._list.prefab2D[name]['prefab']);
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
    class _RankingData extends DataAdmin._Table {
        private static ins: _RankingData;
        static _ins() {
            if (!this.ins) {
                this.ins = new _RankingData('RankingData', _Res._list.json.Ranking.dataArr, true);
                if (!this.ins._arr[0]['iconSkin']) {
                    for (let index = 0; index < this.ins._arr.length; index++) {
                        const element = this.ins._arr[index];
                        element['iconSkin'] = `Game/UI/Ranking/IconSkin/avatar_${element[this.ins._property.$serial]}.png`;
                    }
                }
                this.ins._pitchName = '玩家';
                this.ins._sortByProperty(this.ins._otherPro.fansNum, this.ins._otherPro.rankNum);
            }
            return this.ins;
        }

        _otherPro = {
            rankNum: 'rankNum',
            fansNum: 'fansNum',
            iconSkin: 'iconSkin',
        }
        _classify = {
            other: 'other',
            self: 'self',
        }
    }
    export class _Ranking {
        /**从哪个界面进来*/
        static _whereFrom: string = 'Start';
        static get _Table(): _RankingData {
            return this['_RankingData'] ? this['_RankingData'] : _RankingData._ins();
        }
        static set _Table(v: _RankingData) {
            this['_RankingData'] = _RankingData._ins();
        }
    }
    export class _MakeTailor {
        static event = {
            scissorTrigger: '_MakeTailor_scissorTrigger',
            completeEffcet: '_MakeTailor_completeAni',
            changeClothes: '_MakeTailor_changeClothes',
            scissorAppear: '_MakeTailor_scissorAppear',
            scissorPlay: '_MakeTailor_scissorPlay',
            scissorStop: '_MakeTailor_scissorStop',
            scissorRotation: '_MakeTailor_scissorRotation',
            scissorAgain: '_MakeTailor_scissorSitu',
            scissorRemove: '_MakeTailor_scissorRemove',
        }
    }
    export class _MakePattern {
        static event = {
            close: '_MakePattern_close',
            createImg: '_MakePattern_createImg',
        }
    }
    export class _DressingRoom {
        static event = {
            changeCloth: '_DressingRoom_ChangeCloth',
        }
    }
    export class _Tweeting {
        /**过程中的照相*/
        static _photo = {
            arr: [],
            take: (Scene: Laya.Scene, index: number) => {
                _Tweeting._photo.arr[index] && (_Tweeting._photo.arr[index] as Laya.Texture).destroy();
                _Tweeting._photo.arr[index] = Scene.drawToTexture(Laya.stage.width, Laya.stage.height, 0, 0);
            },
            clear: () => {
                for (let index = 0; index < _Tweeting._photo.arr.length; index++) {
                    const element = _Tweeting._photo.arr[index] as Laya.Texture;
                    element && element.destroy();
                }
                _Tweeting._photo.arr = [];
                Laya.Resource.destroyUnusedResources();
            }
        };
        /**关注数*/
        static get _attentionNum(): number {
            return StorageAdmin._num('_MakePattern/attention', null, 180).value;
        };
        static set _attentionNum(val: number) {
            StorageAdmin._num('_MakePattern/attention').value = val;
        }
        /**完成次数*/
        static get _completeNum(): number {
            return StorageAdmin._num('_MakePattern/completeNum').value;
        };
        static set _completeNum(val: number) {
            StorageAdmin._num('_MakePattern/completeNum').value = val;
        }
        /**被分享数*/
        static get _forwardedNum(): number {
            return StorageAdmin._num('Tweeting/forwarded', null, Tools._Number.randomOneBySection(75, 125, true)).value;
        };
        static set _forwardedNum(val: number) {
            StorageAdmin._num('Tweeting/forwarded').value = val;
        }
        /**被评论数*/
        static get _commentNum(): number {
            return StorageAdmin._num('Tweeting/Comment', null, Tools._Number.randomOneBySection(100, 150, true)).value;
        };
        static set _commentNum(val: number) {
            StorageAdmin._num('Tweeting/Comment').value = val;
        }
        /**被点赞数*/
        static get _likeNum(): number {
            return StorageAdmin._num('Tweeting/like', null, Tools._Number.randomOneBySection(200, 250, true)).value;
        };
        static set _likeNum(val: number) {
            StorageAdmin._num('Tweeting/like').value = val;
        }

        /**玩家简介*/
        static _brief = {
            getThree: (): string[] => {
                return Tools._Array.randomGetOut(_Tweeting._brief.all, 3);
            },
            getOne: (): string[] => {
                return Tools._Array.randomGetOut(_Tweeting._brief.all);
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
        static _mainBody = {
            getOne: (): string => {
                _Tweeting._mainBody.present = Tools._Array.randomGetOne(_Tweeting._mainBody.all);
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
        static _reply = {
            getTow: (): string[] => {
                return Tools._Array.randomGetOut(_Tweeting._reply.all, 2);
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
        static _photoIndex = 0;

    }

    class _CheckInData extends DataAdmin._Table {
        private static ins: _CheckIn;
        static _ins(): _CheckIn {
            if (!this.ins) {
                this.ins = new _CheckIn('CheckIn', _Res._list.json.CheckIn.dataArr, true);
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
    export class _CheckIn extends DataAdmin._Table {
        static get _Table(): _CheckInData {
            return _CheckInData._ins();
        }
        /**提前解锁全部奖励按钮，解锁了几次*/
        static get _immediately(): number {
            return StorageAdmin._num('_CheckIn/immediately').value;
        };
        static set _immediately(val: number) {
            StorageAdmin._num('_CheckIn/immediately').value = val;
        }
        /**当前签到第几天了，4日签到为4天一个循环*/
        static get _checkInNum(): number {
            return StorageAdmin._num('_CheckIn/checkInNum').value;
        };
        static set _checkInNum(val: number) {
            StorageAdmin._num('_CheckIn/checkInNum').value = val;
        }
        /**上次的签到日期，主要判断今日会不会弹出签到，不一样则弹出签到，一样则不弹出签到*/
        static get _lastCheckDate(): number {
            return StorageAdmin._num('_CheckIn/lastCheckDate').value;
        };
        static set _lastCheckDate(val: number) {
            StorageAdmin._num('_CheckIn/lastCheckDate').value = val;
        }
        /**
         * 今天是否已经签到
         */
        static get _todayCheckIn(): boolean {
            return this._lastCheckDate == DateAdmin._date.date ? true : false;
        };
    }
    export class _Pattern extends DataAdmin._Table {
        private static ins: _Pattern;
        static _ins(): _Pattern {
            if (!this.ins) {
                this.ins = new _Pattern('_Pattern', _Res._list.json.MakePattern.dataArr, true);
                this.ins._pitchClassify = this.ins._classify.newYear;
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
    export class _PatternDiff extends DataAdmin._Table {
        private static ins: _PatternDiff;
        static _ins(): _PatternDiff {
            if (!this.ins) {
                this.ins = new _PatternDiff('_DIYClothesDiff', _Res._list.json.DIYClothesDiff.dataArr, false);
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
            return _GameData._PatternDiff._ins()._getProperty(_3D.DIYCloth._ins().name, 'fDiffX');
        };
        get fDiffY(): number {
            return _GameData._PatternDiff._ins()._getProperty(_3D.DIYCloth._ins().name, 'fDiffY');
        };

        get rDiffX(): number {
            return _GameData._PatternDiff._ins()._getProperty(_3D.DIYCloth._ins().name, 'rDiffX');
        };
        get rDiffY(): number {
            return _GameData._PatternDiff._ins()._getProperty(_3D.DIYCloth._ins().name, 'rDiffY');
        };
    }
}

