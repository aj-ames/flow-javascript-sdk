import {BrowserStorage} from './BrowserStorage';
import {NodeLocalStorage} from './node/NodeLocalStorage';

let storage: Storage;
if (window !== undefined && window.localStorage !== undefined) {
    storage = window.localStorage;
} else if (process !== undefined) {
    storage = new NodeLocalStorage();
}

export class LocalStorage extends BrowserStorage {

    public constructor(key?: string) {
        if (storage === undefined) {
            throw new ReferenceError('Local storage is not supported.');
        }
        super(storage, key);
    }
}
