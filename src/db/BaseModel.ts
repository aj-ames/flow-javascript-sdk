import {Cls} from "./schema/Cls";
import {Field} from "./schema/Field";
import {ApiInterface} from "./api/ApiInterface";

export interface QueryOptions {
    limit?: number;
    skip?: number;
}

export class BaseModel {
    public static _name: string;
    public static _schema: Cls;
    public static _api: ApiInterface;
    public static _model: typeof BaseModel;

    private _data: {};

    constructor(data?: {}) {
        this._data = data || {};
        this.updateFields(this._data);
    }

    static get(id: string): Promise<BaseModel> {
        return this._api.getObject(this.getType(), id)
            .then<BaseModel>((obj) => {
                return new this._model(obj);
            });
    }

    static all(limit?: number): Promise<BaseModel[]> {
        const promise = this._api.allObjects(this.getType(), {limit: limit});
        return promise.then<BaseModel[]>((objects) => {
                return objects.map((o) => {return new this._model(o)});
            });
    }

    static find(query: {}, options?: QueryOptions): Promise<BaseModel[]> {
        return this._api.getObjects(this.getType(), query, options)
            .then<BaseModel[]>((queryResult) => {
                return queryResult.objects.map((o) => {return new this._model(o)});
            });
    }

    static count(query?: {}): Promise<number> {
        return this._api.countObjects(this.getType(), query);
    }

    save(): Promise<BaseModel> {
        let api: ApiInterface = this.constructor['_api'];

        let data: any = {};
        (<Cls>this.constructor['_schema']).fields.forEach((field) => {
            data[field.name] = this.convertValue(this[field.name], field.type);
        });

        if (this['_id']) {
            // update
            return api.updateObject(this.constructor['getType'](), this['_id'], data)
                .then(() => {
                    return this;
                });
        } else {
            // create
            return api.createObject(this.constructor['getType'](), data)
                .then((newId) => {
                    this['_id'] = newId;
                    return this;
                });
        }
    }

    //noinspection ReservedWordAsName
    delete(): Promise<void> {
        let api: ApiInterface = this.constructor['_api'];
        if (!this['_id']) return Promise.reject(new Error('Object must have an id'));
        return api.deleteObject(this.constructor['getType'](), this['_id']);
    }

    // TODO: figure out the best way for web
    // setAttachment() {
    //
    // }

    static getName(): string {
        return this._name;
    }

    static getType(): string {
        return this._name.toLowerCase();
    }

    static getFields(): Array<string> {
        return this._schema.fields.map((f) => {return f.name});
    }

    private updateFields(data?: {}) {
        if (!data || !this.constructor['_schema']) return;
        if (data['_id']) this['_id'] = data['_id'];
        this.constructor['_schema'].fields.forEach((f: Field) => {
            this[f.name] = this.convertValue(data[f.name], f.type);
        });
    }

    private convertValue(value: any, type: string): any {
        if (value == null || value == undefined) return null;
        switch (type) {
            case 'string':
                return `${value}`;
            case 'integer':
                return parseInt(value);
            case 'float':
                return parseFloat(value);
            case 'boolean':
                return !!value;
            default:
                if (type.indexOf('array[') == 0)
                    return (Array.isArray(value) ? value : [value]).map((v) => {
                        return this.convertValue(v, type.substring(6, type.length - 1));
                    });
                return null;
        }
    }

}

export function makeModel(cls: Cls, api: ApiInterface): Function {
    let newModel = eval(`(function ${cls.name}(data){BaseModel.call(this, data)})`);
    // let newModel = function(data){BaseModel.call(this, data)};
    for (var p in BaseModel) if (BaseModel.hasOwnProperty(p)) newModel[p] = BaseModel[p];
    newModel.prototype = Object.create(BaseModel.prototype);
    newModel.prototype.constructor = newModel;
    newModel.prototype.name = cls.name;
    newModel.prototype.constructor._name = cls.name;
    newModel.prototype.constructor._schema = cls;
    newModel.prototype.constructor._api = api;
    newModel.prototype.constructor._model = newModel;
    return newModel;
}
