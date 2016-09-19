import { Cls } from './schema/Cls';
import { IApi } from './api/ApiInterface';
export interface IQueryOptions {
    limit?: number;
    skip?: number;
}
export declare class BaseModel {
    static _name: string;
    static _schema: Cls;
    static _api: IApi;
    static _model: typeof BaseModel;
    private _id;
    private _data;
    constructor(data?: {});
    static get(id: string): Promise<BaseModel>;
    static all(limit?: number): Promise<BaseModel[]>;
    static find(query: {}, options?: IQueryOptions): Promise<BaseModel[]>;
    static count(query?: {}): Promise<number>;
    save(): Promise<BaseModel>;
    delete(): Promise<void>;
    static getName(): string;
    static getType(): string;
    static getFields(): string[];
    private updateFields(data?);
    private convertValue(fieldValue, fieldType);
}
export declare function makeModel(cls: Cls, api: IApi): Function;
