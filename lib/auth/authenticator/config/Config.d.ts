export interface IConfig {
    method: AuthMethod;
    storage: StorageMethod;
    storageKey?: string;
}
export declare const authDefaults: {
    AUTHENTICATION_HEADER: string;
    BASE_URL: string;
    AUTHORIZATION_PATH: string;
    TOKEN_PATH: string;
};
export declare enum AuthMethod {
    CLIENT = 0,
    USER_IMPLICIT = 1,
    USER_CREDENTIALS = 2,
    STATIC_KEY = 3,
}
export declare enum StorageMethod {
    COOKIE_STORAGE = 0,
    LOCAL_STORAGE = 1,
    SESSION_STORAGE = 2,
    NO_STORAGE = 3,
}
