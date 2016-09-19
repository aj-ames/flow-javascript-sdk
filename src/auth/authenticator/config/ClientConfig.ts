import {IConfig} from './Config';

export interface IClientConfig extends IConfig {
    clientId: string;
    clientSecret: string;
}
