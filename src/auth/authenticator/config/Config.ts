export interface IConfig {
    method: AuthMethod;
    storage: StorageMethod;
    storageKey?: string;
}

export const authDefaults = {
    AUTHENTICATION_HEADER: 'Authorization',

    BASE_URL: ((): string => {
        let baseUrl;
        if (process) {
            baseUrl = process.env.BASE_URL;
        } else if (window) {
            baseUrl = (<any>window).BASE_URL;
        }
        return baseUrl ? baseUrl : 'https://scandium.scandit.com';
    })(),
    AUTHORIZATION_PATH: '/api/v1/auth/oauth2/authorize',
    TOKEN_PATH: '/api/v1/auth/oauth2/token'
};

export enum AuthMethod {
    CLIENT,
    USER_IMPLICIT,
    USER_CREDENTIALS,
    STATIC_KEY,
}

export enum StorageMethod {
    COOKIE_STORAGE,
    LOCAL_STORAGE,
    SESSION_STORAGE,
    NO_STORAGE,
}
