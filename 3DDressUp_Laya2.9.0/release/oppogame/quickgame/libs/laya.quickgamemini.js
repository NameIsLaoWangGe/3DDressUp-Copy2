window.qgMiniGame=function(e,t){"use strict";class i{static isLocalNativeFile(e){for(var t=0,i=r.nativefiles.length;t<i;t++)if(-1!=e.indexOf(r.nativefiles[t]))return!0;return!1}static getFileInfo(e){var t=e,a=i.fakeObj[t];return null==a?null:a}static read(e,a="utf8",n=null,s="",o=!1,r=""){var l;l=""==s||-1==s.indexOf("http://")&&-1==s.indexOf("https://")?e:i.getFileNativePath(e),l=t.URL.getAdptedFilePath(l),i.fs.readFile({filePath:l,encoding:a,success:function(e){null!=n&&n.runWith([0,e])},fail:function(e){e&&""!=s?i.downFiles(s,a,n,s,o,r):null!=n&&n.runWith([1])}})}static downFiles(e,t="ascii",a=null,n="",s=!1,o="",r=!0){i.wxdown({url:e,success:function(l){200===l.statusCode?i.readFile(l.tempFilePath,t,a,n,s,o,r):403===l.statusCode?null!=a&&a.runWith([0,e]):null!=a&&a.runWith([1,l])},fail:function(e){null!=a&&a.runWith([1,e])}}).onProgressUpdate(function(e){null!=a&&a.runWith([2,e.progress])})}static readFile(e,a="utf8",n=null,s="",o=!1,l="",d=!0){e=t.URL.getAdptedFilePath(e),i.fs.readFile({filePath:e,encoding:a,success:function(t){-1!=e.indexOf(r.window.qg.env.USER_DATA_PATH)||-1==e.indexOf("http://")&&-1==e.indexOf("https://")?null!=n&&n.runWith([0,t]):r.autoCacheFile||o?(null!=n&&n.runWith([0,t]),i.copyFile(e,s,null,a,d)):null!=n&&n.runWith([0,t])},fail:function(e){e&&null!=n&&n.runWith([1,e])}})}static downOtherFiles(e,t=null,a="",n=!1,s=!0){i.wxdown({url:e,success:function(e){200===e.statusCode?(r.autoCacheFile||n)&&-1==a.indexOf("qlogo.cn")&&-1==a.indexOf(".php")?(null!=t&&t.runWith([0,e.tempFilePath]),i.copyFile(e.tempFilePath,a,null,"",s)):null!=t&&t.runWith([0,e.tempFilePath]):null!=t&&t.runWith([1,e])},fail:function(e){null!=t&&t.runWith([1,e])}})}static downLoadFile(e,a="",n=null,s="ascii"){r.window.navigator.userAgent.indexOf("MiniGame")<0&&r.window.navigator.userAgent.indexOf("OPPO")<0?t.Laya.loader.load(e,n):a==t.Loader.IMAGE||a==t.Loader.SOUND?i.downOtherFiles(e,n,e,!0,!1):i.downFiles(e,s,n,e,!0,a,!1)}static copyFile(e,a,n,s="",o=!0){var l=e.split("/"),d=l[l.length-1],u=a,c=i.getFileInfo(a),h=i.getFileNativePath(d);i.fakeObj[u]={md5:d,readyUrl:a,size:0,times:t.Browser.now(),encoding:s};var f=i.getCacheUseSize();c?c.readyUrl!=a?i.fs.getFileInfo({filePath:e,success:function(t){o&&f+4194304+t.size>=52428800&&(t.size>r.minClearSize&&(r.minClearSize=t.size),i.onClearCacheRes()),i.deleteFile(e,a,n,s,t.size)},fail:function(e){null!=n&&n.runWith([1,e])}}):null!=n&&n.runWith([0]):i.fs.getFileInfo({filePath:e,success:function(t){o&&f+4194304+t.size>=52428800&&(t.size>r.minClearSize&&(r.minClearSize=t.size),i.onClearCacheRes()),i.fs.copyFile({srcPath:e,destPath:h,success:function(e){i.onSaveFile(a,d,!0,s,n,t.size)},fail:function(e){null!=n&&n.runWith([1,e])}})},fail:function(e){null!=n&&n.runWith([1,e])}})}static onClearCacheRes(){var e=r.minClearSize,t=[];for(var a in i.filesListObj)"fileUsedSize"!=a&&t.push(i.filesListObj[a]);i.sortOn(t,"times",i.NUMERIC);for(var n=0,s=1,o=t.length;s<o;s++){var l=t[s];if(n>=e)break;n+=l.size,i.deleteFile("",l.readyUrl)}}static sortOn(e,t,a=0){return a==i.NUMERIC?e.sort(function(e,i){return e[t]-i[t]}):a==(i.NUMERIC|i.DESCENDING)?e.sort(function(e,i){return i[t]-e[t]}):e.sort(function(e,i){return e[t]-i[t]})}static getFileNativePath(e){return i.fileNativeDir+"/"+e}static deleteFile(e,t="",a=null,n="",s=0){var o=i.getFileInfo(t),r=i.getFileNativePath(o.md5),l=""!=e;i.onSaveFile(t,e,l,n,a,s),i.fs.unlink({filePath:r,success:function(t){if(""!=e){var n=i.getFileNativePath(e);i.fs.copyFile({srcPath:e,destPath:n,success:function(e){},fail:function(e){null!=a&&a.runWith([1,e])}})}},fail:function(e){}})}static deleteAll(){var e=[];for(var t in i.filesListObj)"fileUsedSize"!=t&&e.push(i.filesListObj[t]);for(var a=1,n=e.length;a<n;a++){var s=e[a];i.deleteFile("",s.readyUrl)}i.filesListObj&&i.filesListObj.fileUsedSize&&(i.filesListObj.fileUsedSize=0),i.writeFilesList("",JSON.stringify({}),!1)}static onSaveFile(e,a,n=!0,s="",o=null,r=0){var l=e;if(null==i.filesListObj.fileUsedSize&&(i.filesListObj.fileUsedSize=0),n){i.getFileNativePath(a);i.filesListObj[l]={md5:a,readyUrl:e,size:r,times:t.Browser.now(),encoding:s},i.filesListObj.fileUsedSize=parseInt(i.filesListObj.fileUsedSize)+r,i.writeFilesList(l,JSON.stringify(i.filesListObj),!0),null!=o&&o.runWith([0])}else if(i.filesListObj[l]){var d=parseInt(i.filesListObj[l].size);i.filesListObj.fileUsedSize=parseInt(i.filesListObj.fileUsedSize)-d,delete i.filesListObj[l],i.writeFilesList(l,JSON.stringify(i.filesListObj),!1),null!=o&&o.runWith([0])}}static writeFilesList(e,t,a){var n=i.fileNativeDir+"/"+i.fileListName;i.fs.writeFile({filePath:n,encoding:"utf8",data:t,success:function(e){},fail:function(e){}}),!r.isZiYu&&r.isPosMsgYu&&r.window.qg.postMessage&&r.window.qg.postMessage&&r.window.qg.postMessage({url:e,data:i.filesListObj[e],isLoad:"filenative",isAdd:a})}static getCacheUseSize(){return i.filesListObj&&i.filesListObj.fileUsedSize?i.filesListObj.fileUsedSize:0}static existDir(e,t){i.fs.mkdir({dirPath:e,success:function(e){null!=t&&t.runWith([0,{data:JSON.stringify({})}])},fail:function(e){-1!=e.errMsg.indexOf("file already exists")?i.readSync(i.fileListName,"utf8",t):null!=t&&t.runWith([1,e])}})}static readSync(e,t="utf8",a=null,n=""){var s,o=i.getFileNativePath(e);try{i.fs.readFile({filePath:o,encoding:t,success:function(e){s=e.data,null!=a&&a.runWith([0,{data:s}])},fail:function(){null!=a&&a.runWith([1])}})}catch(e){null!=a&&a.runWith([1])}}static setNativeFileDir(e){i.fileNativeDir=r.window.qg.env.USER_DATA_PATH+e}}i.fs=window.qg.getFileSystemManager(),i.wxdown=window.qg.downloadFile,i.filesListObj={},i.fakeObj={},i.fileListName="layaairfiles.txt",i.ziyuFileData={},i.ziyuFileTextureData={},i.loadPath="",i.DESCENDING=2,i.NUMERIC=16;class a extends t.SoundChannel{constructor(e,t){super(),this._audio=e,this._miniSound=t,this._onEnd=a.bindToThis(this.__onEnd,this),e.onEnded(this._onEnd)}static bindToThis(e,t){return e.bind(t)}__onEnd(){if(1==this.loops)return this.completeHandler&&(t.Laya.systemTimer.once(10,this,this.__runComplete,[this.completeHandler],!1),this.completeHandler=null),this.stop(),void this.event(t.Event.COMPLETE);this.loops>0&&this.loops--,this.startTime=0,this.play()}play(){this.isStopped=!1,t.SoundManager.addChannel(this),this._audio.play()}set startTime(e){this._audio&&(this._audio.startTime=e)}set autoplay(e){this._audio.autoplay=e}get autoplay(){return this._audio.autoplay}get position(){return this._audio?this._audio.currentTime:0}get duration(){return this._audio?this._audio.duration:0}stop(){this.isStopped=!0,t.SoundManager.removeChannel(this),this.completeHandler=null,this._audio&&(this._audio.stop(),this.loop||(this._audio.offEnded(null),this._miniSound.dispose(),this._audio=null,this._miniSound=null,this._onEnd=null))}pause(){this.isStopped=!0,this._audio.pause()}get loop(){return this._audio.loop}set loop(e){this._audio.loop=e}resume(){this._audio&&(this.isStopped=!1,t.SoundManager.addChannel(this),this._audio.play())}set volume(e){this._audio&&(this._audio.volume=e)}get volume(){return this._audio?this._audio.volume:1}}class n extends t.EventDispatcher{constructor(){super(),this.loaded=!1}static _createSound(){return n._id++,r.window.qg.createInnerAudioContext()}load(e){if(n._musicAudio||(n._musicAudio=n._createSound()),i.isLocalNativeFile(e)){if(-1!=e.indexOf("http://")||-1!=e.indexOf("https://"))if(""!=i.loadPath)e=e.split(i.loadPath)[1];else{var a=""!=t.URL.rootPath?t.URL.rootPath:t.URL._basePath;""!=a&&(e=e.split(a)[1])}}else e=t.URL.formatURL(e);if(this.url=e,this.readyUrl=e,n._audioCache[this.readyUrl])this.event(t.Event.COMPLETE);else if(r.autoCacheFile&&i.getFileInfo(e))this.onDownLoadCallBack(e,0);else if(r.autoCacheFile)if(i.isLocalNativeFile(e)){var s=e;if(""!=(a=""!=t.URL.rootPath?t.URL.rootPath:t.URL._basePath)&&(e=e.split(a)[1]),e||(e=s),r.subNativeFiles&&0==r.subNativeheads.length)for(var o in r.subNativeFiles){var l=r.subNativeFiles[o];r.subNativeheads=r.subNativeheads.concat(l);for(var d=0;d<l.length;d++)r.subMaps[l[d]]=o+"/"+l[d]}if(r.subNativeFiles&&-1!=e.indexOf("/")){var u=e.split("/")[0]+"/";if(u&&-1!=r.subNativeheads.indexOf(u)){var c=r.subMaps[u];e=e.replace(u,c)}}this.onDownLoadCallBack(e,0)}else!i.isLocalNativeFile(e)&&-1==e.indexOf("http://")&&-1==e.indexOf("https://")||-1!=e.indexOf("http://usr/")?this.onDownLoadCallBack(e,0):i.downOtherFiles(encodeURI(e),t.Handler.create(this,this.onDownLoadCallBack,[e]),e);else this.onDownLoadCallBack(e,0)}onDownLoadCallBack(e,a,s=null){if(a)this.event(t.Event.ERROR);else{var o;if(r.autoCacheFile){if(s)o=s;else if(i.isLocalNativeFile(e)){var l=""!=t.URL.rootPath?t.URL.rootPath:t.URL._basePath,d=e;""==l||-1==e.indexOf("http://")&&-1==e.indexOf("https://")||(o=e.split(l)[1]),o||(o=d)}else{var u=i.getFileInfo(e);if(u&&u.md5){var c=u.md5;o=i.getFileNativePath(c)}else o=e}this.url!=t.SoundManager._bgMusic?(this._sound=n._createSound(),this._sound.src=this.url=o):(this._sound=n._musicAudio,this._sound.src=this.url=o)}else this.url!=t.SoundManager._bgMusic?(this._sound=n._createSound(),this._sound.src=e):(this._sound=n._musicAudio,this._sound.src=e);this._sound.onCanplay(n.bindToThis(this.onCanPlay,this)),this._sound.onError(n.bindToThis(this.onError,this))}}onError(e){try{console.log("-----1---------------minisound-----id:"+n._id),console.log(e)}catch(e){console.log("-----2---------------minisound-----id:"+n._id),console.log(e)}this.event(t.Event.ERROR),this._sound.offError(null)}onCanPlay(){this.loaded=!0,this.event(t.Event.COMPLETE),this._sound.offCanplay(null)}static bindToThis(e,t){return e.bind(t)}play(e=0,s=0){var o;if(this.url==t.SoundManager._bgMusic?(n._musicAudio||(n._musicAudio=n._createSound()),o=n._musicAudio):o=n._audioCache[this.readyUrl]?n._audioCache[this.readyUrl]._sound:n._createSound(),!o)return null;if(r.autoCacheFile&&i.getFileInfo(this.url)){var l=i.getFileInfo(this.url).md5;o.src=this.url=i.getFileNativePath(l)}else o.src=encodeURI(this.url);var d=new a(o,this);return d.url=this.url,d.loops=s,d.loop=0===s,d.startTime=e,d.play(),t.SoundManager.addChannel(d),d}get duration(){return this._sound.duration}dispose(){var e=n._audioCache[this.readyUrl];e&&(e.src="",e._sound&&(e._sound.destroy(),e._sound=null,e=null),delete n._audioCache[this.readyUrl]),this._sound&&(this._sound.destroy(),this._sound=null,this.readyUrl=this.url=null)}}n._id=0,n._audioCache={};class s{constructor(){}static _createInputElement(){t.Input._initInput(t.Input.area=t.Browser.createElement("textarea")),t.Input._initInput(t.Input.input=t.Browser.createElement("input")),t.Input.inputContainer=t.Browser.createElement("div"),t.Input.inputContainer.style.position="absolute",t.Input.inputContainer.style.zIndex=1e5,t.Browser.container.appendChild(t.Input.inputContainer),t.Laya.stage.on("resize",null,s._onStageResize),r.window.qg.onWindowResize&&r.window.qg.onWindowResize(function(e){}),t.SoundManager._soundClass=n,t.SoundManager._musicClass=n;var e=r.systemInfo.model,i=r.systemInfo.system;e&&-1!=e.indexOf("iPhone")&&(t.Browser.onIPhone=!0,t.Browser.onIOS=!0,t.Browser.onIPad=!0,t.Browser.onAndroid=!1),!i||-1==i.indexOf("Android")&&-1==i.indexOf("Adr")||(t.Browser.onAndroid=!0,t.Browser.onIPhone=!1,t.Browser.onIOS=!1,t.Browser.onIPad=!1)}static _onStageResize(){}static wxinputFocus(e){var i=t.Input.inputElement.target;i&&!i.editable||(r.window.qg.showKeyboard({defaultValue:i.text,maxLength:i.maxChars,multiple:i.multiline,confirmHold:!0,confirmType:i.confirmType||"done",success:function(e){},fail:function(e){}}),r.window.qg.onKeyboardComplete(function(e){r.window.qg.offKeyboardComplete();var a=e?e.value:"";i._restrictPattern&&(a=a.replace(/\u2006|\x27/g,""),i._restrictPattern.test(a)&&(a=a.replace(i._restrictPattern,""))),i.text=a,i.event(t.Event.INPUT),s.inputEnter(!0)}),r.window.qg.onKeyboardConfirm(function(e){var a=e?e.value:"";i._restrictPattern&&(a=a.replace(/\u2006|\x27/g,""),i._restrictPattern.test(a)&&(a=a.replace(i._restrictPattern,""))),i.text=a,i.event(t.Event.INPUT),s.inputEnter(!0),i.event("confirm")}),r.window.qg.onKeyboardInput(function(e){var a=e?e.value:"";i.multiline||-1==a.indexOf("\n")?(i._restrictPattern&&(a=a.replace(/\u2006|\x27/g,""),i._restrictPattern.test(a)&&(a=a.replace(i._restrictPattern,""))),i.text=a,i.event(t.Event.INPUT),s.inputEnter(!1)):s.inputEnter(!1)}))}static inputEnter(e){e&&s.hideKeyboard(),t.Input.inputElement.target&&(t.Input.inputElement.target.focus=!1)}static wxinputblur(){}static hideKeyboard(){r.window.qg.offKeyboardConfirm(),r.window.qg.offKeyboardInput(),r.window.qg.hideKeyboard({success:function(e){console.log("隐藏键盘")},fail:function(e){console.log("隐藏键盘出错:"+(e?e.errMsg:""))}})}}class o extends t.EventDispatcher{constructor(){super()}_loadResourceFilter(e,a){if(-1==a.indexOf("http://usr/")&&(-1!=a.indexOf("http://")||-1!=a.indexOf("https://")))if(""!=i.loadPath)a=a.split(i.loadPath)[1];else{var n=""!=t.URL.rootPath?t.URL.rootPath:t.URL._basePath,s=a;""!=n&&(a=a.split(n)[1]),a||(a=s)}if(r.subNativeFiles&&0==r.subNativeheads.length)for(var l in r.subNativeFiles){var d=r.subNativeFiles[l];r.subNativeheads=r.subNativeheads.concat(d);for(var u=0;u<d.length;u++)r.subMaps[d[u]]=l+"/"+d[u]}if(r.subNativeFiles&&-1!=a.indexOf("/")){var c=a.split("/")[0]+"/";if(c&&-1!=r.subNativeheads.indexOf(c)){var h=r.subMaps[c];a=a.replace(c,h)}}switch(e){case t.Loader.IMAGE:case"htmlimage":case"nativeimage":o._transformImgUrl(a,e,this);break;case t.Loader.SOUND:this._loadSound(a);break;default:this._loadResource(e,a)}}_loadSound(e){var a;if(i.isLocalNativeFile(e)){var n=""!=t.URL.rootPath?t.URL.rootPath:t.URL._basePath,s=e;""==n||-1==e.indexOf("http://")&&-1==e.indexOf("https://")||(a=e.split(n)[1]),a||(a=s),o.onDownLoadCallBack(e,this,0)}else{var r=t.URL.formatURL(e);!i.isLocalNativeFile(e)&&-1==r.indexOf("http://")&&-1==r.indexOf("https://")||-1!=r.indexOf("http://usr/")?o.onDownLoadCallBack(e,this,0):i.downOtherFiles(r,t.Handler.create(o,o.onDownLoadCallBack,[r,this]),r)}}static onDownLoadCallBack(e,a,n,s=null){if(n)a.event(t.Event.ERROR,"Load sound failed");else{var o;if(r.autoCacheFile)if(s)o=s;else if(i.isLocalNativeFile(e)){var l=""!=t.URL.rootPath?t.URL.rootPath:t.URL._basePath,d=e;""==l||-1==e.indexOf("http://")&&-1==e.indexOf("https://")||(o=e.split(l)[1]),o||(o=d)}else{var u=i.getFileInfo(e);if(u&&u.md5){var c=u.md5;o=i.getFileNativePath(c)}else o=e}e=o;var h=new t.SoundManager._soundClass;h.load(e),a.onLoaded(h)}}static bindToThis(e,t){return e.bind(t)}_loadHttpRequestWhat(e,a){var n=r.getUrlEncode(e,a);if(t.Loader.preLoadedMap[e])this.onLoaded(t.Loader.preLoadedMap[e]);else{var s=t.URL.formatURL(e);if(i.isLocalNativeFile(e)||i.getFileInfo(s)||-1!=e.indexOf("http://usr/")||-1==s.indexOf("http://")&&-1==s.indexOf("https://")||r.AutoCacheDownFile){var l=i.getFileInfo(t.URL.formatURL(e));l?(l.encoding=null==l.encoding?"utf8":l.encoding,i.readFile(i.getFileNativePath(l.md5),n,new t.Handler(o,o.onReadNativeCallBack,[e,a,this]),e)):"image"==this.type||"htmlimage"==this.type?this._transformUrl(e,a):a!=t.Loader.IMAGE&&(-1==s.indexOf("http://")&&-1==s.indexOf("https://")||i.isLocalNativeFile(e))?i.readFile(e,n,new t.Handler(o,o.onReadNativeCallBack,[e,a,this]),e):i.downFiles(encodeURI(s),n,new t.Handler(o,o.onReadNativeCallBack,[e,a,this]),s,!0)}else this._loadHttpRequest(s,a,this,this.onLoaded,this,this.onProgress,this,this.onError)}}static onReadNativeCallBack(e,i=null,a=null,n=0,s=null){var o;n?1==n&&a._loadHttpRequest(e,i,a,a.onLoaded,a,a.onProgress,a,a.onError):(o=i==t.Loader.JSON||i==t.Loader.ATLAS||i==t.Loader.PREFAB||i==t.Loader.PLF?r.getJson(s.data):i==t.Loader.XML?t.Utils.parseXMLFromString(s.data):s.data,!r.isZiYu&&r.isPosMsgYu&&i!=t.Loader.BUFFER&&r.window.wx.postMessage({url:e,data:o,isLoad:"filedata"}),a.onLoaded(o))}static _transformImgUrl(e,a,n){if(r.isZiYu)n._loadImage(e,!1);else if(i.isLocalNativeFile(e))n._loadImage(e,!1);else if(i.isLocalNativeFile(e)||i.getFileInfo(t.URL.formatURL(e)))o.onCreateImage(e,n);else{var s=t.URL.formatURL(e);-1!=e.indexOf("http://usr/")||-1==s.indexOf("http://")&&-1==s.indexOf("https://")?n._loadImage(e):r.isZiYu?n._loadImage(e):i.downOtherFiles(s,new t.Handler(o,o.onDownImgCallBack,[e,n]),s)}}static onDownImgCallBack(e,t,i,a=""){i?t.onError(null):o.onCreateImage(e,t,!1,a)}static onCreateImage(e,a,n=!1,s=""){var o;if(r.autoCacheFile)if(n)if(r.isZiYu){var l=t.URL.formatURL(e);o=i.ziyuFileTextureData[l]?i.ziyuFileTextureData[l]:e}else o=e;else if(""!=s)o=s;else{var d=i.getFileInfo(t.URL.formatURL(e)).md5;o=i.getFileNativePath(d)}else o=n?e:s;a._loadImage(o,!1)}}class r{static getJson(e){return JSON.parse(e)}static enable(){r.init(t.Laya.isWXPosMsg,t.Laya.isWXOpenDataContext)}static init(e=!1,a=!1){r._inited||(r._inited=!0,r.window=window,r.window.hasOwnProperty("qg")&&(r.window.navigator.userAgent.indexOf("OPPO")<0||(r.isZiYu=a,r.isPosMsgYu=e,r.EnvConfig={},r.isZiYu||(i.setNativeFileDir("/layaairGame"),i.existDir(i.fileNativeDir,t.Handler.create(r,r.onMkdirCallBack))),r.window.qg.getSystemInfo({success:function(e){r.systemInfo=e}}),r.window.focus=function(){},t.Laya._getUrlPath=function(){return""},t.Laya.getUrlPath=function(){return""},r.window.logtime=function(e){},r.window.alertTimeLog=function(e){},r.window.resetShareInfo=function(){},r.window.document.body.appendChild=function(){},r.EnvConfig.pixelRatioInt=0,t.Browser._pixelRatio=r.pixelRatio(),r._preCreateElement=t.Browser.createElement,t.Browser.createElement=r.createElement,t.RunDriver.createShaderCondition=r.createShaderCondition,t.Utils.parseXMLFromString=r.parseXMLFromString,t.Input._createInputElement=s._createInputElement,t.Loader.prototype._loadResourceFilter=o.prototype._loadResourceFilter,t.Loader.prototype._loadSound=o.prototype._loadSound,t.Loader.prototype._loadHttpRequestWhat=o.prototype._loadHttpRequestWhat,t.Config.useRetinalCanvas=!0,r.window.qg.onMessage&&r.window.qg.onMessage(r._onMessage))))}static _onMessage(e){switch(e.type){case"changeMatrix":t.Laya.stage.transform.identity(),t.Laya.stage._width=e.w,t.Laya.stage._height=e.h,t.Laya.stage._canvasTransform=new t.Matrix(e.a,e.b,e.c,e.d,e.tx,e.ty);break;case"display":t.Laya.stage.frameRate=e.rate||t.Stage.FRAME_FAST;break;case"undisplay":t.Laya.stage.frameRate=t.Stage.FRAME_SLEEP}"opendatacontext"==e.isLoad?e.url&&(i.ziyuFileData[e.url]=e.atlasdata,i.ziyuFileTextureData[e.imgReadyUrl]=e.imgNativeUrl):"openJsondatacontext"==e.isLoad?e.url&&(i.ziyuFileData[e.url]=e.atlasdata):"openJsondatacontextPic"==e.isLoad&&(i.ziyuFileTextureData[e.imgReadyUrl]=e.imgNativeUrl)}static getUrlEncode(e,t){return"arraybuffer"==t?"":"utf8"}static downLoadFile(e,t="",a=null,n="utf8"){i.getFileInfo(e)?null!=a&&a.runWith([0]):i.downLoadFile(e,t,a,n)}static remove(e,t=null){i.deleteFile("",e,t,"",0)}static removeAll(){i.deleteAll()}static hasNativeFile(e){return i.isLocalNativeFile(e)}static getFileInfo(e){return i.getFileInfo(e)}static getFileList(){return i.filesListObj}static exitMiniProgram(){r.window.wx.exitMiniProgram()}static onMkdirCallBack(e,t){e||(i.filesListObj=JSON.parse(t.data)),i.fakeObj=i.filesListObj}static pixelRatio(){if(!r.EnvConfig.pixelRatioInt)try{return r.systemInfo.pixelRatio=r.window.devicePixelRatio,r.EnvConfig.pixelRatioInt=r.systemInfo.pixelRatio,r.systemInfo.pixelRatio}catch(e){}return r.EnvConfig.pixelRatioInt}static createElement(e){var t;if("canvas"==e)return 1==r.idx?r.isZiYu?(t=r.window.document.createElement("canvas")).style={}:t=r.window.__canvas:t=r.window.document.createElement("canvas"),r.idx++,t;if("textarea"==e||"input"==e)return r.onCreateInput(e);if("div"==e){var i=r._preCreateElement(e);return i.contains=function(e){return null},i.removeChild=function(e){},i}return r._preCreateElement(e)}static onCreateInput(e){var t=r._preCreateElement(e);return t.focus=s.wxinputFocus,t.blur=s.wxinputblur,t.style={},t.value=0,t.parentElement={},t.placeholder={},t.type={},t.setColor=function(e){},t.setType=function(e){},t.setFontFace=function(e){},t.addEventListener=function(e){},t.contains=function(e){return null},t.removeChild=function(e){},t}static createShaderCondition(e){return function(){return this[e.replace("this.","")]}}static sendAtlasToOpenDataContext(e){if(!r.isZiYu){var i=t.Loader.getRes(t.URL.formatURL(e));if(!i)throw"传递的url没有获取到对应的图集数据信息，请确保图集已经过！";i.meta.image.split(",");if(i.meta&&i.meta.image)for(var a=i.meta.image.split(","),n=e.indexOf("/")>=0?"/":"\\",s=e.lastIndexOf(n),o=s>=0?e.substr(0,s+1):"",l=0,d=a.length;l<d;l++)a[l]=o+a[l];else a=[e.replace(".json",".png")];for(l=0;l<a.length;l++){var u=a[l];r.postInfoToContext(e,u,i)}}}static postInfoToContext(e,a,n){var s={frames:n.frames,meta:n.meta},o=a,l=i.getFileInfo(t.URL.formatURL(a));if(l)var d=l.md5,u=i.getFileNativePath(d);else u=o;if(!u)throw"获取图集的磁盘url路径不存在！";r.window.qg.postMessage&&r.window.qg.postMessage({url:e,atlasdata:s,imgNativeUrl:u,imgReadyUrl:o,isLoad:"opendatacontext"})}static sendSinglePicToOpenDataContext(e){var a=t.URL.formatURL(e),n=i.getFileInfo(a);if(n){var s=n.md5,o=i.getFileNativePath(s);e=a}else o=e;if(!o)throw"获取图集的磁盘url路径不存在！";r.window.qg.postMessage&&r.window.qg.postMessage({url:e,imgNativeUrl:o,imgReadyUrl:e,isLoad:"openJsondatacontextPic"})}static sendJsonDataToDataContext(e){if(!r.isZiYu){var i=t.Loader.getRes(e);if(!i)throw"传递的url没有获取到对应的图集数据信息，请确保图集已经过！";r.window.qg.postMessage&&r.window.qg.postMessage({url:e,atlasdata:i,isLoad:"openJsondatacontext"})}}}r._inited=!1,r.systemInfo={},r.autoCacheFile=!0,r.minClearSize=5242880,r.nativefiles=["layaNativeDir"],r.subNativeheads=[],r.subMaps=[],r.AutoCacheDownFile=!1,r.parseXMLFromString=function(e){var t;e=e.replace(/>\s+</g,"><");try{t=(new window.DOMParser).parseFromString(e,"text/xml")}catch(e){throw"需要引入xml解析库文件"}return t},r.idx=1;class l extends t.EventDispatcher{constructor(){super()}static __init__(){try{var e;if(!(e=t.Accelerator))return;e.prototype.on=l.prototype.on,e.prototype.off=l.prototype.off}catch(e){}}static startListen(e){if(l._callBack=e,!l._isListening){l._isListening=!0;try{r.window.qg.onAccelerometerChange(l.onAccelerometerChange)}catch(e){}}}static stopListen(){l._isListening=!1;try{r.window.qg.stopAccelerometer({})}catch(e){}}static onAccelerometerChange(e){var t;(t={}).acceleration=e,t.accelerationIncludingGravity=e,t.rotationRate={},null!=l._callBack&&l._callBack(t)}on(e,t,i,a=null){return super.on(e,t,i,a),l.startListen(this.onDeviceOrientationChange),this}off(e,t,i,a=!1){return this.hasListener(e)||l.stopListen(),super.off(e,t,i,a)}}l._isListening=!1;class d{_loadImage(e){if(r.isZiYu)d.onCreateImage(e,this,!0);else{var a;if(i.isLocalNativeFile(e)){if(-1==e.indexOf("http://usr/")&&(-1!=e.indexOf("http://")||-1!=e.indexOf("https://")))if(""!=i.loadPath)e=e.split(i.loadPath)[1];else{var n=""!=t.URL.rootPath?t.URL.rootPath:t.URL.basePath,s=e;""!=n&&(e=e.split(n)[1]),e||(e=s)}if(r.subNativeFiles&&0==r.subNativeheads.length)for(var o in r.subNativeFiles){var l=r.subNativeFiles[o];r.subNativeheads=r.subNativeheads.concat(l);for(var u=0;u<l.length;u++)r.subMaps[l[u]]=o+"/"+l[u]}if(r.subNativeFiles&&-1!=e.indexOf("/")){var c=e.split("/")[0]+"/";if(c&&-1!=r.subNativeheads.indexOf(c)){var h=r.subMaps[c];e=e.replace(c,h)}}}else a=!0,e=t.URL.formatURL(e);i.getFileInfo(e)?d.onCreateImage(e,this,!a):-1!=e.indexOf("http://usr/")||-1==e.indexOf("http://")&&-1==e.indexOf("https://")?d.onCreateImage(e,this,!0):r.isZiYu?d.onCreateImage(e,this,!0):i.downOtherFiles(encodeURI(e),new t.Handler(d,d.onDownImgCallBack,[e,this]),e)}}static onDownImgCallBack(e,t,i,a=""){i?t.onError(null):d.onCreateImage(e,t,!1,a)}static onCreateImage(e,a,n=!1,s=""){var o,l;if(r.autoCacheFile)if(n)if(r.isZiYu){var d=t.URL.formatURL(e);o=i.ziyuFileTextureData[d]?i.ziyuFileTextureData[d]:e}else o=e;else if(""!=s)o=s;else{var u=i.getFileInfo(e).md5;o=i.getFileNativePath(u)}else o=n?e:s;function clear(){var t=a._imgCache[e];t&&(t.onload=null,t.onerror=null,delete a._imgCache[e])}null==a._imgCache&&(a._imgCache={});var c=function(){clear(),delete i.fakeObj[e],delete i.filesListObj[e],a.event(t.Event.ERROR,"Load image failed")};if("nativeimage"==a._type){var h=function(){clear(),a.onLoaded(l)};(l=new t.Browser.window.Image).crossOrigin="",l.onload=h,l.onerror=c,l.src=o,a._imgCache[e]=l}else{var f=new t.Browser.window.Image;h=function(){(l=t.HTMLImage.create(f.width,f.height)).loadImageSource(f,!0),l._setCreateURL(e),clear(),a.onLoaded(l)},f.crossOrigin="",f.onload=h,f.onerror=c,f.src=o,a._imgCache[e]=f}}}class u{constructor(){}static __init__(){r.window.navigator.geolocation.getCurrentPosition=u.getCurrentPosition,r.window.navigator.geolocation.watchPosition=u.watchPosition,r.window.navigator.geolocation.clearWatch=u.clearWatch}static getCurrentPosition(e=null,t=null,i=null){var a;(a={}).success=function(t){null!=e&&e(t)},a.fail=t,r.window.qg.getLocation(a)}static watchPosition(e=null,i=null,a=null){var n;return u._curID++,(n={}).success=e,n.error=i,u._watchDic[u._curID]=n,t.Laya.systemTimer.loop(1e3,null,u._myLoop),u._curID}static clearWatch(e){delete u._watchDic[e],u._hasWatch()||t.Laya.systemTimer.clear(null,u._myLoop)}static _hasWatch(){var e;for(e in u._watchDic)if(u._watchDic[e])return!0;return!1}static _myLoop(){u.getCurrentPosition(u._mySuccess,u._myError)}static _mySuccess(e){var i,a={};for(i in a.coords=e,a.timestamp=t.Browser.now(),u._watchDic)u._watchDic[i].success&&u._watchDic[i].success(a)}static _myError(e){var t;for(t in u._watchDic)u._watchDic[t].error&&u._watchDic[t].error(e)}}u._watchDic={},u._curID=0;e.MiniAccelerator=l,e.MiniFileMgr=i,e.MiniImage=d,e.MiniInput=s,e.MiniLoader=o,e.MiniLocation=u,e.MiniSound=n,e.MiniSoundChannel=a,e.MiniVideo=class{constructor(e=320,t=240){this.videoend=!1,this.videourl="",this.videoW=e,this.videoH=t}static __init__(){}on(e,t,i){"loadedmetadata"==e?this.onPlayFunc=i.bind(t):"ended"==e&&(this.onEndedFunC=i.bind(t)),this.videoElement.onTimeUpdate=this.onTimeUpdateFunc.bind(this)}onTimeUpdateFunc(e){this.position=e.position,this._duration=e.duration}get duration(){return this._duration}onPlayFunction(){this.videoElement&&(this.videoElement.readyState=200),null!=this.onPlayFunc&&this.onPlayFunc()}onEndedFunction(){this.videoend=!0,null!=this.onEndedFunC&&this.onEndedFunC()}off(e,t,i){"loadedmetadata"==e?(this.onPlayFunc=i.bind(t),this.videoElement.offPlay=this.onPlayFunction.bind(this)):"ended"==e&&(this.onEndedFunC=i.bind(t),this.videoElement.offEnded=this.onEndedFunction.bind(this))}load(e){this.videoElement?this.videoElement.src=e:(this.videoElement=r.window.qg.createVideo({width:this.videoW,height:this.videoH,autoplay:!0,src:e}),this.videoElement.onPlay=this.onPlayFunction.bind(this),this.videoElement.onEnded=this.onEndedFunction.bind(this))}play(){this.videoElement&&(this.videoend=!1,this.videoElement.play())}pause(){this.videoElement&&(this.videoend=!0,this.videoElement.pause())}get currentTime(){return this.videoElement?this.videoElement.initialTime:0}set currentTime(e){this.videoElement&&(this.videoElement.initialTime=e)}get videoWidth(){return this.videoElement?this.videoElement.width:0}get videoHeight(){return this.videoElement?this.videoElement.height:0}get ended(){return this.videoend}get loop(){return!!this.videoElement&&this.videoElement.loop}set loop(e){this.videoElement&&(this.videoElement.loop=e)}get playbackRate(){return this.videoElement?this.videoElement.playbackRate:0}set playbackRate(e){this.videoElement&&(this.videoElement.playbackRate=e)}get muted(){return!!this.videoElement&&this.videoElement.muted}set muted(e){this.videoElement&&(this.videoElement.muted=e)}get paused(){return!!this.videoElement&&this.videoElement.paused}size(e,t){this.videoElement&&(this.videoElement.width=e,this.videoElement.height=t)}get x(){return this.videoElement?this.videoElement.x:0}set x(e){this.videoElement&&(this.videoElement.x=e)}get y(){return this.videoElement?this.videoElement.y:0}set y(e){this.videoElement&&(this.videoElement.y=e)}get currentSrc(){return this.videoElement.src}destroy(){this.videoElement&&this.videoElement.destroy(),this.videoElement=null,this.onEndedFunC=null,this.onPlayFunc=null,this.videoend=!1,this.videourl=null}reload(){this.videoElement&&(this.videoElement.src=this.videourl)}},e.QGMiniAdapter=r};