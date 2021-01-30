/**如果需要加载一组数据,[url1.url2,...]，则可以将需要加载的数组进行遍历赋值给相对应的对象的url，直接加载整个数组也是成立的,只不过加载后，只能通过Laya.loader.getRes(url)获取*/
export class _Res {
    static _list = {
        scene3D: {
            // MakeClothes: {
            //     url: `_Lwg3D/_Scene/LayaScene_3DDressUp/Conventional/3DDressUp.ls`,
            //     Scene: null as Laya.Scene3D,
            // },
            MakeClothes: {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/_Lwg3D/_Scene/LayaScene_3DDressUp/Conventional/3DDressUp.ls`,
                Scene: null as Laya.Scene3D,
            },
        },
        // prefab3D: {
        //     Level1: {
        //         url: `_Lwg3D/_Prefab/LayaScene_MakeClothes/Conventional/MakeClothes.ls`,
        //         Prefab: null as Laya.Sprite3D,
        //     }
        // },
        pic2D: {
            Effects: "res/atlas/lwg/Effects.png",
        },

        prefab2D: {
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
        },
        texture: {
            // glasses: {
            //     url: `/_Lwg3D/_Scene/LayaScene_MakeUp/Conventional/Assets/Reference/Texture2D/common_s.png`,
            //     texture: null as Laya.Texture,
            // },
        },
        // /**图片需要设置成不打包*/
        texture2D: {

            bgStart: {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgStart.jpg`,
                texture2D: null as Laya.Texture2D,
            },
        },
        /**通过直接获取场景的显示和打开，和scene关联，实现，先加载，然后直接切换*/
        scene2D: {
            Start: `Scene/${'Start'}.json`,
            Guide: `Scene/${'Guide'}.json`,
            PreLoadStep: `Scene/${'PreLoadCutIn'}.json`,
            MakePattern: `Scene/${'MakePattern'}.json`,
            MakeTailor: `Scene/${'MakeTailor'}.json`,
        },

        json: {
            GeneralClothes: {
                url: [`_LwgData/_MakeTailor/DIYClothes.json`, `_LwgData/_DressingRoom/GeneralClothes.json`],
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
        },
        // mesh3D: {},
        // material: {},
        // skeleton: {
        //     test: {
        //         url: 'Game/Skeleton/test.sk',
        //         templet: new Laya.Templet,
        //     },
        // }
    }
}

export class _CutInRes {
    static Start = {
        texture2D: {
            bgStart: {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgStart.jpg`,
                texture2D: null as Laya.Texture2D,
            },
        }
    }
    static MakePattern = {
        texture2D: {
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
    static DressingRoom = {
        texture2D: {
            bgDressingRoom: {
                url: `https://h5.tomatojoy.cn/res/ark/3d04671eec61b1e12a6c02e54c1e7320/1.0.0/3DDressUp/Bg/bgDressingRoom.jpg`,
                texture2D: null as Laya.Texture2D,
            },
        }
    }
}