import {HttpClientInterface, RequestOptions} from '../../http/HttpClientInterface';
import {Schema} from '../schema/Schema';
import {AuthDefaults} from '../../auth/authenticator/config/Config';
import {Deserialize} from 'cerialize';
import {urlencode} from '../../utils/Http';
import {QueryResult} from './QueryResult';
import {ApiInterface} from './ApiInterface';

const API_BASE_PATH = 'api/v1/storage';

export class Api implements ApiInterface {
    private httpClient: HttpClientInterface;

    constructor(httpClient: HttpClientInterface) {
        this.httpClient = httpClient;
    }

    fetchSchema(): Promise<Schema> {
        return this.httpClient.get(`${AuthDefaults.BASE_URL}${API_BASE_PATH}/_schema`)
            .then((response) => {
                if (response.status != 200) {
                    throw new Error('Cannot fetch database schema');
                }
                return <Schema>Deserialize(JSON.parse(response.body), Schema);
            });
    }

    getObject(type: string, id: string): Promise<{}> {
        return this.httpClient.get(`${AuthDefaults.BASE_URL}${API_BASE_PATH}/data/${type}/${id}`)
            .then((response) => {
                switch(response.status) {
                    case 200:
                        return <{}>JSON.parse(response.body);
                    case 404:
                        throw new Error('Object not found');
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    getObjects(type: string, query?: {}, options?: {}): Promise<QueryResult> {
        return this.httpClient.get(`${AuthDefaults.BASE_URL}${API_BASE_PATH}/data/${type}/?${Api.getObjectsRequestQuerystring(query, options)}`)
            .then((response) => {
                switch(response.status) {
                    case 200:
                        return <QueryResult>JSON.parse(response.body);
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    allObjects(type: string, options?: any): Promise<{}[]> {
        let requestOptions: any = {page: 1};
        let limit = options && options.limit ? options.limit : null;
        if (limit && limit < 1000) requestOptions.limit = limit;

        return this.getObjects(type, requestOptions)
            .then<{}[]>((queryResult) => {
                let pageSize = queryResult.objects.length;
                let objs = queryResult.objects;
                if (queryResult.metadata.pages > 1 && (!limit || pageSize < limit)) {
                    let pages = queryResult.metadata.pages - 1;
                    if (limit) pages = Math.min((Math.ceil(limit / pageSize) - 1), pages);
                    return Promise.all(Array.apply(null, Array(pages)).map((_, page) => {
                        let pageRequestOptions: any = {page: requestOptions.page + page + 1};
                        if (limit) pageRequestOptions.limit = pageSize;
                        if(requestOptions.limit) pageRequestOptions.limit = requestOptions.limit;
                        return this.getObjects(type, pageRequestOptions);
                    }))
                        .then((results) => {
                            return objs.concat.apply(objs, results.map((r: QueryResult) => {return r.objects}));
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

    countObjects(type: string, query?: {}): Promise<number> {
        return this.getObjects(type, query, {limit: 1})
            .then((queryResult) => {
                return queryResult.metadata.total;
            });
    }

    createObject(type: string, data: {}): Promise<string> {
        let options = <RequestOptions>{};
        options.body = data;

        return this.httpClient.post(`${AuthDefaults.BASE_URL}${API_BASE_PATH}/data/${type}/`, options)
            .then((response) => {
                switch(response.status) {
                    case 201:
                        let location = <string[]>response.headers['Location'].split('/');
                        return location[location.length - 1];
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    updateObject(type: string, id: string, data: {}): Promise<void> {
        let options = <RequestOptions>{};
        options.body = data;

        return this.httpClient.post(`${AuthDefaults.BASE_URL}${API_BASE_PATH}/data/${type}/${id}`, options)
            .then((response) => {
                switch(response.status) {
                    case 200:
                        return;
                    case 404:
                        throw new Error('Object not found');
                    default:
                        throw new Error(`Unexpected API response (${response.status})`);
                }
            });
    }

    deleteObject(type: string, id: string): Promise<void> {
        return this.httpClient.request('DELETE', `${AuthDefaults.BASE_URL}${API_BASE_PATH}/data/${type}/${id}`)
            .then((response) => {
                switch(response.status) {
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
        let requestQuery: any = options || {};
        if (query) requestQuery.query = query;
        return urlencode(requestQuery);
    }

}
