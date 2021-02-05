import Lwg from "../Lwg/Lwg";

export class _Res implements Lwg.PreLoadAdmin._ResType {
    private static ins: _Res;
    static _ins() {
        if (!this.ins) {
            this.ins = new _Res();
        }
        return this.ins;
    }
    $scene3D: any = {
        // MakeClothes: {
        //     url: `_Lwg3D/_Scene/LayaScene_3DDressUp/Conventional/3DDressUp.ls`,
        //     Scene: null as Laya.Scene3D,
        // },
        MakeClothes: {
            url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/_Lwg3D/_Scene/LayaScene_3DDressUp/Conventional/3DDressUp.ls`,
            Scene: null as Laya.Scene3D,
        },
    };
    $texture2D: any = {
        bgStart: {
            url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgStart.jpg`,
            texture2D: null as Laya.Texture2D,
        },
    };;
    $scene2D: any = {
        Start: `Scene/${'Start'}.json`,
        Guide: `Scene/${'Guide'}.json`,
        PreLoadStep: `Scene/${'PreLoadCutIn'}.json`,
        MakePattern: `Scene/${'MakePattern'}.json`,
        MakeTailor: `Scene/${'MakeTailor'}.json`,
    };
    $prefab2D: any = {
        NativeRoot: {
            url: 'Prefab/NativeRoot.json',
            prefab: new Laya.Prefab,
        },
        BtnAgain: {
            url: 'Prefab/BtnAGainTow.json',
            prefab: new Laya.Prefab,
        },
        BtnBack: {
            url: 'Prefab/BtnBack3.json',
            prefab: new Laya.Prefab,
        },
        BtnRollback: {
            url: 'Prefab/BtnRollback.json',
            prefab: new Laya.Prefab,
        },

        diy_bottom_002_final: {
            url: 'Prefab/diy_bottom_002_final.json',
            prefab: new Laya.Prefab,
        },
        diy_bottom_003_final: {
            url: 'Prefab/diy_bottom_003_final.json',
            prefab: new Laya.Prefab,
        },
        diy_bottom_004_final: {
            url: 'Prefab/diy_bottom_004_final.json',
            prefab: new Laya.Prefab,
        },
        diy_bottom_005_final: {
            url: 'Prefab/diy_bottom_005_final.json',
            prefab: new Laya.Prefab,
        },
        diy_bottom_006_final: {
            url: 'Prefab/diy_bottom_006_final.json',
            prefab: new Laya.Prefab,
        },

        diy_dress_001_final: {
            url: 'Prefab/diy_dress_001_final.json',
            prefab: new Laya.Prefab,
        },
        diy_dress_002_final: {
            url: 'Prefab/diy_dress_002_final.json',
            prefab: new Laya.Prefab,
        },
        diy_dress_003_final: {
            url: 'Prefab/diy_dress_003_final.json',
            prefab: new Laya.Prefab,
        },
        diy_dress_004_final: {
            url: 'Prefab/diy_dress_004_final.json',
            prefab: new Laya.Prefab,
        },
        diy_dress_005_final: {
            url: 'Prefab/diy_dress_005_final.json',
            prefab: new Laya.Prefab,
        },
        diy_dress_006_final: {
            url: 'Prefab/diy_dress_006_final.json',
            prefab: new Laya.Prefab,
        },
        diy_dress_007_final: {
            url: 'Prefab/diy_dress_007_final.json',
            prefab: new Laya.Prefab,
        },
        diy_dress_008_final: {
            url: 'Prefab/diy_dress_008_final.json',
            prefab: new Laya.Prefab,
        },

        diy_top_003_final: {
            url: 'Prefab/diy_top_003_final.json',
            prefab: new Laya.Prefab,
        },
        diy_top_004_final: {
            url: 'Prefab/diy_top_004_final.json',
            prefab: new Laya.Prefab,
        },
        diy_top_005_final: {
            url: 'Prefab/diy_top_005_final.json',
            prefab: new Laya.Prefab,
        },
        diy_top_006_final: {
            url: 'Prefab/diy_top_006_final.json',
            prefab: new Laya.Prefab,
        },
        diy_top_007_final: {
            url: 'Prefab/diy_top_007_final.json',
            prefab: new Laya.Prefab,
        },
        diy_top_008_final: {
            url: 'Prefab/diy_top_008_final.json',
            prefab: new Laya.Prefab,
        },
    };;
    $json: any = {
        GeneralClothes: {
            url: `_LwgData/_DressingRoom/GeneralClothes.json`,
            dataArr: new Array,
        },
        DIYClothes: {
            url: `_LwgData/_MakeTailor/DIYClothes.json`,
            dataArr: new Array,
        },
        DIYClothesDiff: {
            url: `_LwgData/_MakeTailor/DIYClothesDiff.json`,
            dataArr: new Array,
        },
        MakePattern: {
            url: `_LwgData/_MakePattern/MakePattern.json`,
            dataArr: new Array,
        },
        Ranking: {
            url: `_LwgData/_Ranking/Ranking.json`,
            dataArr: new Array,
        },
        CheckIn: {
            url: `_LwgData/_CheckIn/CheckIn.json`,
            dataArr: new Array,
        }
    };
}

export class _CutInRes {
    static Start: Lwg.PreLoadAdmin._ResType = {
        $texture2D: {
            bgStart: {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgStart.jpg`,
                texture2D: null as Laya.Texture2D,
            },
        }
    }
    static MakePattern: Lwg.PreLoadAdmin._ResType = {
        $texture2D: {
            bgMakePattern: {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgMakePattern.jpg`,
                texture2D: null as Laya.Texture2D,
            },
            bgPhoto: {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgPhoto.png`,
                texture2D: null as Laya.Texture2D,
            },
        }
    }
    static DressingRoom: Lwg.PreLoadAdmin._ResType = {
        $texture2D: {
            bgDressingRoom: {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgDressingRoom.jpg`,
                texture2D: null as Laya.Texture2D,
            },
        }
    }
}