import {Config} from './Config';

export interface UserImplicitConfig extends Config {
    clientId: string;
    redirectUri: string;
    popup: boolean;
}
