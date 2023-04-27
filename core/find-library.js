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
            // TODO
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