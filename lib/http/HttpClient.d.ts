import { IRequestOptions, IResponse } from './HttpClientInterface';
import { BaseHttpClient } from './BaseHttpClient';
export declare class HttpClient extends BaseHttpClient {
    request(method: string, url: string, options?: IRequestOptions): Promise<IResponse>;
}
