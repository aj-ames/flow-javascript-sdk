import {Cls} from './schema/Cls';
import {Field} from './schema/Field';
import {IApi} from './api/ApiInterface';

export interface IQueryOptions {
    limit?: number;
    skip?: number;
}

export class BaseModel {
    public static _name: string;
    public static _schema: Cls;
    public static _api: IApi;
    public static _model: typeof BaseModel;

    private _id: string;
    private _data: {};

    constructor(data?: {}) {
        this._data = data || {};
        this.updateFields(this._data);
    }

    // tslint:disable-next-line:no-reserved-keywords
    public static get(id: string): Promise<BaseModel> {
        return this._api.getObject(this.getType(), id)
            .then<BaseModel>((obj) => {
                return new this._model(obj);
            });
    }

    public static all(limit?: number): Promise<BaseModel[]> {
        const promise = this._api.allObjects(this.getType(), {limit: limit});
        return promise.then<BaseModel[]>((objects) => {
            return objects.map((o) => { return new this._model(o); });
        });
    }

    public static find(query: {}, options?: IQueryOptions): Promise<BaseModel[]> {
        return this._api.getObjects(this.getType(), query, options)
            .then<BaseModel[]>((queryResult) => {
                return queryResult.objects.map((o) => { return new this._model(o); });
            });
    }

    public static count(query?: {}): Promise<number> {
        return this._api.countObjects(this.getType(), query);
    }

    public save(): Promise<BaseModel> {
        const api: IApi = this.constructor['_api'];

        const data: any = {};
        (<Cls>this.constructor['_schema']).fields.forEach((field) => {
            data[field.name] = this.convertValue(this[field.name], field.type);
        });

        if (this._id) {
            // update
            return api.updateObject(this.constructor['getType'](), this._id, data)
                .then(() => {
                    return this;
                });
        } else {
            // create
            return api.createObject(this.constructor['getType'](), data)
                .then((newId) => {
                    this._id = newId;
                    return this;
                });
        }
    }

    // tslint:disable-next-line:no-reserved-keywords
    public delete(): Promise<void> {
        const api: IApi = this.constructor['_api'];
        if (!this._id) {
            return Promise.reject(new Error('Object must have an id'));
        }
        return api.deleteObject(this.constructor['getType'](), this._id);
    }

    // TODO: figure out the best way for web
    // setAttachment() {
    //
    // }

    public static getName(): string {
        return this._name;
    }

    public static getType(): string {
        return this._name.toLowerCase();
    }

    public static getFields(): string[] {
        return this._schema.fields.map((f) => { return f.name; });
    }

    private updateFields(data?: {_id?: string}) {
        if (!data || !this.constructor['_schema']) {
            return;
        }
        if (data._id) {
            this._id = data._id;
        }
        this.constructor['_schema'].fields.forEach((f: Field) => {
            this[f.name] = this.convertValue(data[f.name], f.type);
        });
    }

    private convertValue(fieldValue: any, fieldType: string): any {
        if (fieldValue === null || fieldValue === undefined) {
            return null;
        }
        switch (fieldType) {
            case 'string':
                return `${fieldValue}`;
            case 'integer':
                return parseInt(fieldValue, 10);
            case 'float':
                return parseFloat(fieldValue);
            case 'boolean':
                return !!fieldValue;
            default:
                if (fieldType.indexOf('array[') === 0) {
                    return (Array.isArray(fieldValue) ? fieldValue : [ fieldValue ]).map((v) => {
                        return this.convertValue(v, fieldType.substring(6, fieldType.length - 1));
                    });
                }
                return null;
        }
    }

}

export function makeModel(cls: Cls, api: IApi): Function {
    // tslint:disable-next-line:no-eval
    const newModel = eval(`(function ${cls.name}(data){BaseModel.call(this, data)})`);
    // let newModel = function(data){BaseModel.call(this, data)};
    Object.keys(BaseModel).forEach((p) => {
        if (BaseModel.hasOwnProperty(p)) {
            newModel[p] = BaseModel[p];
        }
    });
    newModel.prototype = Object.create(BaseModel.prototype);
    newModel.prototype.constructor = newModel;
    newModel.prototype.name = cls.name;
    newModel.prototype.constructor._name = cls.name;
    newModel.prototype.constructor._schema = cls;
    newModel.prototype.constructor._api = api;
    newModel.prototype.constructor._model = newModel;
    return newModel;
}
