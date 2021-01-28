import { Admin } from "./Lwg";

export default class SubPkg {

    pkgFlag: number;

    pkgInfo: { name: string, root: string }[] = [
        { name: "Game", root: "Game/" },
        { name: "res", root: "res/" },
    ];

    init() {
        console.log(`SubPkg  init`);
        // if(TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.WX_AppRt){
        //     this.pkgFlag = 0;
        //     this.loadPkg_wx();
        // }else   if(TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.SQ_AppRt){
        //     this.pkgFlag = 0;
        //     console.log(`SubPkg  qqGame`);
        //     this.loadPkg_sq();
        // }
        // else   if(TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.VIVO_AppRt){
        //     this.pkgFlag = 0;
        //     this.loadPkg_VIVO();
        // }
        // else   if(TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt){
        //     this.pkgFlag = 0;
        //     this.loadPkg_OPPO();
        // }
        // else
        // {
        this.pkgFlag = 0;
        console.log(`SubPkg  oppoGame`);
        this.loadPkg_OPPO();
        // }

        // GameUI.ins.GameInit();
    }

    loadPkg_wx() {
        if (this.pkgFlag == this.pkgInfo.length) {
            console.log("showLoading");
        } else {
            let info = this.pkgInfo[this.pkgFlag];
            let name = info.name;
            let root = info.root;
            Laya.Browser.window.wx.loadSubpackage({
                name: name,
                success: (res) => {
                    // console.log(`load ${name} suc`);
                    Laya.MiniAdpter.subNativeFiles[name] = root;
                    Laya.MiniAdpter.nativefiles.push(root);
                    this.pkgFlag++;
                    this.loadPkg_wx();
                },
                fail: (res) => {
                    console.error(`load ${name} err: `, res);
                },
            });
        }
    }

    loadPkg_sq() {
        if (this.pkgFlag == this.pkgInfo.length) {

            console.log("GameInit");
        } else {
            let info = this.pkgInfo[this.pkgFlag];
            let name = info.name;
            let root = info.root;

            Laya.Browser.window.qq.loadSubpackage({
                name: name,
                success: (res) => {
                    //  Laya.MiniAdpter.subNativeFiles[name] = root;
                    // Laya.MiniAdpter.nativefiles.push(root);
                    this.pkgFlag++;

                    this.loadPkg_sq();
                },
                fail: (res) => {
                    console.error(`load ${name} err: `, res);
                },
            });
        }
    }

    loadPkg_VIVO() {
        if (this.pkgFlag == this.pkgInfo.length) {

            console.log("GameInit");
        } else {
            let info = this.pkgInfo[this.pkgFlag];
            let name = info.name;
            let root = info.root;
            Laya.Browser.window.qg.loadSubpackage({
                name: name,
                success: (res) => {
                    // Laya.MiniAdpter.subNativeFiles[name] = root;
                    // Laya.MiniAdpter.nativefiles.push(root);
                    this.pkgFlag++;
                    this.loadPkg_VIVO();
                },
                fail: (res) => {
                    console.error(`load ${name} err: `, res);
                },
            })
        }
    }

    loadPkg_OPPO() {
        console.log("loadPkg_OPPOsssssssss");
        if (this.pkgFlag == this.pkgInfo.length) {
            Admin._openScene('PreLoad');
            console.log("GameInit");
        } else {
            let info = this.pkgInfo[this.pkgFlag];
            let name = info.name;
            let root = info.root;
            let subTask = Laya.Browser.window.qg.loadSubpackage({
                name: name,
                success: (res) => {

                    //  Laya.MiniAdpter.subNativeFiles[name] = root;

                    // Laya.MiniAdpter.nativefiles.push(root);

                    this.pkgFlag++;

                    this.loadPkg_OPPO();

                },
                fail: (res) => {
                    console.log("123123  " + JSON.stringify(res));
                    console.log(`load ${name} err: ` + JSON.stringify(res));
                },
            });

        }
    }
}