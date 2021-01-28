import { StorageAdmin } from "./Lwg";

export module LwgOPPO {
    /**
     * 通过截屏比例截屏，这样不必考虑画布带来的屏幕缩放 
     * @param {Function} [func] 成功回调,成功后会返回信息data,data['tempFilePath']为图片路径
     * @param {number} [startXRatio] startXRatio偏移比例0~1，截屏画布的坐标并不是stage坐标，所以尽量截屏后再做大小位置处理，否则可能出问题
     * @param {number} [startYRatio] startYRatio偏移比例0~1，截屏画布的坐标并不是stage坐标，所以尽量截屏后再做大小位置处理，否则可能出问题
     * @param {number} [endXRatio] endXRatio偏移0~1，截图到某个X比例位置，截屏画布的坐标并不是stage坐标，所以尽量截屏后再做大小位置处理，否可能出问题
     * @param {number} [endYRatio] endYRatio偏移0~1，截图到某个Y比例位置，截屏画布的坐标并不是stage坐标，所以尽量截屏后再做大小位置处理，否则可能出问题
     * @param {string} fileType 类型jpg,png
     * @param {string} quality 质量0-1;
     */
    export function _screenShootByRatio(func?: Function, startXRatio?: number, startYRatio?: number, endXRatio?: number, endYRatio?: number, fileType?: string, quality?: number) {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', window['__canvas'].width, window['__canvas'].height);

            const _startXRatio = startXRatio ? startXRatio * window['__canvas'].width : 0;
            const _startYRatio = startYRatio ? startYRatio * window['__canvas'].height : 0;

            window['__canvas'].toTempFilePath(
                {
                    x: _startXRatio,
                    y: _startYRatio,
                    width: endXRatio ? endXRatio * window['__canvas'].width - _startXRatio : window['__canvas'].width,
                    height: endYRatio ? endYRatio * window['__canvas'].height - _startYRatio : window['__canvas'].height,
                    // destWidth: window['__canvas'].width,
                    // destHeight:window['__canvas'].height,
                    fileType: fileType ? fileType : 'png',
                    quality: quality ? quality : 1,
                    success: (data: any) => {
                        func && func(data);
                        console.log('.............................截图成功', data['tempFilePath'])
                    },
                    fail: (data: any) => {
                        console.log('？？？？？？？？？？？？？？？？', data['number'])
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', data['errMsg'])
                    },
                    complete: () => { },
                }
            )
        }
    }

    /**
     *
     * @export
     * @param {Function} [func] 成功回调,成功后会返回信息data,data['tempFilePath']为图片路径
     * @param {number} [x] 起始x位置
     * @param {number} [y] 起始y位置
     * @param {number} [width] 截图宽度
     * @param {number} [height] 截图高度
     * @param {string} [fileType] 类型jpg,png
     * @param {number} [quality] 质量0-1;       
     */
    export function _screenShoot(func?: Function, x?: number, y?: number, width?: number, height?: number, fileType?: string, quality?: number) {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', window['__canvas'].width, window['__canvas'].height);
            const _x = x * Laya.stage.clientScaleX;
            const _y = y * Laya.stage.clientScaleY;
            const _width = width * Laya.stage.clientScaleX;
            const _height = height * Laya.stage.clientScaleY;
            window['__canvas'].toTempFilePath(
                {
                    x: _x,
                    y: _y,
                    width: _width,
                    height: _height,
                    // destWidth: window['__canvas'].width,
                    // destHeight:window['__canvas'].height,
                    fileType: fileType ? fileType : 'png',
                    quality: quality ? quality : 1,
                    success: (data: any) => {
                        func && func(data);
                        console.log('.............................截图成功', data['tempFilePath'])
                    },
                    fail: (data: any) => {
                        console.log('？？？？？？？？？？？？？？？？', data['number'])
                        console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', data['errMsg'])
                    },
                    complete: () => { },
                }
            )
        }
    }

    /**
     *保存图片，会自动覆盖已有文件
     * @export
     * @param {string} tempFilePath 临时写入的文件路径，如截图路径
     * @param {string} name 名称
     * @param {string} func 回调函数参数返回data，data['savedFilePath']为保存路径；
     */
    export function _picSave(tempFilePath: string, name: string, func?: Function) {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            var FileSystemManager = Laya.Browser.window.qg.getFileSystemManager();

            let data = StorageAdmin._array(name, null, [1, `${name}.png`]).value;
            let savedFilePath = Laya.Browser.window.qg.env.USER_DATA_PATH
                + data[0] + data[1];
            let _savedFilePath = Laya.Browser.window.qg.env.USER_DATA_PATH
                + (data[0] + 1) + data[1];
            // console.log('******************************************', data[0], data[1]);
            // console.log('******************************************', data);
            // console.log('******************************************', savedFilePath);
            // console.log('*****************************************', _savedFilePath);
            // 保存函数
            var save = () => {
                FileSystemManager.saveFile(
                    {
                        tempFilePath: tempFilePath,  //临时写入的文件路径，如截图路径
                        filePath: _savedFilePath,
                        success: function (res: any) { //成功回调
                            console.log('-------------------------图片保存成功', res['savedFilePath']);
                            StorageAdmin._array(name).value = [data[0] + 1, data[1]];
                            func && func(res);
                        },
                        fail: function () {  //失败回调
                            console.log('xxxxxxxxxxxxxxxxxxxxxxxxx保存图片失败');
                        },
                        complete: function () { }
                    }
                )
            }
            // 判断有没有这个文件，没有这个文件就直接保存
            FileSystemManager.access({
                path: savedFilePath,
                success: () => {
                    // 有的话删除这个文件,然后再保存
                    FileSystemManager.removeSavedFile({
                        filePath: savedFilePath,
                        success: () => {
                            console.log('---------------------------删除保存的图片成功！');
                            save();
                        },
                    })
                },
                fail: () => {
                    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx没有保存这个文件！');
                    save();
                },
                complete: () => { },
            })
        }
    }

    /**
     * 获取缓存的图片
     * @export
     * @param {string} name 图片名称
     * @return {*}  {string}
     */
    export function _getStoragePic(name: string): string {
        if (TJ.API.AppInfo.Channel() == TJ.Define.Channel.AppRt.OPPO_AppRt) {
            let data = StorageAdmin._array(name).value;
            // console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', data);
            // console.log('iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', data[0], data[1]);
            if (data.length > 0) {
                return Laya.Browser.window.qg.env.USER_DATA_PATH + data[0] + data[1];
            };
        }
    }
}