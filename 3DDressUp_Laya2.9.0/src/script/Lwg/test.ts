export class _PreLoadScene extends SceneAdmin._SceneBase {
    _ListName: _ResType = {
        $scene3D: '$scene3D',
        $prefab3D: '$prefab3D',
        $mesh3D: '$mesh3D',
        $material: '$material',
        $texture: '$texture',
        $texture2D: '$texture2D',
        $pic2D: '$pic2D',
        $scene2D: '$scene2D',
        $prefab2D: '$prefab2D',
        $json: '$json',
        $skeleton: '$skeleton',
        $effectTex2D: '$effectTex2D',
    }
    _scene3D: Array<scene3D> = [];
    _prefab3D: Array<prefab3D> = [];
    _mesh3D: Array<mesh3D> = [];
    _material: Array<material> = [];
    _texture: Array<texture> = [];
    _texture2D: Array<texture2D> = [];
    _pic2D: Array<pic2D> = [];
    _scene2D: Array<scene2D> = [];
    _prefab2D: Array<prefab2D> = [];
    _json: Array<json> = [];
    _skeleton: Array<skeleton> = [];
    _effectsTex2D: Array<effectsTex2D> = [];
    /**进度条总长度,长度为以上三个加载资源类型的数组总长度*/
    _sumProgress: number = 0;
    /**加载顺序依次为3d,2d,数据表，可修改*/
    _loadOrder: Array<any> = [];
    /**当前加载到哪个分类数组*/
    _loadOrderIndex: number = 0;
    /**两种类型，页面前加载还是初始化前*/
    _loadType: string = SceneAdmin._BaseName.PreLoad;

    /**当前进度条进度,起始位0，每加载成功1个资源，则加1, this._currentProgress.value / _sumProgress为进度百分比*/
    /**获取进度条的数量值，_currentProgress.value / _sumProgress为进度百分比*/
    get _currentProgress(): number {
        return this['currentProgress'] ? this['currentProgress'] : 0;
    };
    /**设置进度条的值*/
    set _currentProgress(val: number) {
        this['currentProgress'] = val;
        if (this['currentProgress'] >= this._sumProgress) {
            if (this._sumProgress == 0) {
                return;
            }
            console.log('当前进度条进度为:', this['currentProgress'] / this._sumProgress);
            // console.log('进度条停止！');
            console.log('所有资源加载完成！此时所有资源可通过例如 Laya.loader.getRes("url")获取');
            EventAdmin._notify(PreLoadAdmin._Event.complete);
        } else {
            // 当前进度达到当前长度节点时,去到下一个数组加载
            let number = 0;
            for (let index = 0; index <= this._loadOrderIndex; index++) {
                number += this._loadOrder[index].length;
            }
            if (this['currentProgress'] == number) {
                this._loadOrderIndex++;
            }
            EventAdmin._notify(PreLoadAdmin._Event.stepLoding);
        }
    };
    moduleEvent(): void {
        EventAdmin._registerOnce(_Event.importList, this, (listObj: {}) => {
            console.log(listObj);
            listObj[this._ListName.$effectTex2D] = Eff3DAdmin._tex2D;
            for (const key in listObj) {
                if (Object.prototype.hasOwnProperty.call(listObj, key)) {
                    for (const key1 in listObj[key]) {
                        if (Object.prototype.hasOwnProperty.call(listObj[key], key1)) {
                            const obj = listObj[key][key1];
                            switch (key) {
                                case this._ListName.$json:
                                    this._json.push(obj);
                                    break;
                                case this._ListName.$material:
                                    this._material.push(obj);
                                    break;
                                case this._ListName.$mesh3D:
                                    this._mesh3D.push(obj);
                                    break;
                                case this._ListName.$pic2D:
                                    this._pic2D.push(obj);
                                    break;
                                case this._ListName.$prefab2D:
                                    this._prefab2D.push(obj);
                                    break;
                                case this._ListName.$prefab3D:
                                    this._prefab3D.push(obj);
                                    break;
                                case this._ListName.$scene2D:
                                    this._scene2D.push(obj);
                                    break;
                                case this._ListName.$scene3D:
                                    this._scene3D.push(obj);
                                    break;
                                case this._ListName.$texture2D:
                                    this._texture2D.push(obj);
                                    break;
                                case this._ListName.$skeleton:
                                    this._skeleton.push(obj);
                                    break;
                                case this._ListName.$texture:
                                    this._texture.push(obj);
                                    break;
                                case this._ListName.$effectTex2D:
                                    this._effectsTex2D.push(obj);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
            }
            this._loadOrder = [this._pic2D, this._scene2D, this._prefab2D, this._prefab3D, this._json, this._texture, this._texture2D, this._mesh3D, this._material, this._skeleton, this._scene3D, this._effectsTex2D];
            for (let index = 0; index < this._loadOrder.length; index++) {
                this._sumProgress += this._loadOrder[index].length;
                if (this._loadOrder[index].length <= 0) {
                    this._loadOrder.splice(index, 1);
                    index--;
                }
            }
            let time = this.lwgOpenAni();
            Laya.timer.once(time ? time : 0, this, () => {
                EventAdmin._notify(PreLoadAdmin._Event.stepLoding);
            })
        });
        EventAdmin._register(_Event.stepLoding, this, () => { this.start() });
        EventAdmin._registerOnce(_Event.complete, this, () => {
            Laya.timer.once(this.lwgAllComplete(), this, () => {
                console.log();
                // 页面前
                if (this._loadType !== LwgScene._BaseName.PreLoad) {
                    this._openScene(LwgScene._PreLoadCutIn.openName);
                } else {
                    AudioAdmin._playMusic();
                    this._openScene(LwgScene._BaseName.Start, true, false, () => {
                        this._loadType = LwgScene._BaseName.PreLoadCutIn;
                    })
                }
            })
        });
        EventAdmin._register(_Event.progress, this, () => {
            this._currentProgress++;
            if (this._currentProgress < this._sumProgress) {
                console.log('当前进度条进度为:', this._currentProgress / this._sumProgress);
                this.lwgStepComplete();
            }
        });
    }
    moduleOnStart(): void {
        LwgScene._SceneControl[this._loadType] = this._Owner;
    }
    /**载入加载项*/
    lwgStartLoding(any: any): void {
        EventAdmin._notify(PreLoadAdmin._Event.importList, (any));
    }
    /**根据加载顺序依次加载,第一次加载将会在openAni动画结束之后*/
    private start(): void {
        if (this._loadOrder.length <= 0) {
            console.log('没有加载项');
            EventAdmin._notify(PreLoadAdmin._Event.complete);
            return;
        }
        // 已经加载过的分类数组的长度
        let alreadyPro: number = 0;
        for (let i = 0; i < this._loadOrderIndex; i++) {
            alreadyPro += this._loadOrder[i].length;
        }
        //获取到当前分类加载数组的下标 
        let index = this._currentProgress - alreadyPro;
        switch (this._loadOrder[this._loadOrderIndex]) {
            case this._pic2D:
                Laya.loader.load(this._pic2D[index].url, Laya.Handler.create(this, (any: any) => {
                    if (typeof this._pic2D[index].url === 'object') {
                        console.log(`${this._pic2D[index]} 数组加载完成，为数组对象，只能从getRes（url）中逐个获取`)
                    } else {
                        if (any == null) {
                            console.log('XXXXXXXXXXX2D资源' + this._pic2D[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                        } else {
                            console.log('2D图片' + this._pic2D[index] + '加载完成！', '数组下标为：', index);
                        }
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;

            case this._scene2D:
                Laya.loader.load(this._scene2D[index].url, Laya.Handler.create(this, (any: Laya.Scene) => {
                    // 如果是数组则不会赋值,只能从getRes中获取
                    if (typeof this._scene2D[index].url === 'object') {
                        console.log(`${this._scene2D[index].url} 数组加载完成，为数组对象，只能从getRes（url）中逐个获取`)
                    } else {
                        if (any == null) {
                            console.log('XXXXXXXXXXX2D场景' + this._scene2D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                        } else {
                            console.log('2D场景' + this._scene2D[index].url + '加载完成！', '数组下标为：', index);
                        }
                    }
                    EventAdmin._notify(_Event.progress);
                }), null, Laya.Loader.JSON);
                break;

            case this._scene3D:
                Laya.Scene3D.load(this._scene3D[index].url, Laya.Handler.create(this, (Scene3D: Laya.Scene3D) => {
                    if (Scene3D == null) {
                        console.log('XXXXXXXXXXX3D场景' + this._scene3D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                    } else {
                        this._scene3D[index].scene3D = Scene3D;
                        console.log('3D场景' + this._scene3D[index].url + '加载完成！', '数组下标为：', index);
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;

            case this._prefab3D:
                Laya.Sprite3D.load(this._prefab3D[index].url, Laya.Handler.create(this, (Sp3D: Laya.Sprite3D) => {
                    // 如果是数组则不会赋值,只能从getRes中获取
                    if (Sp3D == null) {
                        console.log('XXXXXXXXXXX3D预设体' + this._prefab3D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                    } else {
                        this._prefab3D[index].prefab3D = Sp3D;
                        console.log('3D预制体' + this._prefab3D[index].url + '加载完成！', '数组下标为：', index);
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;

            case this._mesh3D:
                Laya.Mesh.load(this._mesh3D[index].url, Laya.Handler.create(this, (Mesh3D: Laya.Mesh) => {
                    if (Mesh3D == null) {
                        console.log('XXXXXXXXXXX3D网格' + this._mesh3D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                    } else {
                        this._mesh3D[index].mesh3D = Mesh3D;
                        console.log('3D网格' + this._mesh3D[index].url + '加载完成！', '数组下标为：', index);
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;

            case this._texture:
                Laya.loader.load(this._texture[index].url, Laya.Handler.create(this, (tex: Laya.Texture) => {
                    // 如果是数组则不会赋值,只能从getRes中获取
                    if (typeof this._texture[index].url === 'object') {
                        console.log(`${this._texture[index]} 数组加载完成，为数组对象，只能从getRes（url）中逐个获取`)
                    } else {
                        if (tex == null) {
                            console.log('XXXXXXXXXXX2D纹理' + this._texture[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                        } else {
                            this._texture[index].texture = tex;
                            console.log('纹理' + this._texture[index].url + '加载完成！', '数组下标为：', index);
                        }
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;

            case this._texture2D:
                //加载纹理资源
                Laya.Texture2D.load(this._texture2D[index].url, Laya.Handler.create(this, (tex2D: Laya.Texture2D) => {
                    if (tex2D == null) {
                        console.log('XXXXXXXXXXX2D纹理' + this._texture2D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                    } else {
                        this._texture2D[index].texture2D = tex2D;
                        console.log('3D纹理' + this._texture2D[index].url + '加载完成！', '数组下标为：', index);
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;
            case this._effectsTex2D:
                //加载纹理资源
                Laya.Texture2D.load(this._effectsTex2D[index].url, Laya.Handler.create(this, (tex2D: Laya.Texture2D) => {
                    if (tex2D == null) {
                        console.log('XXXXXXXXXXX3D纹理' + this._effectsTex2D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                    } else {
                        this._effectsTex2D[index].texture2D = tex2D;
                        console.log('3D纹理' + this._effectsTex2D[index].url + '加载完成！', '数组下标为：', index);
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;

            case this._material:
                Laya.Material.load(this._material[index].url, Laya.Handler.create(this, (Material: Laya.Material) => {
                    // 如果是数组则不会赋值,只能从getRes中获取
                    if (Material == null) {
                        console.log('XXXXXXXXXXX材质' + this._material[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                    } else {
                        this._material[index].material = Material;
                        console.log('材质' + this._material[index].url + '加载完成！', '数组下标为：', index);
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;

            case this._json:
                Laya.loader.load(this._json[index].url, Laya.Handler.create(this, (Json: {}) => {
                    // 如果是数组则不会赋值,只能从getRes中获取
                    if (typeof this._json[index].url === 'object') {
                        console.log(`${this._json[index]} 数组加载，完成，为数组对象，只能从getRes（url）中逐个获取`)
                    } else {
                        if (Json == null) {
                            console.log('XXXXXXXXXXX数据表' + this._json[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                        } else {
                            this._json[index].dataArr = Json["RECORDS"];
                            console.log('数据表' + this._json[index].url + '加载完成！', '数组下标为：', index);
                        }
                    }
                    EventAdmin._notify(_Event.progress);
                }), null, Laya.Loader.JSON);
                break;

            case this._skeleton:
                this._skeleton[index].templet.on(Laya.Event.ERROR, this, () => {
                    console.log('XXXXXXXXXXX骨骼动画' + this._skeleton[index] + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                    EventAdmin._notify(_Event.progress);
                });
                this._skeleton[index].templet.on(Laya.Event.COMPLETE, this, () => {
                    console.log('骨骼动画', this._skeleton[index].templet.url, '加载完成！', '数组下标为：', index);
                    EventAdmin._notify(_Event.progress);
                });
                this._skeleton[index].templet.loadAni(this._skeleton[index].url);
                break;

            case this._prefab2D:
                Laya.loader.load(this._prefab2D[index].url, Laya.Handler.create(this, (prefab2d: Laya.Prefab) => {
                    // 如果是数组则不会赋值,只能从getRes中获取
                    if (typeof this._prefab2D[index].url === 'object') {
                        console.log(`${this._prefab2D[index]} 加载，完成，为数组对象，只能从getRes（url）中逐个获取`)
                    } else {
                        if (prefab2d == null) {
                            console.log('XXXXXXXXXXX2D预制体' + this._prefab2D[index].url + '加载失败！不会停止加载进程！', '数组下标为：', index, 'XXXXXXXXXXX');
                        } else {
                            let _prefab = new Laya.Prefab();
                            _prefab.json = prefab2d;
                            this._prefab2D[index].prefab2D = _prefab;
                            console.log('2D预制体' + this._prefab2D[index].url + '加载完成！', '数组下标为：', index);
                        }
                    }
                    EventAdmin._notify(_Event.progress);
                }));
                break;

            default:
                break;
        }
    }
    /**每单个资源加载成功后，进度条每次增加后的回调，第一次加载将会在openAni动画结束之后*/
    lwgStepComplete(): void { }
    /**资源全部加载完成回调,每个游戏不一样,此方法执行后，自动进入init界面，也可以延时进入*/
    lwgAllComplete(): number { return 0 };
}