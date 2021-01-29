import { Animation2D, TimerAdmin } from "../Lwg/Lwg";
export class _GameAni {
    /**弹开*/
    static _dialogOpenPopup(Content: Laya.Sprite, Bg?: Laya.Sprite, func?: Function): number {
        Content.scene.zOrder = Laya.stage.numChildren - 1;
        const time = 100;
        const delay = 100;
        Content.scale(0.5, 0.5);
        Animation2D.bombs_Appear(Content, 0, 1, 1.2, 0, time * 3, () => {
            func && func();
        });
        if (Bg) {
            Bg.alpha = 0;
            Animation2D.fadeOut(Bg, 0, 1, 200, delay * 2);
        }
        return time * 3;
    }

    /**渐隐打开*/
    static _dialogOpenFadeOut(Content: Laya.Sprite, Bg?: Laya.Sprite, func?: Function): number {
        Bg && Animation2D.fadeOut(Bg, 0, 1, 300, 0, () => {
            func && func();
        });
        Animation2D.fadeOut(Content, 0, 1, 250, 0, () => {
            !Bg && func && func();
        });
        return 300;
    }

    /**渐隐关闭*/
    static _dialogCloseFadeOut(Content: Laya.Sprite, Bg?: Laya.Sprite, func?: Function): number {
        const time = 60;
        const delay = 100;
        Animation2D.fadeOut(Content, 1, 0, time * 3, delay * 1.5, () => {
            func && func();
        });
        Bg && Animation2D.fadeOut(Bg, 1, 0, time * 3);
        return time * 3 + delay * 1.5;
    }

    /**逐渐打字*/
    static _charactersEffect(label: Laya.Label, bodyText: string, func?: Function): void {
        for (let index = 0; index < bodyText.length; index++) {
            const char = bodyText.charAt(index);
            TimerAdmin._frameOnce(10 * index, this, () => {
                label.text += char;
                if (index == bodyText.length - 1) {
                    func && func();
                }
            })
        }
    }

    /**放大缩小用于提示*/
    static _scaleHint(Node: Laya.Sprite): void {
        TimerAdmin._loop(1000, this, () => {
            Animation2D.swell_shrink(Node, 1, 1.05, 300);
        })
    }

    /**渐隐提示*/
    static _fadeHint(Node: Laya.Sprite): void {
        Animation2D.fadeOut(Node, 0, 0.6, 1500, 0, () => {
            Animation2D.fadeOut(Node, 0.6, 0, 800, 0, () => {
                TimerAdmin._frameOnce(30, this, () => {
                    this._fadeHint(Node);
                })
            })
        })
    }
}