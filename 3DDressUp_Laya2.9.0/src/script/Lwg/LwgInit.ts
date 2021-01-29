import { Adaptive, Admin, Click, Platform, SceneAnimation, _LwgInit, _LwgInitScene } from "./Lwg";
import PreLoadCutIn from "../Game/PreLoadCutIn";
import SubPkg from "./SubpackController";
import Guide from "../Game/Guide";
import PreLoad from "../Game/PreLoad";
import { MakeTailor } from "../Game/MakeTailor";
import Start from "../Game/Start";
import MakePattern from "../Game/MakePattern";
import DressingRoom from "../Game/DressingRoom";
import PersonalInfo from "../Game/PersonalInfo";
import Ranking from "../Game/Ranking";
import { BackHint } from "../Game/BackHint";
import Tweeting_Main from "../Game/Tweeting_Main";
import Tweeting_ChoosePhotos from "../Game/Tweeting_ChoosePhotos";
import Tweeting_Dynamic from "../Game/Tweeting_Dynamic";
import Tweeting_GetFans from "../Game/Tweeting_GetFans";
import AdsHint from "../Game/AdsHint";
import CheckIn from "../Game/CheckIn";
export default class LwgInit extends _LwgInitScene {
    lwgOnAwake(): void {
        // _LwgInit._pkgInfo = [
        //     { name: "res", root: "res/" },
        //     { name: "Game", root: "Game/" },
        // ];
        Platform._Ues.value = Platform._Tpye.OPPO;
        // Laya.Stat.show();
        SceneAnimation._closeSwitch.value = true;
        SceneAnimation._Use.value = {
            class: SceneAnimation._shutters.Close,
            type: SceneAnimation._shutters.Close._type.random,
        };
        Click._Use.value = Click._Type.reduce;
        Adaptive._Use.value = [1280, 720];
        Admin._SceneScript = {
            PreLoad: PreLoad,
            PreLoadCutIn: PreLoadCutIn,
            Guide: Guide,
            Start: Start,
            MakeTailor: MakeTailor,
            MakePattern: MakePattern,
            DressingRoom: DressingRoom,
            PersonalInfo: PersonalInfo,
            Ranking: Ranking,
            BackHint: BackHint,
            Tweeting_Main: Tweeting_Main,
            Tweeting_ChoosePhotos: Tweeting_ChoosePhotos,
            Tweeting_Dynamic: Tweeting_Dynamic,
            Tweeting_GetFans: Tweeting_GetFans,
            AdsHint: AdsHint,
            CheckIn: CheckIn,
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


