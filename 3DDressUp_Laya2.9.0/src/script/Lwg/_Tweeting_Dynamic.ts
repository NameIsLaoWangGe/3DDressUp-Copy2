import ADManager, { TaT } from "../../TJ/Admanager";
import { Adaptive, Admin, Animation2D, Click, DataAdmin, DateAdmin, Dialogue, Effects2D, StorageAdmin, TimerAdmin, Tools } from "./Lwg";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _Guide } from "./_Guide";
import { _MakePattern } from "./_MakePattern";
import { _PersonalInfo } from "./_PersonalInfo";
import { _Ranking } from "./_Ranking";


export module _Tweeting_Dynamic {

    export class Tweeting_Dynamic extends Admin._SceneBase {
        baseTime = 150;
        baseDelay = 200;

        lwgOpenAni(): number {
            this._ImgVar('Photo').texture = _GameData._Tweeting._ins()._photo.arr[_GameData._Tweeting._ins()._photoIndex];
            _GameAni._dialogOpenFadeOut(this._ImgVar('Content'), null, () => {
                Animation2D.scale(this._ImgVar('Head'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                    this._closeScene('Tweeting_Main');
                    this.bodyTextAppear(() => {
                        Animation2D.scale(this._ImgVar('Middle'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                            Animation2D.scale(this._ImgVar('Bottom'), 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
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
            _GameAni._charactersEffect(Body, _GameData._Tweeting._ins()._mainBody.present, () => {
                func();
            });
        };
        replyAppear(): void {
            const twoReply = _GameData._Tweeting._ins()._reply.getTow();
            const time = 500;
            Animation2D.move(this._ImgVar('Reply1'), this._ImgVar('Reply1').x, this._ImgVar('Reply1').y - 500, time, () => {
                _GameAni._charactersEffect(this._LabelVar('Reply1Body'), twoReply[0], () => {
                    const LikeNum1 = this._ImgVar('Reply1').getChildByName('Like').getChildByName('Num') as Laya.Label;
                    const time1 = 80;
                    const unit1 = Math.round(Tools._Number.randomOneBySection(200, 5000, true) / time);
                    let textNum1 = 0;
                    TimerAdmin._frameNumLoop(1, time1, this, () => {
                        textNum1 += unit1;
                        LikeNum1.text = textNum1.toString();
                    })
                    Animation2D.move(this._LabelVar('Reply2'), this._LabelVar('Reply2').x, this._LabelVar('Reply2').y - 500, time1, () => {
                        _GameAni._charactersEffect(this._LabelVar('Reply2Body'), twoReply[1], () => {
                            const LikeNum2 = this._LabelVar('Reply2').getChildByName('Like').getChildByName('Num') as Laya.Label;
                            const unit2 = Math.round(Tools._Number.randomOneBySection(200, 5000, true) / time1);
                            let textNum1 = 0;
                            TimerAdmin._frameNumLoop(1, time1, this, () => {
                                textNum1 += unit2;
                                LikeNum2.text = textNum1.toString();
                            }, () => {
                                TimerAdmin._frameOnce(60, this, () => {
                                    this._openScene('Tweeting_GetFans', false);
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

            this._LabelVar('Brief').text = _GameData._Tweeting._ins()._brief.getOne()[0].toString();

            this._LabelVar('PlayerName').text = _PersonalInfo._name.value;
            const left = 120;
            this._ImgVar('Middle').width = this._Owner.width - 160;
            this._ImgVar('Collect').x = (this._ImgVar('Middle').width - left * 2) * 0 / 4 + left;

            _GameData._Tweeting._ins()._forwardedNum += 50;
            (this._ImgVar('Forwarded').getChildAt(0) as Laya.Label).text = _GameData._Tweeting._ins()._forwardedNum.toString();
            this._ImgVar('Forwarded').x = (this._ImgVar('Middle').width - left * 2) * 1 / 4 + left;

            _GameData._Tweeting._ins()._commentNum += 50;
            (this._ImgVar('Comment').getChildAt(0) as Laya.Label).text = _GameData._Tweeting._ins()._commentNum.toString();
            this._ImgVar('Comment').x = (this._ImgVar('Middle').width - left * 2) * 2 / 4 + left;

            _GameData._Tweeting._ins()._likeNum += 100;
            (this._ImgVar('Like').getChildAt(0) as Laya.Label).text = _GameData._Tweeting._ins()._likeNum.toString();
            this._ImgVar('Like').x = (this._ImgVar('Middle').width - left * 2) * 3 / 4 + left;

            this._ImgVar('Bottom').width = this._Owner.width - 160;
            const iconArr = Tools._Number.randomCountBySection(1, 20, 2);
            const twoObj = _GameData._Ranking._ins()._randomCountObj(2);
            for (let index = 0; index < 2; index++) {
                const Reply = this._ImgVar(`Reply${index + 1}`)
                const Icon1 = Reply.getChildByName('HeadIcon').getChildAt(0) as Laya.Image;
                Icon1.skin = `Game/UI/Tweeting/Head/${iconArr[index]}.jpg`;
                Reply.y += 500;
                const Body = this._LabelVar(`Reply${index + 1}Body`);
                const Time = Reply.getChildByName('Time') as Laya.Label;
                if (index == 0) {
                    Body.text = `${twoObj[0]['name']}: `;
                    Time.text = `${DateAdmin._date.month}月${DateAdmin._date.date}日    ${DateAdmin._date.hours}:${DateAdmin._date.minutes - 1 > 0 ? 0 : DateAdmin._date.minutes - 1}`;
                } else {
                    Time.text = `${DateAdmin._date.month}月${DateAdmin._date.date}日    ${DateAdmin._date.hours}:${DateAdmin._date.minutes}`;
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
}