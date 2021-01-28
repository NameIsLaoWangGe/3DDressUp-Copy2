import ADManager, { TaT } from "../../TJ/Admanager";
import { Adaptive, Admin, Animation2D, Click, DataAdmin, DateAdmin, Dialogue, Effects2D, StorageAdmin, TimerAdmin, Tools } from "./Lwg";
import { _GameAni } from "./_GameAni";
import { _GameData } from "./_GameData";
import { _GameEffects2D } from "./_GameEffects2D";
import { _GameEvent } from "./_GameEvent";
import { _Guide } from "./_Guide";
import { _MakePattern } from "./_MakePattern";
import { _PersonalInfo } from "./_PersonalInfo";
import { _Ranking } from "./_Ranking";

export module _Tweeting {
    let _photo = {
        arr: [],
        take: (Scene: Laya.Scene, index: number) => {
            _photo.arr[index] && (_photo.arr[index] as Laya.Texture).destroy();
            _photo.arr[index] = Scene.drawToTexture(Laya.stage.width, Laya.stage.height, 0, 0);
        },
        clear: () => {
            for (let index = 0; index < _photo.arr.length; index++) {
                const element = _photo.arr[index] as Laya.Texture;
                element && element.destroy();
            }
            _photo.arr = [];
            Laya.Resource.destroyUnusedResources();
        }
    };
    /**关注数*/
    export let _attention = {
        get value(): number {
            return StorageAdmin._num('_MakePattern/attention', null, 180).value;
        },
        set value(val: number) {
            StorageAdmin._num('_MakePattern/attention').value = val;
        }
    }
    /**完成次数*/
    export let _completeNum = {
        get value(): number {
            return StorageAdmin._num('_MakePattern/completeNum').value;
        },
        set value(val: number) {
            StorageAdmin._num('_MakePattern/completeNum').value = val;
        }
    }
    /**被分享数*/
    export let _forwarded = {
        get num(): number {
            return StorageAdmin._num('Tweeting/forwarded', null, Tools._Number.randomOneBySection(75, 125, true)).value;
        },
        set num(val: number) {
            StorageAdmin._num('Tweeting/forwarded').value = val;
        }
    }
    /**被评论数*/
    export let _comment = {
        get num(): number {
            return StorageAdmin._num('Tweeting/Comment', null, Tools._Number.randomOneBySection(100, 150, true)).value;
        },
        set num(val: number) {
            StorageAdmin._num('Tweeting/Comment').value = val;
        }
    }
    /**被点赞数*/
    export let _like = {
        get num(): number {
            return StorageAdmin._num('Tweeting/like', null, Tools._Number.randomOneBySection(200, 250, true)).value;
        },
        set num(val: number) {
            StorageAdmin._num('Tweeting/like').value = val;
        }
    }

    /**玩家简介*/
    export let _brief = {
        getThree: (): string[] => {
            return Tools._Array.randomGetOut(_brief.all, 3);
        },
        getOne: (): string[] => {
            return Tools._Array.randomGetOut(_brief.all);
        },
        all: [
            '世界很烦，但我要很可爱',
            '生活就是见招拆招',
            '忠于自己，热爱生活',
            '我很有个性，但我不想签名',
            'T^T	',
            '你最怕什么',
            '宁缺毋滥',
            '围脖红人',
            '剪裁大师',
            '剪裁王',
        ]
    }

