import * as url from 'url';
import {IResponse} from '../../src/http/HttpClientInterface';
import {BaseHttpClient} from '../../src/http/BaseHttpClient';

export class TestHttpClient extends BaseHttpClient {
    private mocks: { [key: string]: IResponse; };

    constructor() {
        super();
        this.mocks = {};
    }

    public mockResponse(method: string, requestUrl: string, response: IResponse) {
        this.mocks[`${method}${url.parse(requestUrl).path}`] = response;
    }

    public request(method: string, requestUrl: string): Promise<IResponse> {
        return new Promise<IResponse>((resolve: (response: IResponse) => void, reject: (error: IResponse) => void) => {
            const mock = this.mocks[`${method}${url.parse(requestUrl).path}`];
            if (mock) {
                resolve(mock);
            } else {
                const response = <IResponse>{};
                response.status = -1;
                response.body = 'Unknown mock';
                reject(response);
            }
        });
    }
}
