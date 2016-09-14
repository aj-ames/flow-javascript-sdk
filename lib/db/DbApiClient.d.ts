import { ApiClientInterface } from "../client/ApiClientInterface";
import { HttpClientInterface } from "../http/HttpClientInterface";
import { ApiInterface } from "./api/ApiInterface";
export declare class DbApiClient implements ApiClientInterface {
    api: ApiInterface;
    init(httpClient: HttpClientInterface): Promise<void>;
    getAvailableModels(): string[];
    private generateModels(schema);
}