    /**微博正文*/
    export let _mainBody = {
        getOne: (): string => {
            return Tools._Array.randomGetOne(_mainBody.all);
        },
        all: [
            '不管几岁，反正少女心万岁≧▽≦',
            '此处可爱贩卖机  24小时正常营业	',
            '欢迎光临我的手工小店，我会制作更多大家喜欢的衣服哦',
            '现在一定有个很可爱的人，在看我的这句话',
            '辛辛苦苦做了好久，结果很满意，好喜欢哦',
            '大家觉得我这套衣服怎么样',
            '闲来无事，做了一套衣服，感觉还不错',
            '我觉得吧，这次发挥的一般，下次会更好，敬请期待',
            '浮游于这个世界所产生的热能 也比不过喜欢你的热忱	',
            '时间会把对你最好的人留在最后，毕竟喜欢是一阵风，而爱是细水长流',
            '人生难免遇上些许不如意，翻过这一页就会发现生活处处有美好',
            '也许，只有制作衣服的时候，才会让自己的心静下来',
            '讲道理，我觉得我的手艺还不错，我是不是可以考虑开一家店了？',
            '技术还不太行，需要多多磨炼，再努力做几件衣服吧~',
            '今天心情好，早早地起来做衣服了，我是可爱的小裁缝~啦啦啦~',
            '给妈妈做了件衣服，妈妈说好喜欢~',
            '还有什么可以比做自己喜欢的事更加让人开心的呢~',
            '一些些自己的小设计，就可以让一件衣服焕发生机',
            '也许只是一瞬间的灵感，我将会付之于行动来实现它',
            '对于剪裁和搭配的热情，我不会输给任何人的~',
            '加油，我会成为最好的设计师的，我会爆火！~',
            '坚持不懈，认真对待自己的，努力成为最好的设计师！~',
            '感谢大家的支持，我会努力的',
        ]
    }

    /**网友回复*/
    export let _reply = {
        getTow: (): string[] => {
            return Tools._Array.randomGetOut(_reply.all, 2);
        },
        all: [
            '加油，坚持，我看好你哦',
            '好好看，我也想要',
            '那么请问在哪里可以买到呢',
            '有一说一，真的还可以',
            '感觉，你做的越来越好了',
            '我也想和你一样拥有如此灵巧的双手',
            '真的好看，加油',
            '我的天，这也太美了吧',
            'OMG，买他买他！~',
            '沙发~~',
            '点赞这条回复，你会好运连连',
            '求翻牌，你这也太美了吧',
            '太适合仙女了吧',
            '我也想学学，能教教我吗',
            '感觉你能火，坚持，加油',
            '感觉没有什么可以难倒你',
            '我想和你一样心灵手巧',
            '我的天，这是真的太好看了',
            ' U1S1，是真漂亮~',
            '我觉得你还可以更优秀~',
            '不是我杠精，你这个真的，真可以，没的杠',
            '好看是真好看，难也是真的难',
            '感觉我学不会，咋办，好美',
            '仙女穿起来也太好看了吧',
            '花痴脸~这也太美了',
            '坚持，我看好你哦，感觉你能火',
            '天哪，这也太美了吧',
        ]
    }

