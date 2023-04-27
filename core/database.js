import { ipcRenderer } from 'electron';

export default {
    add: list => {
        let copy = JSON.parse(JSON.stringify(list))
        return ipcRenderer.invoke('db-add', copy);
    }
}