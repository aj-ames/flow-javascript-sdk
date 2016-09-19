import { IHttpClient } from '../http/HttpClientInterface';
export interface IApiClient {
    init(httpClient: IHttpClient): Promise<void>;
}
