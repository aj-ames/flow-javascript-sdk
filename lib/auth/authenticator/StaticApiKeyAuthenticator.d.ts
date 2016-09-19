import { Authenticator } from './Authenticator';
import { IHttpClient } from '../../http/HttpClientInterface';
import { IStaticKeyConfig } from './config/StaticKeyConfig';
import { TokenStorage } from '../storage/TokenStorage';
export declare class StaticApiKeyAuthenticator extends Authenticator {
    protected config: IStaticKeyConfig;
    constructor(config: IStaticKeyConfig, storage: TokenStorage);
    init(): Promise<boolean>;
    authenticate(): Promise<void>;
    getHttpClient(): IHttpClient;
}
