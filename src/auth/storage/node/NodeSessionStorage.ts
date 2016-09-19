export class NodeSessionStorage implements Storage {
    private static storage: any = {};
    public length: number;

    public clear(): void {
        throw new Error('Not implemented');
    }

    public getItem(key: string): any {
        return NodeSessionStorage.storage[key];
    }

    public key(): string {
        throw new Error('Not implemented');
    }

    public removeItem(key: string): void {
        delete NodeSessionStorage.storage[key];
    }

    public setItem(key: string, data: string): void {
        NodeSessionStorage.storage[key] = data;
    }

    [key: string]: any
    [index: number]: string;

}
