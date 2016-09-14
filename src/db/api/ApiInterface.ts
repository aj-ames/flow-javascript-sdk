import {Schema} from "../schema/Schema";
import {QueryResult} from "./QueryResult";

export interface ApiInterface {
    fetchSchema(): Promise<Schema>;
    getObject(type: string, id: string): Promise<{}>;
    getObjects(type: string, query?: {}, options?: {}): Promise<QueryResult>;
    allObjects(type: string, options?: any): Promise<{}[]>;
    countObjects(type: string, query?: {}): Promise<number>;
    createObject(type: string, data: {}): Promise<string>;
    updateObject(type: string, id: string, data: {}): Promise<void>;
    deleteObject(type: string, id: string): Promise<void>;
}