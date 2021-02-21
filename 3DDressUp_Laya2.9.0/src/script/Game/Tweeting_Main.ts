import ADManager, { TaT } from "../../TJ/Admanager";
import { LwgScene, LwgAni2D, LwgTimer, LwgTools, LwgClick, LwgPlatform } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _DIYClothes, _Guide, _PersonalInfo, _PreLoadCutIn, _Ranking, _Tweeting } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _SceneName } from "./_SceneName";

export default class Tweeting_Main extends LwgScene._SceneBase {
    lwgOnAwake(): void {
        ADManager.TAPoint(TaT.PageShow, 'weibopage');
        ADManager.TAPoint(TaT.BtnShow, 'photo_choose');
        // 正文
        this._LabelVar('BodyText').text = _Tweeting._mainBody.getOne();
        // 名字
        this._LabelVar('PlayerName').text = _PersonalInfo._name.value;
        // 玩家头部
        this._ImgVar('IconPic').skin = `Game/UI/Ranking/IconSkin/Ava.png`;
        _Tweeting._attentionNum.value += LwgTools._Number.randomOneInt(50, 100);
        this._LabelVar('AttentionNum').text = _Tweeting._attentionNum.value.toString();
        this._LabelVar('FansNum').text = _Ranking._Data._ins()._getPitchProperty(_Ranking._Data._ins()._mergePro.fansNum);
        // 完成次数增加也完成一些任务
        _Tweeting._completeNum.value++;
        _DIYClothes._ins()._checkConditionUnlockWay(_DIYClothes._ins()._unlockWay.customs, 1);
        this._LabelVar('CompleteNum').text = _Tweeting._completeNum.value.toString();
        // 热门
        const heatArr = LwgTools._Number.randomCountBySection(20, 50, 3);
        heatArr.sort();
        const briefArr = _Tweeting._brief.getThree();
        const iconArr = LwgTools._Number.randomCountBySection(1, 20, 3);
        for (let index = 0; index < 3; index++) {
            const Rank = this._ImgVar('Hot').getChildByName(`Rank${index + 1}`) as Laya.Box;
            const Name = Rank.getChildByName('Name') as Laya.Label;
            const Tag = Rank.getChildByName('Tag') as Laya.Image;
            const Brief = Rank.getChildByName('Brief') as Laya.Label;
            const Heat = Rank.getChildByName('Heat') as Laya.Label;
            const Icon = Rank.getChildByName('HeadIcon').getChildByName('Icon') as Laya.Image;
            const data = _Ranking._Data._ins()._arr[index];
            Name.text = data[_Ranking._Data._ins()._property.name];
            Tag.skin = `Game/UI/Tweeting/Main/${index + 1}.png`;
            Brief.text = briefArr[index];
            Heat.text = `本周热度 ${heatArr[index]}万`;
            Icon.skin = `Game/UI/Tweeting/Head/${iconArr[index]}.jpg`;
        }
        // 照片位置
        for (let index = 0; index < 3; index++) {
            const element = this._ImgVar('BtnChoosePhotos').getChildByName(`Photo${index + 1}`).getChildAt(0) as Laya.Sprite;
            if (_Tweeting._photo.arr[index]) {
                element.texture = _Tweeting._photo.arr[index];
            }
        }
        for (let index = 0; index < this._ImgVar('Content').numChildren; index++) {
            const element = this._ImgVar('Content').getChildAt(index) as Laya.Sprite;
            element.scale(0, 0);
        }
    }

