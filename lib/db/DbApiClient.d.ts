import { IApiClient } from '../client/ApiClientInterface';
import { IHttpClient } from '../http/HttpClientInterface';
import { IApi } from './api/ApiInterface';
export declare class DbApiClient implements IApiClient {
    api: IApi;
    init(httpClient: IHttpClient): Promise<void>;
    getAvailableModels(): string[];
    private generateModels(schema);
}
