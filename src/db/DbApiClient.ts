import {ApiClientInterface} from '../client/ApiClientInterface';
import {HttpClientInterface} from '../http/HttpClientInterface';
import {Schema} from './schema/Schema';
import {Cls} from './schema/Cls';
import {makeModel} from './BaseModel';
import {ApiInterface} from './api/ApiInterface';
import {Api} from './api/Api';


export class DbApiClient implements ApiClientInterface {
    public api: ApiInterface;

    init(httpClient: HttpClientInterface): Promise<void> {
        this.api = new Api(httpClient);
        return this.api.fetchSchema()
            .then((schema: Schema) => {
                this.generateModels(schema);
            });
    }

    getAvailableModels(): string[] {
        let models = [];
        for (var p in this) {
            if (this.hasOwnProperty(p) && this[p].hasOwnProperty('_schema')) {
                models.push(p);
            }
        }
        return models;
    }

    private generateModels(schema: Schema) {
        schema.classes.forEach((cls: Cls) => {
            this[cls.name] = makeModel(cls, this.api);
        });
    }
}