    lwgAdaptive(): void {
        this._ImgVar('Head').pos(this._Owner.width - (this._ImgVar('Head').width + 57), this._ImgVar('Head').y);
        this._ImgVar('Hot').pos(this._Owner.width - (this._ImgVar('Hot').width + 41), this._ImgVar('Hot').y);
        this._ImgVar('BtnChoosePhotos').size(this._Owner.width - this._ImgVar('BtnChoosePhotos').x - (this._Owner.width - this._ImgVar('Hot').x) - 30, this._ImgVar('BtnChoosePhotos').height);
        if (LwgPlatform._Ues.value === LwgPlatform._Tpye.Bytedance) {
            this._ImgVar('PhotoAds').destroy();
            this._ImgVar('Photo1').centerX = -(20 + this._ImgVar('Photo1').width);
            this._ImgVar('Photo2').centerX = 0;
            this._ImgVar('Photo3').centerX = 20 + this._ImgVar('Photo3').width;
        } else if (LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPO || LwgPlatform._Ues.value === LwgPlatform._Tpye.OPPOTest) {
            this._ImgVar('PhotoAds').x = this._ImgVar('BtnChoosePhotos').width / 2 - 130 * 2 - 30;
            this._ImgVar('Photo1').x = this._ImgVar('BtnChoosePhotos').width / 2 - 130 - 10;
            this._ImgVar('Photo2').x = this._ImgVar('BtnChoosePhotos').width / 2 + 10;
            this._ImgVar('Photo3').x = this._ImgVar('BtnChoosePhotos').width / 2 + 130 + 30;
        }
        this._ImgVar('Body').size(this._Owner.width - this._ImgVar('BtnChoosePhotos').x - (this._Owner.width - this._ImgVar('Hot').x) - 50, this._ImgVar('Body').height);
        this._ImgVar('BtnChoosePhotos').scale(0, 0);
        this._ImgVar('BtnSet').size(0, 0);
        this._ImgVar('Top').size(this._Owner.width - 100, this._ImgVar('Top').height);
    }
    lwgOpenAni(): number {
        const baseTime = 150;
        const baseDelay = 200;
        _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), this._ImgVar('Background'), () => {
            LwgClick._filter.value = LwgClick._filterType.all;
            LwgAni2D.scale(this._ImgVar('Top'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 1);
            LwgAni2D.scale(this._ImgVar('BtnSet'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 2);
            LwgAni2D.scale(this._ImgVar('Body'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 3);
            LwgAni2D.scale(this._ImgVar('Head'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 4);
            LwgAni2D.scale(this._ImgVar('Hot'), 0, 0, 1, 1, baseTime * 1.5, baseDelay * 5);
            LwgTools._Node.changePivot(this._ImgVar('BtnChoosePhotos'), this._ImgVar('BtnChoosePhotos').width / 2, this._ImgVar('BtnChoosePhotos').height / 2);
            LwgAni2D.bombs_Appear(this._ImgVar('BtnChoosePhotos'), 0, 1, 1.08, 0, baseTime * 2, () => {
                LwgTimer._once(300, this, () => {
                    this.BtnChoosePhotosClick();
                    !_Guide._complete.value && this._openScene('Guide', false, false, () => {
                        this._evNotify(_Guide.Event.TweetingBtnChoosePhoto, [this._ImgVar('BtnChoosePhotos')._lwg.gPoint.x, this._ImgVar('BtnChoosePhotos')._lwg.gPoint.y, this._ImgVar('Photo2')._lwg.gPoint.x + 65, this._ImgVar('Photo2')._lwg.gPoint.y + 65]);
                    })
                })
                _GameAni._fadeHint(this._ImgVar('BtnChoosePhotos').getChildByName('HintPic') as Laya.Image);
            }, baseDelay * 7);
        });
        return baseDelay * 7 + baseTime * 1.5;
    }

    BtnChoosePhotosClick(): void {
        this._btnUp(this._ImgVar('BtnChoosePhotos'), () => {
            ADManager.TAPoint(TaT.BtnClick, 'photo_choose');
            this._openScene(_SceneName.Tweeting_ChoosePhotos, false);
        }, 'null')
    }
    lwgButton(): void {
    }
    lwgCloseAni(): number {
        return 100;
    }
    lwgOnDisable(): void {
        ADManager.TAPoint(TaT.PageLeave, 'weibopage');
    }
}