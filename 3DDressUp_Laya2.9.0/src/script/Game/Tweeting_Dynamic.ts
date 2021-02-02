import {  LwgScene, LwgAni2D, LwgDate, LwgTimer, LwgTools } from "../Lwg/Lwg";
import { _GameAni } from "./_GameAni";
import { _PersonalInfo, _Ranking, _Tweeting } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _SceneName } from "./_SceneName";

export default class Tweeting_Dynamic extends  LwgScene._SceneBase {
    baseTime = 150;
    baseDelay = 200;

    lwgOpenAni(): number {
        this._ImgVar('Photo').texture = _Tweeting._photo.arr[_Tweeting._photoIndex];
        _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), null, () => {
            LwgAni2D.scale(this._ImgVar('Head'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                this._closeScene(_SceneName.Tweeting_Main);
                this.bodyTextAppear(() => {
                    LwgAni2D.scale(this._ImgVar('Middle'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                        LwgAni2D.scale(this._ImgVar('Bottom'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                            this.replyAppear();
                        });
                    });
                });
            });
        });
        return this.baseTime * 2 + this.baseDelay;
    }
    bodyTextAppear(func: Function): void {
        const Body = this._ImgVar('Head').getChildByName('Body') as Laya.Label;
        _GameAni._charactersEffect(Body, _Tweeting._mainBody.present, () => {
            func();
        });
    };
    replyAppear(): void {
        const twoReply = _Tweeting._reply.getTow();
        const time = 500;
        LwgAni2D.move(this._ImgVar('Reply1'), this._ImgVar('Reply1').x, this._ImgVar('Reply1').y - 500, time, () => {
            _GameAni._charactersEffect(this._LabelVar('Reply1Body'), twoReply[0], () => {
                const LikeNum1 = this._ImgVar('Reply1').getChildByName('Like').getChildByName('Num') as Laya.Label;
                const time1 = 80;
                const unit1 = Math.round(LwgTools._Number.randomOneBySection(200, 5000, true) / time);
                let textNum1 = 0;
                LwgTimer._frameNumLoop(1, time1, this, () => {
                    textNum1 += unit1;
                    LikeNum1.text = textNum1.toString();
                })
                LwgAni2D.move(this._LabelVar('Reply2'), this._LabelVar('Reply2').x, this._LabelVar('Reply2').y - 500, time1, () => {
                    _GameAni._charactersEffect(this._LabelVar('Reply2Body'), twoReply[1], () => {
                        const LikeNum2 = this._LabelVar('Reply2').getChildByName('Like').getChildByName('Num') as Laya.Label;
                        const unit2 = Math.round(LwgTools._Number.randomOneBySection(200, 5000, true) / time1);
                        let textNum1 = 0;
                        LwgTimer._frameNumLoop(1, time1, this, () => {
                            textNum1 += unit2;
                            LikeNum2.text = textNum1.toString();
                        }, () => {
                            LwgTimer._frameOnce(60, this, () => {
                                this._openScene(_SceneName.Tweeting_GetFans, false);
                            })
                        })
                    });
                })
            });
        })
    };
    lwgOnAwake(): void {

        this._ImgVar('Head').width = this._Owner.width - 160;
        const Icon = this._ImgVar('Head').getChildByName('HeadIcon').getChildAt(0) as Laya.Image;
        Icon.skin = `Game/UI/Ranking/IconSkin/Ava.png`;

        this._LabelVar('Brief').text = _Tweeting._brief.getOne()[0].toString();

        this._LabelVar('PlayerName').text = _PersonalInfo._name.value;
        const left = 120;
        this._ImgVar('Middle').width = this._Owner.width - 160;
        this._ImgVar('Collect').x = (this._ImgVar('Middle').width - left * 2) * 0 / 4 + left;

        _Tweeting._forwardedNum.value += 50;
        (this._ImgVar('Forwarded').getChildAt(0) as Laya.Label).text = _Tweeting._forwardedNum.value.toString();
        this._ImgVar('Forwarded').x = (this._ImgVar('Middle').width - left * 2) * 1 / 4 + left;

        _Tweeting._commentNum.value += 50;
        (this._ImgVar('Comment').getChildAt(0) as Laya.Label).text = _Tweeting._commentNum.value.toString();
        this._ImgVar('Comment').x = (this._ImgVar('Middle').width - left * 2) * 2 / 4 + left;

        _Tweeting._likeNum.value += 100;
        (this._ImgVar('Like').getChildAt(0) as Laya.Label).text = _Tweeting._likeNum.value.toString();
        this._ImgVar('Like').x = (this._ImgVar('Middle').width - left * 2) * 3 / 4 + left;

        this._ImgVar('Bottom').width = this._Owner.width - 160;
        const iconArr = LwgTools._Number.randomCountBySection(1, 20, 2);
        const twoObj = _Ranking._Data._ins()._randomCountObj(2);
        for (let index = 0; index < 2; index++) {
            const Reply = this._ImgVar(`Reply${index + 1}`)
            const Icon1 = Reply.getChildByName('HeadIcon').getChildAt(0) as Laya.Image;
            Icon1.skin = `Game/UI/Tweeting/Head/${iconArr[index]}.jpg`;
            Reply.y += 500;
            const Body = this._LabelVar(`Reply${index + 1}Body`);
            const Time = Reply.getChildByName('Time') as Laya.Label;
            if (index == 0) {
                Body.text = `${twoObj[0]['name']}: `;
                Time.text = `${LwgDate._date.month}月${LwgDate._date.date}日    ${LwgDate._date.hours}:${LwgDate._date.minutes - 1 > 0 ? 0 : LwgDate._date.minutes - 1}`;
            } else {
                Time.text = `${LwgDate._date.month}月${LwgDate._date.date}日    ${LwgDate._date.hours}:${LwgDate._date.minutes}`;
                Body.text = `${twoObj[1]['name']}: `;
            }
        }
        this._ImgVar('Head').scale(0, 0);
        this._ImgVar('Middle').scale(0, 0);
        this._ImgVar('Bottom').scale(0, 0);
    }
    lwgButton(): void {
        this._btnUp(this._ImgVar('Content'), () => {
            console.log('防止穿透！')
        }, 'null');
    }
    lwgCloseAni(): number {
        return _GameAni._dialogCloseFadeOut(this._ImgVar('Content'));
    }
    lwgOnDisable(): void {
    }
}