    export class Tweeting extends Admin._SceneBase {
        Main = {
            Owner: null as Laya.Box,
            PlayerName: null as Laya.Label,
            AttentionNum: null as Laya.Label,
            FansNum: null as Laya.Label,
            AroductionNum: null as Laya.Label,
            Publishontent: null as Laya.Label,
            BtnChoosePhotos: null as Laya.Panel,
            MainBody: null as Laya.Image,
            Body: null as Laya.Label,
            Hot: null as Laya.Image,
            Head: null as Laya.Image,
            Content: null as Laya.Image,
            Bg: null as Laya.Image,
            init: () => {
                ADManager.TAPoint(TaT.BtnShow, 'photo_choose');

                this.Main.Owner = this._BoxVar('Main');
                this.Main.Content = this.Main.Owner.getChildByName('Content') as Laya.Image;
                this.Main.Bg = this.Main.Owner.getChildByName('Bg') as Laya.Image;
                // 正文
                this.Main.MainBody = this.Main.Content.getChildByName('MainBody') as Laya.Image;
                this.Main.Body = this.Main.MainBody.getChildByName('Body') as Laya.Label;
                this.Main.Body.text = _mainBody.getOne();
                // 名字
                this._LabelVar('PlayerName').text = _PersonalInfo._name.value;
                // 玩家头部
                this.Main.Head = this.Main.Content.getChildByName('Head') as Laya.Image;
                const Icon = this.Main.Head.getChildByName('PlayerIcon').getChildByName('Icon') as Laya.Image;
                Icon.skin = `Game/UI/Ranking/IconSkin/Ava.png`;

                _attention.value += Tools._Number.randomOneInt(50, 100);
                const AttentionNum = this.Main.Head.getChildByName('AttentionNum') as Laya.Label;
                AttentionNum.text = _attention.value.toString();

                const FansNum = this.Main.Head.getChildByName('FansNum') as Laya.Label;
                FansNum.text = _GameData._Ranking._ins()._getPitchProperty(_GameData._Ranking._ins()._otherPro.fansNum);

                _completeNum.value++;
                const CompleteNum = this.Main.Head.getChildByName('CompleteNum') as Laya.Label;
                CompleteNum.text = _completeNum.value.toString();
                // 热门
                this.Main.Hot = this.Main.Content.getChildByName('Hot') as Laya.Image;
                const heatArr = Tools._Number.randomCountBySection(20, 50, 3);
                heatArr.sort();
                const briefArr = _brief.getThree();
                const iconArr = Tools._Number.randomCountBySection(1, 20, 3);
                for (let index = 0; index < 3; index++) {
                    const Rank = this.Main.Hot.getChildByName(`Rank${index + 1}`) as Laya.Box;
                    const Name = Rank.getChildByName('Name') as Laya.Label;
                    const Tag = Rank.getChildByName('Tag') as Laya.Image;
                    const Brief = Rank.getChildByName('Brief') as Laya.Label;
                    const Heat = Rank.getChildByName('Heat') as Laya.Label;
                    const Icon = Rank.getChildByName('HeadIcon').getChildByName('Icon') as Laya.Image;
                    const data = _GameData._Ranking._ins()._arr[index];
                    Name.text = data[_GameData._Ranking._ins()._property.$name];
                    Tag.skin = `Game/UI/Tweeting/Main/${index + 1}.png`;
                    Brief.text = briefArr[index];
                    Heat.text = `本周热度 ${heatArr[index]}万`;
                    Icon.skin = `Game/UI/Tweeting/Head/${iconArr[index]}.jpg`;
                }
                // 照片位置
                this.Main.BtnChoosePhotos = this.Main.Content.getChildByName('BtnChoosePhotos') as Laya.Panel;
                for (let index = 0; index < 3; index++) {
                    const element = this.Main.BtnChoosePhotos.getChildByName(`Photo${index + 1}`).getChildAt(0) as Laya.Sprite;
                    if (_photo.arr[index]) {
                        element.texture = _photo.arr[index];
                    }
                }
                this._btnUp(this.Main.BtnChoosePhotos, () => {
                    ADManager.TAPoint(TaT.BtnClick, 'photo_choose');
                    this.ChoosePhotos.init();
                    this.ChoosePhotos.open();
                }, 'null')
                this.Main.open();
            },
            open: (): void => {
                this.Main.Head.pos(this._Owner.width - (this.Main.Head.width + 57), this.Main.Head.y);
                this.Main.Head.scale(0, 0);

                this.Main.Hot.pos(this._Owner.width - (this.Main.Hot.width + 41), this.Main.Hot.y);
                this.Main.Hot.scale(0, 0);

                this.Main.BtnChoosePhotos.size(this._Owner.width - this.Main.BtnChoosePhotos.x - (this._Owner.width - this.Main.Hot.x) - 30, this.Main.BtnChoosePhotos.height);
                this.Main.BtnChoosePhotos.scale(0, 0);

                const PhotoAds = this.Main.BtnChoosePhotos.getChildByName(`Photo${'Ads'}`) as Laya.Image;
                const Photo1 = this.Main.BtnChoosePhotos.getChildByName(`Photo${1}`) as Laya.Image;
                const Photo2 = this.Main.BtnChoosePhotos.getChildByName(`Photo${2}`) as Laya.Image;
                const Photo3 = this.Main.BtnChoosePhotos.getChildByName(`Photo${3}`) as Laya.Image;
                PhotoAds.x = this.Main.BtnChoosePhotos.width / 2 - 130 * 2 - 30;
                Photo1.x = this.Main.BtnChoosePhotos.width / 2 - 130 - 10;
                Photo2.x = this.Main.BtnChoosePhotos.width / 2 + 10;
                Photo3.x = this.Main.BtnChoosePhotos.width / 2 + 130 + 30;

                this.Main.MainBody.size(this._Owner.width - this.Main.BtnChoosePhotos.x - (this._Owner.width - this.Main.Hot.x) - 50, this.Main.MainBody.height);
                this.Main.MainBody.scale(0, 0);

                this._ImgVar('BtnSet').size(0, 0);

                const Top = this.Main.Content.getChildByName('Top') as Laya.Image;
                Top.size(this._Owner.width - 100, Top.height);
                Top.scale(0, 0);
                _GameAni._dialogOpenFadeOut(this.Main.Content, null, () => {
                    Animation2D.scale(Top, 0, 0, 1, 1, this.baseTime * 1.5, this.baseDelay * 1);
                    Animation2D.scale(this._ImgVar('BtnSet'), 0, 0, 1, 1, this.baseTime * 1.5, this.baseDelay * 2);
                    Animation2D.scale(this.Main.MainBody, 0, 0, 1, 1, this.baseTime * 1.5, this.baseDelay * 3);
                    Animation2D.scale(this.Main.Head, 0, 0, 1, 1, this.baseTime * 1.5, this.baseDelay * 4);
                    Animation2D.scale(this.Main.Hot, 0, 0, 1, 1, this.baseTime * 1.5, this.baseDelay * 5);
                    Tools._Node.changePivot(this.Main.BtnChoosePhotos, this.Main.BtnChoosePhotos.width / 2, this.Main.BtnChoosePhotos.height / 2);
                    Animation2D.bombs_Appear(this.Main.BtnChoosePhotos, 0, 1, 1.08, 0, this.baseTime * 2, () => {
                        TimerAdmin._once(300, this, () => {
                            !_GameData._Guide._complete && this._openScene('Guide', false, false, () => {
                                const Photo2GP = this.Main.BtnChoosePhotos.localToGlobal(new Laya.Point(Photo2.x + 65, Photo2.y + 65));
                                const btnCP = this.Main.Content.localToGlobal(new Laya.Point(this.Main.BtnChoosePhotos.x, this.Main.BtnChoosePhotos.y));
                                this._evNotify(_GameEvent.Guide.TweetingBtnChoosePhoto, [btnCP.x, btnCP.y, Photo2GP.x, Photo2GP.y]);
                            })
                        })
                        _GameAni._fadeHint(this.Main.BtnChoosePhotos.getChildByName('HintPic') as Laya.Image);
                    }, this.baseDelay * 7);
                });
            }
        };

