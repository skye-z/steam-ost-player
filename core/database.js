import { ipcRenderer } from 'electron';

export function getList() {
    return ipcRenderer.invoke('db-get-list');
}

export default {
    add: list => {
        let copy = JSON.parse(JSON.stringify(list))
        return ipcRenderer.invoke('db-add', copy);
    }
}