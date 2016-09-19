import {IApiClient} from '../client/ApiClientInterface';
import {IHttpClient} from '../http/HttpClientInterface';
import {Schema} from './schema/Schema';
import {Cls} from './schema/Cls';
import {makeModel} from './BaseModel';
import {IApi} from './api/ApiInterface';
import {Api} from './api/Api';

export class DbApiClient implements IApiClient {
    public api: IApi;

    public init(httpClient: IHttpClient): Promise<void> {
        this.api = new Api(httpClient);
        return this.api.fetchSchema()
            .then((schema: Schema) => {
                this.generateModels(schema);
            });
    }

    public getAvailableModels(): string[] {
        const models = [];
        Object.keys(this).forEach((p) => {
            if (this.hasOwnProperty(p) && this[p].hasOwnProperty('_schema')) {
                models.push(p);
            }
        });
        return models;
    }

    private generateModels(schema: Schema) {
        schema.classes.forEach((cls: Cls) => {
            this[cls.name] = makeModel(cls, this.api);
        });
    }
}
