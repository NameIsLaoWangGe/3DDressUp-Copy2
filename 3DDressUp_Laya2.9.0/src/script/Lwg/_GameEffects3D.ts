import { Effects3D, TimerAdmin } from "./Lwg";
import { _3D } from "./_3D";

export class _GameEffects3D {
    /**角色的服装展示,特效唯一，点击多次从头播放*/
    static _showCloth(Scene3D: Laya.Scene3D): void {
        const _changeEffectParent = this['_showClothParent'] as Laya.Sprite3D;
        if (_changeEffectParent) {
            _changeEffectParent.destroy();
        }
        var func = (): Laya.Sprite3D => { 
            let dis = 1.3;
            const interval = 5;
            const _position: [number, number, number] = [0, 0.1, 0.8];
            const _speedY: [number, number] = [0.015, 0.015];
            const _size: [[number, number, number], [number, number, number]] = [[0.06, 0.06, 0], [0.06, 0.06, 0]];
            const _parent = new Laya.Sprite3D;
            let _angelspeed = 10;
            Scene3D.addChild(_parent);
            TimerAdmin._frameNumLoop(interval, 1, this, () => {
                for (let index = 0; index < 2; index++) {
                    let angelspeed = index === 1 ? _angelspeed : -_angelspeed;
                    const caller = Effects3D._Particle._spiral(_parent, _position, _size, null, null, null, [dis, dis], _speedY, [angelspeed, angelspeed]);
                    caller.frame.func = () => {

                        Effects3D._Particle._fade(_parent, [caller.box.transform.position.x, caller.box.transform.position.y, caller.box.transform.position.z], null, 10, 0.03, 0.03);
                    }
                }
            });
            TimerAdmin._frameNumLoop(1, 15, this, () => {
                for (let index = 0; index < 1; index++) {
                    Effects3D._Particle._starsShine(_3D._Scene._ins()._Owner, [0, 0.5, 0.8], [[0, 0, 0], [0.4, 0.6, 0.4]]);
                }
            })
            return _parent;
        }
        this['_showClothParent'] = func();
    }
}