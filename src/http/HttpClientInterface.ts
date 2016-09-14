export interface RequestOptions {
    body?: string | {};
    query?: {};
    headers?: {};
    files?: {};
    formData?: {};
    timeout?: number;
    connectionTimeout?: number;
}

export interface Response {
    status: number;
    body: string;
    headers: {};
}

export interface HttpClientInterface {
    get(url: string, options?: RequestOptions): Promise<Response>
    post(url: string, options?: RequestOptions): Promise<Response>
    put(url: string, options?: RequestOptions): Promise<Response>
    options(url: string, options?: RequestOptions): Promise<any>;
    request(method: string, url: string, options?: RequestOptions): Promise<Response>
    getAuthenticationHeader(): string
    hasAuthenticationInfo(): boolean
    setAuthenticationHeader(authHeader: string): void
}