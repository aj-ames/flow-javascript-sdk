import {IConfig} from './Config';

export interface IUserImplicitConfig extends IConfig {
    clientId: string;
    redirectUri: string;
    popup: boolean;
}
