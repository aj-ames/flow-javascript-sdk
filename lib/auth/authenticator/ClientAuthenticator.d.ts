import { Authenticator } from './Authenticator';
import { IClientConfig } from './config/ClientConfig';
import { IHttpClient } from '../../http/HttpClientInterface';
import { OAuthHttpClient } from '../../http/OAuthHttpClient';
import { TokenStorage } from '../storage/TokenStorage';
export declare class ClientAuthenticator extends Authenticator {
    protected config: IClientConfig;
    protected httpClient: OAuthHttpClient;
    constructor(config: IClientConfig, storage: TokenStorage);
    init(): Promise<boolean>;
    authenticate(): Promise<void>;
    getHttpClient(): IHttpClient;
}
