export declare class LocalStorage implements Storage {
    length: number;
    constructor();
    clear(): void;
    getItem(key: string): any;
    key(index: number): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
    private checkFile();
    private readFile();
    private writeFile(data);
    [key: string]: any;
    [index: number]: string;
}
