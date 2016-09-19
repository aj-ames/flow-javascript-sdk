import {IHttpClient, IRequestOptions, IResponse} from './HttpClientInterface';

export abstract class BaseHttpClient implements IHttpClient {
    protected authHeader: string;

    // tslint:disable-next-line:no-reserved-keywords
    public get(url: string, options?: IRequestOptions): Promise<IResponse> {
        return this.request('GET', url, options);
    }

    public options(url: string, options?: IRequestOptions): Promise<IResponse> {
        return this.request('GET', url, options);
    }

    public post(url: string, options?: IRequestOptions): Promise<IResponse> {
        return this.request('POST', url, options);
    }

    public put(url: string, options?: IRequestOptions): Promise<IResponse> {
        return this.request('PUT', url, options);
    }

    public setAuthenticationHeader(authHeader: string): void {
        this.authHeader =  authHeader;
    }

    public getAuthenticationHeader(): string {
        return this.authHeader;
    }

    public hasAuthenticationInfo(): boolean {
        return !!this.authHeader;
    }

    public abstract request(method: string, url: string, options?: IRequestOptions): Promise<IResponse>;
}
