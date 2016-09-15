import {BrowserStorage} from './BrowserStorage';

let storage: Storage;
if (typeof sessionStorage !== 'undefined') {
    storage = sessionStorage;
} else if (typeof process !== 'undefined') {
    let NodeSessionStorage = require('./node/SessionStorage').SessionStorage;
    storage = new NodeSessionStorage();
}

export class SessionStorage extends BrowserStorage {

    public constructor(key?: string) {
        if (typeof storage == 'undefined') throw new ReferenceError('Local storage is not supported.');
        super(storage, key);
    }

}