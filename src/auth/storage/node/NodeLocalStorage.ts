import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const FILE = path.join(os.tmpdir(), '.flow-sdk-storage');

export class NodeLocalStorage implements Storage {
    public length: number;

    constructor() {
        NodeLocalStorage.checkFile();
    }

    public clear(): void {
        throw new Error('Not implemented');
    }

    public getItem(key: string): any {
        const d = NodeLocalStorage.readFile();
        return d[key];
    }

    public key(): string {
        return undefined;
    }

    public removeItem(key: string): void {
        const d = NodeLocalStorage.readFile();
        delete d[key];
        NodeLocalStorage.writeFile(d);
    }

    public setItem(key: string, data: string): void {
        const d = NodeLocalStorage.readFile();
        d[key] = data;
        NodeLocalStorage.writeFile(d);
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
