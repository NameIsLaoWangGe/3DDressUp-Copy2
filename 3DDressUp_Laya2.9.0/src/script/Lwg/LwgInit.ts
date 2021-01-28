import { Adaptive, Admin, Click, Platform, SceneAnimation, _LwgInit, _LwgInitScene } from "./Lwg";
import { _Game } from "./_Game";
import { _Guide } from "./_Guide";
import { _PreLoad } from "./_PreLoad";
import { _PreLoadCutIn } from "./_PreLoadCutIn";
import { _Start } from "./_Start";
import { _MakeUp } from "./_MakeUp";
import { _MakeTailor } from "./_MakeTailor";
import { _DressingRoom } from "./_DressingRoom";
import { _MakePattern } from "./_MakePattern";
import { _PersonalInfo } from "./_PersonalInfo";
import { _Ranking } from "./_Ranking";
import { _Tweeting } from "./_Tweeting";
import { _AdsHint } from "./_AdsHint";
import SubPkg from "./SubpackController";
import { _BackHint } from "./_BackHint";
import { _Tweeting_Main } from "./_Tweeting_Main";
import { _Tweeting_ChoosePhotos } from "./_Tweeting_ChoosePhotos";
import { _Tweeting_Dynamic } from "./_Tweeting_Dynamic";
import { _Tweeting_GetFans } from "./_Tweeting_GetFans";
import { _CheckIn } from "./_CheckIn";
export default class LwgInit extends _LwgInitScene {
    lwgOnAwake(): void {
        // _LwgInit._pkgInfo = [
        //     { name: "res", root: "res/" },
        //     { name: "Game", root: "Game/" },
        // ];
        Platform._Ues.value = Platform._Tpye.OPPOTest;
        // Laya.Stat.show();
        SceneAnimation._closeSwitch.value = true;
        SceneAnimation._Use.value = {
            class: SceneAnimation._shutters.Close,
            type: SceneAnimation._shutters.Close._type.random,
        };
        Click._Use.value = Click._Type.reduce;
        Adaptive._Use.value = [1280, 720];
        Admin._Moudel = {
            _LwgInit: _LwgInit,
            _PreLoad: _PreLoad,
            _PreLoadCutIn: _PreLoadCutIn,
            _Guide: _Guide,
            _Start: _Start,
            _Game: _Game,
            _MakeTailor: _MakeTailor,
            _MakePattern: _MakePattern,
            _MakeUp: _MakeUp,
            _DressingRoom: _DressingRoom,
            _PersonalInfo: _PersonalInfo,
            _Ranking: _Ranking,
            _Tweeting: _Tweeting,
            _BackHint: _BackHint,
            _Tweeting_Main: _Tweeting_Main,
            _Tweeting_ChoosePhotos: _Tweeting_ChoosePhotos,
            _Tweeting_Dynamic: _Tweeting_Dynamic,
            _Tweeting_GetFans: _Tweeting_GetFans,
            _AdsHint: _AdsHint,
            _CheckIn: _CheckIn,
        };
    }
    lwgOnStart(): void {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            let subPkg = new SubPkg();
            subPkg.init();
            this._Owner.close();
        } else {
            this._openScene('PreLoad');
        }
        // new ZJADMgr();
    }
}


