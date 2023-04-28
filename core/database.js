import { ipcRenderer } from 'electron';

export function getList() {
    return new Promise((resolve, reject) => {
        ipcRenderer.invoke('db-get-list').then(res => {
            let playList = {};
            for (let i in res) {
                let item = res[i];
                if (playList[item.code] == undefined) {
                    playList[item.code] = {
                        code: item.code,
                        name: item.name,
                        game: item.game,
                        cover: item.cover,
                        artist: item.artist,
                        duration: item.duration,
                        containers: [{
                            name: item.container,
                            bitrate: item.bitrate,
                            bitsPerSample: item.bitsPerSample,
                            sampleRate: item.sampleRate,
                            lossless: item.lossless,
                            path: item.directory + '\\' + item.fileName
                        }]
                    }
                } else {
                    if (playList[item.code].cover == undefined) playList[item.code].cover = item.cover
                    playList[item.code].containers.push({
                        name: item.container,
                        bitrate: item.bitrate,
                        bitsPerSample: item.bitsPerSample,
                        sampleRate: item.sampleRate,
                        lossless: item.lossless,
                        path: item.directory + '\\' + item.fileName
                    })
                }
            }
            resolve(playList)
        }).catch(err => {
            reject(err)
        })
    });
}

export default {
    add: list => {
        let copy = JSON.parse(JSON.stringify(list))
        return ipcRenderer.invoke('db-add', copy);
    }
}