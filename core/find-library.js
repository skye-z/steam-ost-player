import fs from 'fs';
// 资源库目录配置文件相对路径
const configPath = '\\config\\libraryfolders.vdf';
// 读取资源库目录配置文件
function readLibraryConfig(steamPath) {
    let libraryConfigPath = steamPath + configPath;
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(libraryConfigPath, (error, data) => {
                if (error) reject(error);
                else {
                    resolve(data.toString())
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
// 解析资源库目录配置文件
function analysis(date) {
    return new Promise((resolve, reject) => {
        try {
            if (date.indexOf("path") == -1) resolve([]);
            else {
                let libs = [];
                let list = date.split('"path"');
                for (let i in list) {
                    let item = list[i];
                    if (item.indexOf('"label"') == -1) continue;
                    item = item.substring(0, item.indexOf('"label"')).trim();
                    item = item.substring(1, item.length - 1);
                    item = item.replaceAll('\\\\','\\').replace(':\\',':\\\\');
                    libs.push(item+'\\steamapps\\music');
                }
                resolve(libs)
            }
        } catch (error) {
            reject(error);
        }
    });
}
// 查找 Steam 资源库目录
export function findLibrary(steamPath) {
    return new Promise((resolve, reject) => {
        try {
            readLibraryConfig(steamPath).then(data => {
                analysis(data).then(res => resolve(res)).catch(err => reject(err));
            }).catch(err => reject(err));
        } catch (error) {
            reject(error);
        }
    });
}