export declare class NodeLocalStorage implements Storage {
    length: number;
    constructor();
    clear(): void;
    getItem(key: string): any;
    key(): string;
    removeItem(key: string): void;
    setItem(key: string, data: string): void;
    private static checkFile();
    private static readFile();
    private static writeFile(data);
    [key: string]: any;
    [index: number]: string;
}
