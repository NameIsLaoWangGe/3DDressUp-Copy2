/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "landscape";

//-----libs-begin-----
require("./libs/laya.core.js")
require("./libs/laya.html.js")
require("./libs/laya.ui.js")
require("./libs/laya.d3.js")
require("./libs/laya.physics.js")
require("./libs/laya.physics3D.js")
//-----libs-end-------
require("./js/bundle.js");
require("./js/TJ.js");

