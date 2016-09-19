import {BrowserStorage} from './BrowserStorage';
import {NodeSessionStorage} from './node/NodeSessionStorage';

let storage: Storage;
if (window !== undefined && window.sessionStorage !== undefined) {
    storage = window.sessionStorage;
} else if (process !== undefined) {
    storage = new NodeSessionStorage();
}

export class SessionStorage extends BrowserStorage {

    public constructor(key?: string) {
        if (storage === undefined) {
            throw new ReferenceError('Local storage is not supported.');
        }
        super(storage, key);
    }

}
