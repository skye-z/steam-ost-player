# Steam OST Player

## 功能计划

* [x] 自动发现 Steam OST
* [x] MP3、FLAC 播放
* [x] 媒体数据解析
* [x] 自动获取封面
* [x] 后台播放
* [ ] 自定义合集
* [ ] 收藏音乐
* [ ] 频谱可视化
* [ ] 音乐风格分析


## 文件结构

* /basic ····················> Electron 基础脚本
* /basic/main ········> 主脚本
* /basic/preload ········> 预加载脚本
* /core ·······················> 核心脚本
* /core/databse.js ·······> 数据库脚本
* /core/player.js ·······> 播放器脚本
* /core/scan-library.js ·······> 扫描资源库脚本
* /core/window.js ·······> 窗口控制脚本
* /other ···················> 其他资源与脚本
* /other/build ·······> 构建所需资源文件
* /other/scripts ·····> 运行调试所需文件
* /other/version ····> 版本管理所需文件
* /page ·····················> 应用界面

## 鸣谢

* [audiomotion-analyzer](https://www.npmjs.com/package/audiomotion-analyzer): 实时音频频谱分析