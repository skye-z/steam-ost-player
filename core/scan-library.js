import fs from 'fs';
import { parseFile } from 'music-metadata';
import database from './database';
const decoder = new TextDecoder('utf8');

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
            console.log(name)
            if (!name.endsWith('.flac') && !name.endsWith('.mp3')) continue;
            // 解析音乐文件
            await analysis(list, path, directory.name, name)
        }
    } catch (error) {
        console.log('traverse game error', error)
    }
}
// 解析音乐文件
async function analysis(list, path, game, name) {
    try {
        const metadata = await parseFile(path + '\\' + game + '\\' + name);
        console.log(metadata)
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
export function scanLibrary(paths) {
    return new Promise(async (resolve, reject) => {
        let musicList = []
        try {
            // 遍历资源库
            for (let a in paths) {
                let path = paths[a];
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