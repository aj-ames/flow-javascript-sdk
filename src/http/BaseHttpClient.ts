import {HttpClientInterface, RequestOptions, Response} from './HttpClientInterface';

export abstract class BaseHttpClient implements HttpClientInterface {
    protected authHeader: string;

    get(url: string, options?: RequestOptions): Promise<Response> {
        return this.request('GET', url, options);
    }

    options(url: string, options?: RequestOptions): Promise<Response> {
        return this.request('GET', url, options);
    }

    post(url: string, options?: RequestOptions): Promise<Response> {
        return this.request('POST', url, options);
    }

    put(url: string, options?: RequestOptions): Promise<Response> {
        return this.request('PUT', url, options);
    }

    setAuthenticationHeader(authHeader: string): void {
        this.authHeader =  authHeader;
    }

    getAuthenticationHeader(): string {
        return this.authHeader;
    }

    hasAuthenticationInfo(): boolean {
        return !!this.authHeader;
    }

    abstract request(method: string, url: string, options?: RequestOptions): Promise<Response>

}