        baseTime = 150;
        baseDelay = 200;
        ChoosePhotos = {
            Owner: null as Laya.Box,
            Content: null as Laya.Image,
            Bg: null as Laya.Image,
            BtnSend: null as Laya.Image,
            photoIndex: 0,
            init: () => {

                this.ChoosePhotos.Owner = this._BoxVar('ChoosePhotos');
                this.ChoosePhotos.Content = this.ChoosePhotos.Owner.getChildByName('Content') as Laya.Image;
                this.ChoosePhotos.Bg = this.ChoosePhotos.Owner.getChildByName('Bg') as Laya.Image;
                this.ChoosePhotos.BtnSend = this.ChoosePhotos.Content.getChildByName('BtnSend') as Laya.Image;

                const photoArr = [this.ChoosePhotos.Content.getChildByName(`Photo${1}`), this.ChoosePhotos.Content.getChildByName(`Photo${2}`), this.ChoosePhotos.Content.getChildByName(`Photo${3}`)]

                for (let index = 0; index < photoArr.length; index++) {
                    const element = photoArr[index] as Laya.Sprite;
                    const Pic = element.getChildByName('Pic') as Laya.Sprite;
                    if (_photo.arr[index]) {
                        Pic.texture = _photo.arr[index];
                    }
                    this._btnUp(element, () => {
                        for (let index = 0; index < photoArr.length; index++) {
                            const _element = photoArr[index] as Laya.Image;
                            const Tick = _element.getChildByName('Tick') as Laya.Image;
                            if (element == _element) {
                                _element.scale(1.05, 1.05);
                                this.ChoosePhotos.photoIndex = index;
                                Tick.visible = true;

                                const gPBtnSend = this.ChoosePhotos.Content.localToGlobal(new Laya.Point(this.ChoosePhotos.BtnSend.x, this.ChoosePhotos.BtnSend.y));
                                !_GameData._Guide._complete && this._evNotify(_GameEvent.Guide.TweetingBtnSend, [gPBtnSend.x, gPBtnSend.y]);

                            } else {
                                _element.scale(1, 1);
                                Tick.visible = false;
                            }
                        }
                        this.ChoosePhotos.BtnSend.skin = 'Game/UI/Tweeting/ChoosePhotos/anniu_fasong.png';
                    }, 'null')
                }
                this._btnUp(this.ChoosePhotos.BtnSend, () => {
                    if (this.ChoosePhotos.BtnSend.skin == 'Game/UI/Tweeting/ChoosePhotos/anniu_fasong.png') {
                        this.ChoosePhotos.close();
                        !_GameData._Guide._complete && this._evNotify(_GameEvent.Guide.vanishGuide);
                    } else {
                        Dialogue.createHint_Middle('还未选择照片哦！');
                    }
                })
            },
            open: () => {
                this.ChoosePhotos.Owner.visible = true;
                _GameAni._dialogOpenPopup(this.ChoosePhotos.Content, this.ChoosePhotos.Bg, () => {
                    const Photo1 = this.ChoosePhotos.Content.getChildByName(`Photo${1}`) as Laya.Image;
                    const gPPhoto1 = this.ChoosePhotos.Content.localToGlobal(new Laya.Point(Photo1.x, Photo1.y));
                    !_GameData._Guide._complete && this._evNotify(_GameEvent.Guide.TweetingChoosePhoto, [gPPhoto1.x, gPPhoto1.y]);
                });
            },
            close: () => {
                _GameAni._dialogCloseFadeOut(this.ChoosePhotos.Content, this.ChoosePhotos.Bg, () => {
                    this.ChoosePhotos.Owner.removeSelf();
                    this.Dynamic.open();
                });
            },
        };
        Dynamic = {
            Owner: null as Laya.Box,
            Content: null as Laya.Image,
            Head: null as Laya.Image,
            Photo: null as Laya.Sprite,
            Brief: null as Laya.Label,
            Body: null as Laya.Label,
            PlayerName: null as Laya.Label,

            Middle: null as Laya.Image,
            Collect: null as Laya.Image,
            Forwarded: null as Laya.Image,
            Comment: null as Laya.Image,
            Like: null as Laya.Image,

            Bottom: null as Laya.Panel,
            Reply1: null as Laya.Image,
            Reply1Body: null as Laya.Label,
            Reply2: null as Laya.Image,
            Reply2Body: null as Laya.Label,
            init: () => {
                this.Dynamic.Owner = this._BoxVar('Dynamic');
                this.Dynamic.Owner.visible = true;
                this.Dynamic.Content = this.Dynamic.Owner.getChildByName('Content') as Laya.Image;
                this.Dynamic.Head = this.Dynamic.Content.getChildByName('Head') as Laya.Image;
                this.Dynamic.Head.width = this._Owner.width - 160;
                const Icon = this.Dynamic.Head.getChildByName('HeadIcon').getChildAt(0) as Laya.Image;
                Icon.skin = `Game/UI/Ranking/IconSkin/Ava.png`;

                this.Dynamic.Photo = this.Dynamic.Head.getChildByName('Photo') as Laya.Image;
                this.Dynamic.Brief = this.Dynamic.Head.getChildByName('Brief') as Laya.Label;
                this.Dynamic.Brief.text = _brief.getOne()[0].toString();

                this.Dynamic.PlayerName = this.Dynamic.Head.getChildByName('PlayerName') as Laya.Label;
                this.Dynamic.PlayerName.text = _PersonalInfo._name.value;
                const left = 120;
                this.Dynamic.Middle = this.Dynamic.Content.getChildByName('Middle') as Laya.Image;
                this.Dynamic.Middle.width = this._Owner.width - 160;
                this.Dynamic.Collect = this.Dynamic.Middle.getChildByName('Collect') as Laya.Image;
                this.Dynamic.Collect.x = (this.Dynamic.Middle.width - left * 2) * 0 / 4 + left;

                _forwarded.num += 50;
                this.Dynamic.Forwarded = this.Dynamic.Middle.getChildByName('Forwarded') as Laya.Image;
                (this.Dynamic.Forwarded.getChildAt(0) as Laya.Label).text = _forwarded.num.toString();
                this.Dynamic.Forwarded.x = (this.Dynamic.Middle.width - left * 2) * 1 / 4 + left;

                _comment.num += 50;
                this.Dynamic.Comment = this.Dynamic.Middle.getChildByName('Comment') as Laya.Image;
                (this.Dynamic.Comment.getChildAt(0) as Laya.Label).text = _comment.num.toString();
                this.Dynamic.Comment.x = (this.Dynamic.Middle.width - left * 2) * 2 / 4 + left;

                _like.num += 100;
                this.Dynamic.Like = this.Dynamic.Middle.getChildByName('Like') as Laya.Image;
                (this.Dynamic.Like.getChildAt(0) as Laya.Label).text = _like.num.toString();
                this.Dynamic.Like.x = (this.Dynamic.Middle.width - left * 2) * 3 / 4 + left;

                this.Dynamic.Bottom = this.Dynamic.Content.getChildByName('Bottom') as Laya.Panel;
                this.Dynamic.Bottom.width = this._Owner.width - 160;
                const iconArr = Tools._Number.randomCountBySection(1, 20, 2);
                const twoObj = _GameData._Ranking._ins()._randomCountObj(2);
                for (let index = 0; index < 2; index++) {
                    const Reply = this.Dynamic.Bottom.getChildByName(`Reply${index + 1}`) as Laya.Image;
                    const Icon1 = Reply.getChildByName('HeadIcon').getChildAt(0) as Laya.Image;
                    Icon1.skin = `Game/UI/Tweeting/Head/${iconArr[index]}.jpg`;
                    Reply.y += 500;
                    const Body = Reply.getChildByName('Body') as Laya.Label;

                    const Time = Reply.getChildByName('Time') as Laya.Label;
                    if (index == 0) {
                        this.Dynamic.Reply1 = Reply;
                        Body.text = `${twoObj[0]['name']}: `;
                        Time.text = `${DateAdmin._date.month}月${DateAdmin._date.date}日    ${DateAdmin._date.hours}:${DateAdmin._date.minutes - 1 > 0 ? 0 : DateAdmin._date.minutes - 1}`;
                        this.Dynamic.Reply1Body = Body;
                    } else {
                        Time.text = `${DateAdmin._date.month}月${DateAdmin._date.date}日    ${DateAdmin._date.hours}:${DateAdmin._date.minutes}`;
                        this.Dynamic.Reply2 = Reply;
                        Body.text = `${twoObj[1]['name']}: `;
                        this.Dynamic.Reply2Body = Body;
                    }
                }
                this.Dynamic.Head.scale(0, 0);
                this.Dynamic.Middle.scale(0, 0);
                this.Dynamic.Bottom.scale(0, 0);
            },

            open: () => {
                this.Dynamic.init();
                this.Dynamic.Photo.texture = _photo.arr[this.ChoosePhotos.photoIndex];
                _GameAni._dialogOpenFadeOut(this.Dynamic.Content, null, () => {
                    Animation2D.scale(this.Dynamic.Head, 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                        this.Dynamic.bodyTextAppear(() => {
                            Animation2D.scale(this.Dynamic.Middle, 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                                Animation2D.scale(this.Dynamic.Bottom, 0, 0, 1, 1, this.baseTime * 2, this.baseDelay * 1.5, () => {
                                    this.Dynamic.replyAppear();
                                });
                            });
                        });
                    });
                });
            },
            bodyTextAppear: (func: Function) => {
                const Body = this.Dynamic.Head.getChildByName('Body') as Laya.Label;
                _GameAni._charactersEffect(Body, this.Main.Body.text, () => {
                    func();
                });
            },
            replyAppear: () => {
                const twoReply = _reply.getTow();
                const time = 500;
                Animation2D.move(this.Dynamic.Reply1, this.Dynamic.Reply1.x, this.Dynamic.Reply1.y - 500, time, () => {
                    _GameAni._charactersEffect(this.Dynamic.Reply1Body, twoReply[0], () => {
                        const LikeNum1 = this.Dynamic.Reply1.getChildByName('Like').getChildByName('Num') as Laya.Label;
                        const time1 = 80;
                        const unit1 = Math.round(Tools._Number.randomOneBySection(200, 5000, true) / time);
                        let textNum1 = 0;
                        TimerAdmin._frameNumLoop(1, time1, this, () => {
                            textNum1 += unit1;
                            LikeNum1.text = textNum1.toString();
                        })
                        Animation2D.move(this.Dynamic.Reply2, this.Dynamic.Reply2.x, this.Dynamic.Reply2.y - 500, time1, () => {
                            _GameAni._charactersEffect(this.Dynamic.Reply2Body, twoReply[1], () => {
                                const LikeNum2 = this.Dynamic.Reply2.getChildByName('Like').getChildByName('Num') as Laya.Label;
                                const unit2 = Math.round(Tools._Number.randomOneBySection(200, 5000, true) / time1);
                                let textNum1 = 0;
                                TimerAdmin._frameNumLoop(1, time1, this, () => {
                                    textNum1 += unit2;
                                    LikeNum2.text = textNum1.toString();
                                }, () => {
                                    TimerAdmin._frameOnce(60, this, () => {
                                        this.GetFans.open();
                                    })
                                })
                            });
                        })
                    });
                })
            },

