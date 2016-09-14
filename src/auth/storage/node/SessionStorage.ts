export class SessionStorage implements Storage {
    private static storage: any = {};
    length: number;

    clear(): void {
        throw new Error('Not implemented');
    }

    getItem(key: string): any {
        return SessionStorage.storage[key];
    }

    key(index: number): string {
        throw new Error('Not implemented');
    }

    removeItem(key: string): void {
        delete SessionStorage.storage[key];
    }

    setItem(key: string, data: string): void {
        SessionStorage.storage[key] = data;
    }

    [key: string]: any
    [index: number]: string;

}
