import * as url from 'url';
import {RequestOptions, Response} from "../../src/http/HttpClientInterface";
import {BaseHttpClient} from "../../src/http/BaseHttpClient";

export class TestHttpClient extends BaseHttpClient {
    private mocks: { [key:string]:Response;};

    constructor() {
        super();
        this.mocks = {};
    }

    mockResponse(method: string, requestUrl: string, response: Response) {
        this.mocks[`${method}${url.parse(requestUrl).path}`] = response;
    }

    request(method: string, requestUrl: string, options?: RequestOptions): Promise<Response> {
        return new Promise<Response>((resolve: (response: Response) => void, reject: (error: Response) => void) => {
            let mock = this.mocks[`${method}${url.parse(requestUrl).path}`];
            if (mock) {
                resolve(mock);
            } else {
                let response = <Response>{};
                response.status = -1;
                response.body = "Unknown mock";
                reject(response);
            }
        });
    }

}