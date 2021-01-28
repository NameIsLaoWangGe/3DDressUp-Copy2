
// import GameDataMgr from "./Game/Center/GameDataMgr";
export default class NativeAd extends Laya.Script {
    //原生插屏广告
    private nativeAd: TJ.API.AdService.NativeItem;
    private defaultNode: Laya.Box = null;
    private nativetNode: Laya.Box = null;
    private icon: Laya.Image = null;
    private title: Laya.Text = null;
    private desc: Laya.Text = null;
    private contant: Laya.Image = null;
    private close: Laya.Image = null;

    private WatchAD1: Laya.Image = null;
    private WatchAD2: Laya.Image = null;
    onAwake() {
        this.defaultNode = this.owner.getChildByName("defaultNode") as Laya.Box;
        this.nativetNode = this.owner.getChildByName("nativeNode") as Laya.Box;
        this.icon = this.nativetNode.getChildByName("Icon") as Laya.Image;
        this.title = this.nativetNode.getChildByName("Title") as Laya.Text;
        this.desc = this.nativetNode.getChildByName("Des") as Laya.Text;
        this.contant = this.nativetNode.getChildByName('Contant') as Laya.Image;
        this.WatchAD2 = this.owner.getChildByName("WatchAD2") as Laya.Image;
        this.close = this.owner.getChildByName("Close") as Laya.Image;
        if (this.WatchAD2) {
            this.WatchAD2.on(Laya.Event.CLICK, this, this.Click);
        }
        else {
            this.WatchAD2 = this.nativetNode.getChildByName("WatchAD2") as Laya.Image;
            if (this.WatchAD2) {
                this.WatchAD2.on(Laya.Event.CLICK, this, this.Click);
            }
        }

        this.WatchAD1 = this.owner.getChildByName("WatchAD1") as Laya.Image;
        if (this.WatchAD1) {
            this.WatchAD1.on(Laya.Event.CLICK, this, this.Click);
        }
        else {
            this.WatchAD1 = this.nativetNode.getChildByName("WatchAD1") as Laya.Image;
            if (this.WatchAD1) {
                this.WatchAD1.on(Laya.Event.CLICK, this, this.Click);
            }
        }
        this.nativetNode.on(Laya.Event.CLICK, this, this.Click);
        (this.owner as Laya.Box).visible = false;

        this.close.on(Laya.Event.CLICK, this, () => {
            this.owner.removeSelf();
        });

        Laya.timer.once(100, this, () => {
            this.Show();
        })
    }

    Show() {
        let p = new TJ.API.AdService.Param();
        this.nativeAd = TJ.API.AdService.LoadNative(p);
        console.log("展示原生广告 =》", this.nativeAd);
        if (this.nativeAd != null) {
            console.log("展示原生广告 =》", this.nativeAd.iconUrl);
            console.log("展示原生广告 =》", this.nativeAd.title);
        }
        if (this.nativeAd != null) {
            (this.owner as Laya.Box).visible = true;
            if (this.nativeAd) {
                console.log("this.nativeAd = ", this.nativeAd);
                this.nativeAd.OnShow();
                this.icon.skin = this.nativeAd.iconUrl;
                this.title.text = this.nativeAd.title;
                this.desc.text = this.nativeAd.desc;
                this.contant.skin = this.nativeAd.imgUrl;
            }
        }
        else {
            (this.owner as Laya.Box).visible = false;
        }
    }
    Click() {
        if (this.nativeAd != null) {
            this.nativeAd.OnClick();
            // if (GameDataMgr._Instance().IsTaskPage) {
            //     ADManager.TAPoint(TaT.BtnClick, "YSbt_task")
            // }
        }
    }
}