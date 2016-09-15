import {Config} from './Config';

export interface ClientConfig extends Config {
    clientId: string
    clientSecret: string
}
