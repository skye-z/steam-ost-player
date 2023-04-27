import childProcess from 'child_process';
import iconv from 'iconv-lite';
// 注册表位置
const regPath = 'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Steam';
// const regPath = 'HKLM\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\TIM';
// 代码页
const CODE_PAGE = {
    '936': 'gbk',
    '65001': 'utf-8'
};
const encoding = 'binary';
// 解码
function iconvDecode(txt, page) {
    return iconv.decode(Buffer.from(txt, encoding), page).trim();
}

// 查找 Steam 安装目录
export function findSteam() {
    return new Promise((resolve, reject) => {
        try {
            // 获取活动代码页
            childProcess.exec('chcp', function (error, stdout, _stderr) {
                if (error) reject(error);
                let page = CODE_PAGE[stdout.replace(/[^0-9]/ig, '')];
                // 从注册表查询 Steam 安装位置
                childProcess.exec(`reg query ${regPath} /v UninstallString`, { encoding }, function (error, stdout, stderr) {
                    if (error != null) {
                        stderr = iconvDecode(stderr, page);
                        console.log('find steam error: ' + stderr);
                        reject('ERROR');
                    } else {
                        // 解决乱码问题
                        stdout = iconvDecode(stdout, page);
                        // 判断是否有可用值
                        if (stdout.lastIndexOf('REG_SZ') == -1) reject('ERROR');
                        else {
                            // 截取目录地址
                            let path = stdout.substring(stdout.lastIndexOf('REG_SZ') + 6).trim();
                            path = path.substring(0,path.lastIndexOf('\\')).trim();
                            resolve(path);
                        }
                    }
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}