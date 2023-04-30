/**
 * @module preload
 */

export { run } from '../../core/scan-library';
export { player } from '../../core/player';
export { getList, getItem } from '../../core/database';
export { close } from '../../core/window';

import pkg from '../../package.json';
export function getVersion() {
    return pkg.version;
}  