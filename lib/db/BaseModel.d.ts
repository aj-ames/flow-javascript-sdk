import { Cls } from "./schema/Cls";
import { ApiInterface } from "./api/ApiInterface";
export interface QueryOptions {
    limit?: number;
    skip?: number;
}
export declare class BaseModel {
    static _name: string;
    static _schema: Cls;
    static _api: ApiInterface;
    static _model: typeof BaseModel;
    private _data;
    constructor(data?: {});
    static get(id: string): Promise<BaseModel>;
    static all(limit?: number): Promise<BaseModel[]>;
    static find(query: {}, options?: QueryOptions): Promise<BaseModel[]>;
    static count(query?: {}): Promise<number>;
    save(): Promise<BaseModel>;
    delete(): Promise<void>;
    static getName(): string;
    static getType(): string;
    static getFields(): Array<string>;
    private updateFields(data?);
    private convertValue(value, type);
}
export declare function makeModel(cls: Cls, api: ApiInterface): Function;
