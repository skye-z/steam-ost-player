import { app, ipcMain } from 'electron';
import { join } from 'node:path';
import md5 from 'md5';
const path = join(app.getAppPath('userData'), 'sop.db')
const sqlite3 = require('sqlite3');
// const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(path);
console.log('database path: ' + path)

const sql = {
    check: `SELECT COUNT( 1 ) AS num FROM music WHERE name = ? AND duration = ? AND container = ?`,
    add: `INSERT INTO "main"."music" ("code", "name", "fileName", "game", "directory", "album", "artist", "container", "codec", "duration", "lossless", "bitrate", "sampleRate", "bitsPerSample", "channels", "cover") VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? );`,
    getList: `SELECT id,code,name,fileName,game,directory,album,artist,container,codec,lossless,bitrate,sampleRate FROM music`,
    getItem: `SELECT id,code,name,fileName,game,directory,album,artist,container,codec,duration,lossless,bitrate,sampleRate,bitsPerSample,channels,cover FROM music WHERE id = ?`,
}

ipcMain.handle('db-add', (_event, ...args) => {
    let list = args[0];
    return new Promise((resolve, reject) => {
        try {
            db.serialize(() => {
                for (let i in list) {
                    let item = list[i];
                    try {
                        db.get(sql.check, [item.name, item.duration, item.container], (error, row) => {
                            if (error) console.log('add music', error)
                            else if (row.num == 0) {
                                let code = md5(item.name + ':' + item.game + ':' + item.artist);
                                db.run(sql.add, [code, item.name, item.fileName, item.game, item.directory, item.album, item.artist, item.container, item.codec, item.duration, item.lossless, item.bitrate, item.sampleRate, item.bitsPerSample, item.channels, item.cover ? item.cover.data : null],
                                    err => {
                                        if (err) console.log('add music', err)
                                    });
                            }
                        })
                    } catch (err) {
                        console.log('add music', err)
                    }
                }
            });
            resolve(true);
        } catch (error) {
            console.log('database error', error)
            reject('ERROR')
        }
    });
});

ipcMain.handle('db-get-list', (_event, ...args) => {
    return new Promise((resolve, reject) => {
        try {
            db.serialize(() => {
                db.all(sql.getList, (error, row) => {
                    if (error) console.log('get music list', error)
                    else resolve(row);
                })
            });
        } catch (error) {
            console.log('database error', error)
            reject('ERROR')
        }
    });
});

init();
function init() {
    db.serialize(() => {
        db.get(`SELECT COUNT(1) as num FROM "music";`, (err, row) => {
            if (err) {
                console.log('Steam OST Player startup error')
                db.run(`CREATE TABLE "library" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "path" TEXT NOT NULL);`);
                db.run(`CREATE TABLE "music" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "code" TEXT NOT NULL, "name" TEXT NOT NULL, "fileName" TEXT NOT NULL, "game" TEXT NOT NULL, "directory" TEXT NOT NULL, "album" TEXT, "artist" TEXT, "container" TEXT, "codec" TEXT, "duration" integer, "lossless" integer, "bitrate" integer, "sampleRate" integer, "bitsPerSample" integer, "channels" integer, "cover" blob );`);
                console.log('init database');
            }
            else console.log('Steam OST Player has started and currently includes ' + row.num + ' OSTs')
        })
    });
}

export default {
    close: () => {
        try { db.close(); } catch (err) { }
    }
}