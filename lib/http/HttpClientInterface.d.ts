export interface IRequestOptions {
    body?: string | {};
    query?: {};
    headers?: {};
    files?: {};
    formData?: {};
    timeout?: number;
    connectionTimeout?: number;
}
export interface IResponse {
    status: number;
    body: string;
    headers: {
        'Content-Type'?: string;
        Location?: string;
        location?: string;
    };
}
export interface IHttpClient {
    get(url: string, options?: IRequestOptions): Promise<IResponse>;
    post(url: string, options?: IRequestOptions): Promise<IResponse>;
    put(url: string, options?: IRequestOptions): Promise<IResponse>;
    options(url: string, options?: IRequestOptions): Promise<any>;
    request(method: string, url: string, options?: IRequestOptions): Promise<IResponse>;
    getAuthenticationHeader(): string;
    hasAuthenticationInfo(): boolean;
    setAuthenticationHeader(authHeader: string): void;
}
