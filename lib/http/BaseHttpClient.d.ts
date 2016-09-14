import { HttpClientInterface, RequestOptions, Response } from "./HttpClientInterface";
export declare abstract class BaseHttpClient implements HttpClientInterface {
    protected authHeader: string;
    get(url: string, options?: RequestOptions): Promise<Response>;
    options(url: string, options?: RequestOptions): Promise<Response>;
    post(url: string, options?: RequestOptions): Promise<Response>;
    put(url: string, options?: RequestOptions): Promise<Response>;
    setAuthenticationHeader(authHeader: string): void;
    getAuthenticationHeader(): string;
    hasAuthenticationInfo(): boolean;
    abstract request(method: string, url: string, options?: RequestOptions): Promise<Response>;
}
