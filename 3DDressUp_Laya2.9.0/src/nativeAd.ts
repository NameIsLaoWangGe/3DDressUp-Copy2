export default class nativeAd extends Laya.Script
{

    /** @prop {name:icon,type:Node} */
    icon: Laya.Image = null;
    /** @prop {name:image,type:Node} */
    image: Laya.Image = null;
    /** @prop {name:logo,type:Node} */
    logo: Laya.Image = null;
    /** @prop {name:title,type:Node} */
    title: Laya.Label = null;
    /** @prop {name:desc,type:Node} */
    desc: Laya.Label = null;

    onStart()
    {
        this.ShowNext();
    }

    data: TJ.API.AdService.NativeItem;
    ShowNext()
    {
        this.data = TJ.API.AdService.LoadNative(new TJ.API.AdService.Param());
        if (this.data != null)
        {
            this.data.OnShow();
            this.title.text = this.data.title;
            this.desc.text = this.data.desc;
            this.icon.skin = this.data.iconUrl;
            this.image.skin = this.data.imgUrl;
            this.logo.skin = this.data.logoUrl;
        }
    }
    onClick()
    {
        if (this.data != null)
        {
            this.data.OnClick();
        }
        setTimeout(() =>
        {
            this.ShowNext();
        }, 1000);
    }
}
