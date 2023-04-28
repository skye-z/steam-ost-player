/**
 * @module preload
 */
import { find } from 'find-install-path';

export function findSteam() { return find('Steam') }
export { findLibrary } from '../../core/find-library';
export { scanLibrary } from '../../core/scan-library';
// export { play, pause, stop } from '../../core/player';
export { start, stop } from '../../core/player';
export { getList } from '../../core/database';
export { versions } from './versions';
