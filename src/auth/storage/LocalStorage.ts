import {BrowserStorage} from './BrowserStorage';

let storage: Storage;
if (typeof localStorage !== 'undefined') {
    storage = localStorage;
} else if (typeof process !== 'undefined') {
    let NodeLocalStorage = require("./node/LocalStorage").LocalStorage;
    storage = new NodeLocalStorage();
}

export class LocalStorage extends BrowserStorage{

    public constructor(key?: string) {
        if (typeof storage == 'undefined') throw new ReferenceError("Local storage is not supported.");
        super(storage, key);
    }

}