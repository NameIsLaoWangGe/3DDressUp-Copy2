import { LwgScene, LwgDialogue } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _Guide, _Tweeting } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _SceneName } from "./_SceneName";

export default class Tweeting_ChoosePhotos extends LwgScene._SceneBase {
    photoArr: Laya.Image[];
    lwgOnAwake(): void {
        this.photoArr = [this._ImgVar('Photo1'), this._ImgVar('Photo2'), this._ImgVar('Photo3')];
        for (let index = 0; index < this.photoArr.length; index++) {
            const Pic = this.photoArr[index].getChildByName('Pic') as Laya.Sprite;
            if (_Tweeting._photo.arr[index]) {
                Pic.texture = _Tweeting._photo.arr[index];
            }
        }
    }

    lwgOpenAni(): number {
        return _GameAni._dialogOpenPopup(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
            !_Guide._complete.value && this._openScene('Guide', false, false, () => {
                this._evNotify(_Guide.Event.TweetingChoosePhoto, [this._ImgVar('Photo1')._lwg.gPoint.x, this._ImgVar('Photo1')._lwg.gPoint.y]);
            });
        });
    }
    lwgButton(): void {
        for (let index = 0; index < this.photoArr.length; index++) {
            const element = this.photoArr[index] as Laya.Sprite;
            this._btnUp(element, () => {
                for (let index = 0; index < this.photoArr.length; index++) {
                    const _element = this.photoArr[index] as Laya.Image;
                    const Tick = _element.getChildByName('Tick') as Laya.Image;
                    if (element == _element) {
                        _element.scale(1.05, 1.05);
                        _Tweeting._photoIndex = index;
                        Tick.visible = true;
                        const gPBtnSend = this._ImgVar('Content').localToGlobal(new Laya.Point(this._ImgVar('BtnSend').x, this._ImgVar('BtnSend').y));
                        !_Guide._complete.value && this._evNotify(_Guide.Event.TweetingBtnSend, [gPBtnSend.x, gPBtnSend.y]);

                    } else {
                        _element.scale(1, 1);
                        Tick.visible = false;
                    }
                }
                this._ImgVar('BtnSend').skin = 'Game/UI/Tweeting/ChoosePhotos/anniu_fasong.png';
            }, 'null')
        };
        this._btnUp(this._ImgVar('BtnSend'), () => {
            if (this._ImgVar('BtnSend').skin == 'Game/UI/Tweeting/ChoosePhotos/anniu_fasong.png') {
                !_Guide._complete.value && this._evNotify(_Guide.Event.closeGuide);
                this._closeScene();
            } else {
                LwgDialogue._middleHint('还未选择照片哦！');
            }
        })
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'), this._ImgVar('BackGround'), () => {
            this._openScene(_SceneName.Tweeting_Dynamic, false);
        });
    }
    lwgOnDisable(): void {
    }
}