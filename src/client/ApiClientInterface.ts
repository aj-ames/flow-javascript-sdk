import {HttpClientInterface} from '../http/HttpClientInterface';


export interface ApiClientInterface {
    init(httpClient: HttpClientInterface): Promise<void>;
}
