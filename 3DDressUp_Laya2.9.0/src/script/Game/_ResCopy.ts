type _ResType = {
    /**3D场景的加载，其他3D物体，贴图，Mesh详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
    _scene3D?: Array<{ url: string, scene: Laya.Scene3D }>;
    /**3D预设的加载，其他3D物体，贴图，Mesh详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
    _prefab3D?: Array<{ url: string, prefab3D: Laya.Sprite3D }>;
    /**模型网格详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
    _mesh3D?: Array<{ url: string, mesh3D: Laya.Mesh }>;
    /**材质详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
    _material?: Array<{ url: string, material: Laya.Material }>;
    /**2D纹理*/
    _texture?: Array<{ url: string, texture: Laya.Texture }>;
    /**3D纹理加载详见：  https://ldc2.layabox.com/doc/?nav=zh-ts-4-3-1   */
    _texture2D?: Array<{ url: string, texture2D: Laya.Texture2D }>;
    /**需要加载的图片资源列表,一般是界面的图片*/
    _pic2D?: Array<string>;
    /**2D场景*/
    _scene2D?: Array<string>;
    /**2D预制体*/
    _prefab2D?: Array<{ url: string, prefab2D: Laya.Prefab }>;
    /**数据表、场景和预制体的加载，在框架中，json数据表为必须加载的项目*/
    _json?: Array<{ url: string, dataArr: Array<any> }>;
    /**数据表、场景和预制体的加载，在框架中，json数据表为必须加载的项目*/
    _skeleton?: Array<{ url: string, templet: Laya.Templet }>;
    /**特效列表中的tex2d*/
    _effectsTex2D?: Array<{ url: string, texture2D: Laya.Texture2D }>;
}

class _Res implements _ResType {
   
}