import {IHttpClient, IRequestOptions} from '../../http/HttpClientInterface';
import {Schema} from '../schema/Schema';
import {authDefaults} from '../../auth/authenticator/config/Config';
import {Deserialize} from 'cerialize';
import {urlEncode} from '../../utils/Http';
import {IQueryResult} from './QueryResult';
import {IApi} from './ApiInterface';

const API_BASE_PATH = 'api/v1/storage';

export class Api implements IApi {
    private httpClient: IHttpClient;

    constructor(httpClient: IHttpClient) {
        this.httpClient = httpClient;
    }

    public fetchSchema(): Promise<Schema> {
        return this.httpClient.get(`${authDefaults.BASE_URL}${API_BASE_PATH}/_schema`)
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Cannot fetch database schema');
                }
                return <Schema>Deserialize(JSON.parse(response.body), Schema);
            });
    }

    public getObject(objType: string, id: string): Promise<{}> {
        return this.httpClient.get(`${authDefaults.BASE_URL}${API_BASE_PATH}/data/${objType}/${id}`)
            .then((response) => {
                switch (response.status) {
                    case 200:
                        return <{}>JSON.parse(response.body);
                    case 404:
                        throw new Error('Object not found');
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    public getObjects(objType: string, query?: {}, options?: {}): Promise<IQueryResult> {
        return this.httpClient.get(`${authDefaults.BASE_URL}${API_BASE_PATH}/data/${objType}/?${Api.getObjectsRequestQuerystring(query, options)}`)
            .then((response) => {
                switch (response.status) {
                    case 200:
                        return <IQueryResult>JSON.parse(response.body);
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    public allObjects(objType: string, options?: any): Promise<{}[]> {
        const requestOptions: any = {page: 1};
        const limit = options && options.limit ? options.limit : null;
        if (limit && limit < 1000) {
            requestOptions.limit = limit;
        }

        return this.getObjects(objType, requestOptions)
            .then<{}[]>((queryResult) => {
                const pageSize = queryResult.objects.length;
                const objs = queryResult.objects;
                if (queryResult.metadata.pages > 1 && (!limit || pageSize < limit)) {
                    let pages = queryResult.metadata.pages - 1;
                    if (limit) {
                        pages = Math.min((Math.ceil(limit / pageSize) - 1), pages);
                    }
                    return Promise.all(Array.apply(null, Array(pages)).map((_, page) => {
                        const pageRequestOptions: any = {page: requestOptions.page + page + 1};
                        if (limit) {
                            pageRequestOptions.limit = pageSize;
                        }
                        if (requestOptions.limit) {
                            pageRequestOptions.limit = requestOptions.limit;
                        }
                        return this.getObjects(objType, pageRequestOptions);
                    }))
                        .then((results) => {
                            return objs.concat.apply(objs, results.map((r: IQueryResult) => { return r.objects; }));
                        });
                } else {
                    return objs;
                }
            })
            .then((objects) => {
                if (limit && objects.length > limit) {
                    return objects.slice(0, limit);
                }
                return objects;
            });
    }

    public countObjects(objType: string, query?: {}): Promise<number> {
        return this.getObjects(objType, query, {limit: 1})
            .then((queryResult) => {
                return queryResult.metadata.total;
            });
    }

    public createObject(objType: string, data: {}): Promise<string> {
        const options = <IRequestOptions>{};
        options.body = data;

        return this.httpClient.post(`${authDefaults.BASE_URL}${API_BASE_PATH}/data/${objType}/`, options)
            .then((response) => {
                switch (response.status) {
                    case 201:
                        let location = <string[]>response.headers.Location.split('/');
                        return location[location.length - 1];
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    public updateObject(objType: string, id: string, data: {}): Promise<void> {
        const options = <IRequestOptions>{};
        options.body = data;

        return this.httpClient.post(`${authDefaults.BASE_URL}${API_BASE_PATH}/data/${objType}/${id}`, options)
            .then((response) => {
                switch (response.status) {
                    case 200:
                        return;
                    case 404:
                        throw new Error('Object not found');
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    public deleteObject(objType: string, id: string): Promise<void> {
        return this.httpClient.request('DELETE', `${authDefaults.BASE_URL}${API_BASE_PATH}/data/${objType}/${id}`)
            .then((response) => {
                switch (response.status) {
                    case 200:
                        return;
                    case 404:
                        throw new Error('Object not found');
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    private static getObjectsRequestQuerystring(query?: {}, options?: any): string {
        const requestQuery: any = options || {};
        if (query) {
            requestQuery.query = query;
        }
        return urlEncode(requestQuery);
    }

}
