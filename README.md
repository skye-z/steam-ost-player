# Steam OST Player

## 文件结构

* /basic ····················> Electron 基础脚本
* /basic/main ········> 主脚本
* /basic/main ········> 预加载脚本
* /dist ·······················> 生成产物
* /other ···················> 其他资源与脚本
* /other/build ·······> 构建所需资源文件
* /other/scripts ·····> 运行调试所需文件
* /other/version ····> 版本管理所需文件
* /page ·····················> 应用界面

## 如何定位 OST
1. 确定Steam安装位置
查询注册表
```cmd
reg query HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\Steam /v UninstallString
```
2. 从Steam安装目录读取`config\libraryfolders.vdf`
3. 从Steam库目录读取`steamapps\music\*`下的音乐

## 安装包体积优化
https://blog.csdn.net/qq_42208826/article/details/107359532