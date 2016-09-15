import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const FILE = path.join(os.tmpdir(), '.flow-sdk-storage');

export class LocalStorage implements Storage {
    length: number;

    constructor() {
        LocalStorage.checkFile();
    }

    clear(): void {
        throw new Error('Not implemented');
    }

    getItem(key: string): any {
        let d = LocalStorage.readFile();
        return d[key];
    }

    key(index: number): string {
        return undefined;
    }

    removeItem(key: string): void {
        let d = LocalStorage.readFile();
        delete d[key];
        LocalStorage.writeFile(d);
    }

    setItem(key: string, data: string): void {
        let d = LocalStorage.readFile();
        d[key] = data;
        LocalStorage.writeFile(d);
    }

    private static checkFile() {
        try {
            fs.statSync(FILE);
        } catch (err) {
            fs.writeFileSync(FILE, '{}', {mode: '600'});
        }
    }

    private static readFile() {
        return JSON.parse(<string>fs.readFileSync(FILE, {encoding: 'utf8'}));
    }

    private static writeFile(data: any) {
        fs.writeFileSync(FILE, JSON.stringify(data), {mode: 600});
    }

    [key: string]: any
    [index: number]: string;

}
