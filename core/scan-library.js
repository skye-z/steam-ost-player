import fs from 'fs';
import { parseFile } from 'music-metadata';
import { find } from 'find-install-path';
import database from './database';

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
function analysisLibrary(date) {
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
                    item = item.replaceAll('\\\\', '\\').replace(':\\', ':\\\\');
                    libs.push(item + '\\steamapps\\music');
                }
                resolve(libs)
            }
        } catch (error) {
            reject(error);
        }
    });
}
// 查找 Steam 资源库目录
function findLibrary(steamPath) {
    return new Promise((resolve, reject) => {
        try {
            readLibraryConfig(steamPath).then(data => {
                analysisLibrary(data).then(res => resolve(res)).catch(err => reject(err));
            }).catch(err => reject(err));
        } catch (error) {
            reject(error);
        }
    });
}
// 遍历文件夹
function traverseDirectory(path) {
    try {
        return fs.readdirSync(path, { withFileTypes: true });
    } catch (error) {
        console.log('traverse directory error', error)
        return undefined;
    }
}
// 遍历游戏目录
async function traverseGame(path, directory, list) {
    try {
        // 获取文件夹下的所有文件
        let files = fs.readdirSync(path + '\\' + directory.name);
        if (files == undefined) return false;
        // 遍历文件
        for (let sub in files) {
            let name = files[sub];
            if (!name.endsWith('.flac') && !name.endsWith('.mp3')) continue;
            // 解析音乐文件
            await analysisMusic(list, path, directory.name, name)
        }
    } catch (error) {
        console.log('traverse game error', error)
    }
}
// 解析音乐文件
async function analysisMusic(list, path, game, name) {
    try {
        const metadata = await parseFile(path + '\\' + game + '\\' + name);
        const common = metadata.common;
        const format = metadata.format;
        let info = {
            // 歌曲名称
            name: common.title,
            // 专辑名称
            album: common.album,
            // 艺术家
            artist: common.artist,
            // 音频格式
            container: format.container,
            // 编解码器
            codec: format.codec,
            // 时长
            duration: format.duration,
            // 是否无损
            lossless: format.lossless,
            // 码率
            bitrate: format.bitrate,
            // 采样率
            sampleRate: format.sampleRate,
            // 位深度
            bitsPerSample: format.bitsPerSample,
            // 通道数
            channels: format.numberOfChannels
        }
        if (common.picture && common.picture.length > 0) {
            info.cover = common.picture[0];
            info.cover.data = 'data:' + info.cover.format + ';base64,' + Buffer.from(info.cover.data, 'binary').toString('base64');
        }
        info.directory = path + '\\' + game;
        info.game = game;
        info.fileName = name;
        list.push(info)
    } catch (error) {
        console.log('analysis error', error)
    }
}
// 查找 Steam 资源库目录
function scanLibrary(paths) {
    return new Promise(async (resolve, reject) => {
        let musicList = []
        try {
            // 遍历资源库
            for (let a in paths) {
                let path = paths[a];
                if (!fs.existsSync(path)) continue;
                // 获取资源库下所有文件和文件夹
                let directorys = traverseDirectory(path);
                if (directorys == undefined) continue;
                // 遍历资源库
                for (let b in directorys) {
                    let directory = directorys[b];
                    // 排除非文件夹
                    if (!directory.isDirectory()) continue;
                    await traverseGame(path, directory, musicList);
                }
            }
            // 保存数据
            database.add(musicList);
            resolve(musicList);
        } catch (error) {
            console.log('analysis error', error)
            reject('ERROR');
        }
    });
}
function sendEvent() {
    const event = new Event('library-update')
    document.dispatchEvent(event)
}

export function run() {
    return new Promise((resolve, reject) => {
        find('Steam').then(steamPath => {
            console.log('[Scan] Step1 -> Steam Install Path,', steamPath);
            findLibrary(steamPath).then(paths => {
                console.log('[Scan] Step2 -> Steam Library Path', paths);
                scanLibrary(paths).then(res => {
                    console.log('[Scan] Step3 -> Scan Library', res);
                    setTimeout(() => sendEvent(), 1000);
                    resolve(res);
                }).catch(err3 => {
                    console.error('scan music error', err3)
                    reject(err3);
                })
            }).catch(err2 => {
                console.error('find library error', err2)
                reject(err2);
            })
        }).catch(err1 => {
            console.error('find steam error', err1)
            reject(err1);
        })
    });
}