            close: () => {
                _GameAni._dialogCloseFadeOut(this.Dynamic.Content, null, () => {
                    this.Dynamic.Owner.removeSelf();
                    this.GetFans.open();
                });
            },
        };
        GetFans = {
            Owner: null as Laya.Box,
            Content: null as Laya.Image,
            Bg: null as Laya.Image,
            BtnOk: null as Laya.Image,
            BtnDouble: null as Laya.Image,
            init: () => {
                ADManager.TAPoint(TaT.BtnShow, 'ADrank');

                this.GetFans.Owner = this._BoxVar('GetFans');
                this.GetFans.Owner.visible = true;
                this.GetFans.Content = this.GetFans.Owner.getChildByName('Content') as Laya.Image;
                const obj = _GameData._Ranking._ins()._getPitchObj();
                const num = Tools._Number.randomOneInt(115, 383);
                obj['fansNum'] += num;
                const FansNum = this.GetFans.Content.getChildByName('Fans').getChildByName('Num') as Laya.FontClip;
                FansNum.value = num.toString();
                this.GetFans.Bg = this.GetFans.Content.getChildByName('Bg') as Laya.Image;
                this.GetFans.BtnOk = this.GetFans.Content.getChildByName('BtnOk') as Laya.Image;
                this.GetFans.BtnDouble = this.GetFans.Content.getChildByName('BtnDouble') as Laya.Image;

                this._btnUp(this.GetFans.BtnOk, () => {
                    this.GetFans.close();
                    !_GameData._Guide._complete && this._evNotify(_GameEvent.Guide.closeGuide);
                })

                var double = () => {
                    obj['fansNum'] += num;
                    this.GetFans.close();
                    Dialogue.createHint_Middle('太厉害了，涨粉翻倍了！')
                }
                this._btnUp(this.GetFans.BtnDouble, () => {
                    if (!_GameData._Guide._complete) {
                        this._evNotify(_GameEvent.Guide.closeGuide);
                        double();
                        return;
                    }
                    ADManager.TAPoint(TaT.BtnClick, 'ADrank');
                    ADManager.ShowReward(() => {
                        double();
                    })
                })
            },
            open: () => {
                this.GetFans.init();
                _GameAni._dialogOpenPopup(this.GetFans.Content, this.GetFans.Bg, () => {
                    _GameEffects2D._interfacePointJet();
                    const gPBtnDouble = this.GetFans.Content.localToGlobal(new Laya.Point(this.GetFans.BtnDouble.x, this.GetFans.BtnDouble.y));
                    !_GameData._Guide._complete && this._evNotify(_GameEvent.Guide.TweetingBtnDoubleFans, [gPBtnDouble.x, gPBtnDouble.y]);

                    TimerAdmin._loop(2000, this, () => {
                        Animation2D.bomb_LeftRight(this.GetFans.BtnDouble, 1.1, 250);

                    }, true);
                });
            },
            close: () => {
                _GameAni._dialogCloseFadeOut(this.GetFans.Content, null, () => {
                    _Ranking._whereFrom = 'Tweeting';
                    _photo.clear();
                    _GameAni._dialogCloseFadeOut(this._Owner, null, () => {
                        this._openScene('Ranking');
                        if (!_GameData._Guide._complete) {
                            _GameData._Guide._complete = true;
                            this._evNotify(_GameEvent.Guide.StartOtherBtnClick);
                        };
                    })
                });
            },
        };

        lwgOnAwake(): void {
            ADManager.TAPoint(TaT.PageShow, 'weibopage');
            this.Main.init();
        }
        lwgCloseAni(): number {
            return 100;
        }
        lwgOnDisable(): void {
            ADManager.TAPoint(TaT.PageLeave, 'weibopage');
        }
    }
}