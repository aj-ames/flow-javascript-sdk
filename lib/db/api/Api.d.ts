import { IHttpClient } from '../../http/HttpClientInterface';
import { IApi } from './ApiInterface';
import { IQueryResult } from './QueryResult';
import { Schema } from '../schema/Schema';
export declare class Api implements IApi {
    private httpClient;
    constructor(httpClient: IHttpClient);
    fetchSchema(): Promise<Schema>;
    getObject(objType: string, id: string): Promise<{}>;
    getObjects(objType: string, query?: {}, options?: {}): Promise<IQueryResult>;
    allObjects(objType: string, options?: any): Promise<{}[]>;
    countObjects(objType: string, query?: {}): Promise<number>;
    createObject(objType: string, data: {}): Promise<string>;
    updateObject(objType: string, id: string, data: {}): Promise<void>;
    deleteObject(objType: string, id: string): Promise<void>;
    batchCreate(objType: string, data: {}[]): Promise<string[]>;
    batchUpdate(objType: string, data: {}[]): Promise<void>;
    private static getObjectsRequestQuerystring(query?, options?);
}
