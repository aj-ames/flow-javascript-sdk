import { IHttpClient, IRequestOptions, IResponse } from './HttpClientInterface';
export declare abstract class BaseHttpClient implements IHttpClient {
    protected authHeader: string;
    get(url: string, options?: IRequestOptions): Promise<IResponse>;
    options(url: string, options?: IRequestOptions): Promise<IResponse>;
    post(url: string, options?: IRequestOptions): Promise<IResponse>;
    put(url: string, options?: IRequestOptions): Promise<IResponse>;
    setAuthenticationHeader(authHeader: string): void;
    getAuthenticationHeader(): string;
    hasAuthenticationInfo(): boolean;
    abstract request(method: string, url: string, options?: IRequestOptions): Promise<IResponse>;
}
