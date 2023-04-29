# Steam OST Player

## 文件结构

* /basic ····················> Electron 基础脚本
* /basic/main ········> 主脚本
* /basic/main ········> 预加载脚本
* /core ·······················> 核心脚本
* /core/find-library.js ·······> 查找资源库脚本
* /core/find-steam.js ·········> 查找 Steam 安装位置脚本
* /core/scan-library.js ·······> 扫描资源库脚本
* /dist ·······················> 生成产物
* /other ···················> 其他资源与脚本
* /other/build ·······> 构建所需资源文件
* /other/scripts ·····> 运行调试所需文件
* /other/version ····> 版本管理所需文件
* /page ·····················> 应用界面

## 如何定位 OST
1. [x] 确定Steam安装位置
查询注册表
```cmd
reg query HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\Steam /v UninstallString
```
2. [x] 从Steam安装目录读取`config\libraryfolders.vdf`
3. [x] 从Steam库目录读取`steamapps\music\*`下的音乐
4. [ ] 解析音乐数据
5. [ ] 存入数据库

## 安装包体积优化
https://blog.csdn.net/qq_42208826/article/details/107359532

## 鸣谢

* [audiomotion-analyzer](https://www.npmjs.com/package/audiomotion-analyzer): 实时音频频谱分析
* [mdns](https://www.npmjs.com/package/mdns): 多播 DNS 服务(需要安装 [Bonjour SDK for Windows v3.0](https://developer.apple.com/download/all/?q=Bonjour%20SDK%20for%20Windows) )