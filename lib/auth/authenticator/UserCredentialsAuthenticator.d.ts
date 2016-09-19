import { IUserCredentialsConfig } from './config/UserCredentialsConfig';
import { OAuthHttpClient } from '../../http/OAuthHttpClient';
import { IHttpClient } from '../../http/HttpClientInterface';
import { TokenStorage } from '../storage/TokenStorage';
import { RefreshableAuthenticator } from './RefreshableAuthenticator';
export declare class UserCredentialsAuthenticator extends RefreshableAuthenticator {
    protected config: IUserCredentialsConfig;
    protected httpClient: OAuthHttpClient;
    constructor(config: IUserCredentialsConfig, storage: TokenStorage);
    init(): Promise<boolean>;
    authenticate(...credentials: string[]): Promise<void>;
    getHttpClient(): IHttpClient;
}
