import Lwg from "../Lwg/Lwg";
type scene3D = {} & Lwg.PreLoadAdmin.scene3D;
type texture2D = {} & Lwg.PreLoadAdmin.texture2D;
type scene2D = {} & Lwg.PreLoadAdmin.scene2D;
type prefab2D = {} & Lwg.PreLoadAdmin.prefab2D;
type json = {} & Lwg.PreLoadAdmin.json;
type prefab3D = {} & Lwg.PreLoadAdmin.prefab3D;
type mesh3D = {} & Lwg.PreLoadAdmin.mesh3D;
type material = {} & Lwg.PreLoadAdmin.material;
type texture = {} & Lwg.PreLoadAdmin.texture;
type pic2D = {} & Lwg.PreLoadAdmin.pic2D;
type skeleton = {} & Lwg.PreLoadAdmin.skeleton;
type effectsTex2D = {} & Lwg.PreLoadAdmin.effectsTex2D;
/**游戏开始前加载*/
export module _Res {
    export class $scene3D {
        static MakeClothes: scene3D = {
            url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/_Lwg3D/_Scene/LayaScene_3DDressUp/Conventional/3DDressUp.ls`,
            scene3D: null as Laya.Scene3D,
        }
    }
    /**图片需要设置成不打包*/
    export class $texture2D {
        static bgStart: texture2D = {
            url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgStart.jpg`,
            texture2D: null as Laya.Texture2D,
        }
    };
    export class $scene2D {
        static Start: scene2D = { url: `Scene/${'Start'}.json` };
        static Guide: scene2D = { url: `Scene/${'Guide'}.json` };
        static PreLoadStep: scene2D = { url: `Scene/${'PreLoadCutIn'}.json` };
        static MakePattern = { url: `Scene/${'MakePattern'}.json` };
        static MakeTailor: scene2D = { url: `Scene/${'MakeTailor'}.json` };
    };
    export class $prefab2D {
        static NativeRoot: prefab2D = {
            url: 'Prefab/NativeRoot.json',
            prefab2D: null as Laya.Prefab,
        };
        static BtnAgain: prefab2D = {
            url: 'Prefab/BtnAGainTow.json',
            prefab2D: null as Laya.Prefab,
        };
        static BtnBack: prefab2D = {
            url: 'Prefab/BtnBack3.json',
            prefab2D: null as Laya.Prefab,
        };
        static BtnRollback: prefab2D = {
            url: 'Prefab/BtnRollback.json',
            prefab2D: null as Laya.Prefab,
        };

        static diy_bottom_002_final: prefab2D = {
            url: 'Prefab/diy_bottom_002_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_bottom_003_final: prefab2D = {
            url: 'Prefab/diy_bottom_003_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_bottom_004_final: prefab2D = {
            url: 'Prefab/diy_bottom_004_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_bottom_005_final: prefab2D = {
            url: 'Prefab/diy_bottom_005_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_bottom_006_final: prefab2D = {
            url: 'Prefab/diy_bottom_006_final.json',
            prefab2D: null as Laya.Prefab,
        };

        static diy_dress_001_final: prefab2D = {
            url: 'Prefab/diy_dress_001_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_dress_002_final: prefab2D = {
            url: 'Prefab/diy_dress_002_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_dress_003_final: prefab2D = {
            url: 'Prefab/diy_dress_003_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_dress_004_final: prefab2D = {
            url: 'Prefab/diy_dress_004_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_dress_005_final: prefab2D = {
            url: 'Prefab/diy_dress_005_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_dress_006_final: prefab2D = {
            url: 'Prefab/diy_dress_006_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_dress_007_final: prefab2D = {
            url: 'Prefab/diy_dress_007_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_dress_008_final: prefab2D = {
            url: 'Prefab/diy_dress_008_final.json',
            prefab2D: null as Laya.Prefab,
        };

        static diy_top_003_final: prefab2D = {
            url: 'Prefab/diy_top_003_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_top_004_final: prefab2D = {
            url: 'Prefab/diy_top_004_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_top_005_final: prefab2D = {
            url: 'Prefab/diy_top_005_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_top_006_final: prefab2D = {
            url: 'Prefab/diy_top_006_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_top_007_final: prefab2D = {
            url: 'Prefab/diy_top_007_final.json',
            prefab2D: null as Laya.Prefab,
        };
        static diy_top_008_final: prefab2D = {
            url: 'Prefab/diy_top_008_final.json',
            prefab2D: null as Laya.Prefab,
        };
    };
    export class $json {
        static GeneralClothes: json = {
            url: `_LwgData/_DressingRoom/GeneralClothes.json`,
            dataArr: null as [],
        };
        static DIYClothes: json = {
            url: `_LwgData/_MakeTailor/DIYClothes.json`,
            dataArr: null as [],
        };
        static DIYClothesDiff: json = {
            url: `_LwgData/_MakeTailor/DIYClothesDiff.json`,
            dataArr: null as [],
        };
        static MakePattern: json = {
            url: `_LwgData/_MakePattern/MakePattern.json`,
            dataArr: null as [],
        };
        static Ranking: json = {
            url: `_LwgData/_Ranking/Ranking.json`,
            dataArr: null as [],
        };
        static CheckIn: json = {
            url: `_LwgData/_CheckIn/CheckIn.json`,
            dataArr: null as [],
        }
    };
    export class $prefab3D { };
    export class $mesh3D { };
    export class $material { };
    export class $texture { };
    export class $pic2D { };
    export class $skeleton { };
}

/**页面前加载*/
export module _CutInRes {
    export module Start {
        export class $texture2D {
            static bgStart = {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgStart.jpg`,
                texture2D: null as Laya.Texture2D,
            }
        };
    }
    export module MakePattern {
        export class $texture2D {
            static bgMakePattern = {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgMakePattern.jpg`,
                texture2D: null as Laya.Texture2D,
            };
            static bgPhoto = {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgPhoto.png`,
                texture2D: null as Laya.Texture2D,
            }
        };
    }
    export module DressingRoom {
        export class $texture2D {
            static bgDressingRoom = {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgDressingRoom.jpg`,
                texture2D: null as Laya.Texture2D,
            }
        }
    }
}