import {Schema} from '../schema/Schema';
import {IQueryResult} from './QueryResult';

export interface IApi {
    fetchSchema(): Promise<Schema>;
    getObject(objType: string, id: string): Promise<{}>;
    getObjects(objType: string, query?: {}, options?: {}): Promise<IQueryResult>;
    allObjects(objType: string, options?: any): Promise<{}[]>;
    countObjects(objType: string, query?: {}): Promise<number>;
    createObject(objType: string, data: {}): Promise<string>;
    updateObject(objType: string, id: string, data: {}): Promise<void>;
    deleteObject(objType: string, id: string): Promise<void>;
}
