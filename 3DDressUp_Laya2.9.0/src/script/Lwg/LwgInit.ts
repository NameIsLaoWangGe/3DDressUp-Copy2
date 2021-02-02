import { LwgAdaptive, LwgScene, LwgClick, LwgPlatform, LwgSceneAni, LwgAdmin } from "./Lwg";
import PreLoadCutIn from "../Game/PreLoadCutIn";
import SubPkg from "./SubPkg";
import Guide from "../Game/Guide";
import PreLoad from "../Game/PreLoad";
import MakeTailor from "../Game/MakeTailor";
import Start from "../Game/Start";
import MakePattern from "../Game/MakePattern";
import DressingRoom from "../Game/DressingRoom";
import PersonalInfo from "../Game/PersonalInfo";
import Ranking from "../Game/Ranking";
import Tweeting_Main from "../Game/Tweeting_Main";
import Tweeting_ChoosePhotos from "../Game/Tweeting_ChoosePhotos";
import Tweeting_Dynamic from "../Game/Tweeting_Dynamic";
import Tweeting_GetFans from "../Game/Tweeting_GetFans";
import AdsHint from "../Game/AdsHint";
import CheckIn from "../Game/CheckIn";
import Share from "../Game/Share";
import BackHint from "../Game/BackHint";

export default class LwgInit extends LwgAdmin._InitScene {
    lwgOnAwake(): void {
        LwgPlatform._Ues.value = LwgPlatform._Tpye.Bytedance;
        Laya.Stat.show();
        Laya.MouseManager.multiTouchEnabled = false;
        LwgSceneAni._closeSwitch.value = true;
        LwgSceneAni._Use.value = {
            class: LwgSceneAni._shutters.Close,
            type: LwgSceneAni._shutters.Close._type.random,
        };
        LwgClick._Use.value = LwgClick._Type.reduce;
        LwgAdaptive._Use.value = [1280, 720];
        LwgScene._SceneScript = {
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
            Share: Share,
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


