import { Authenticator } from './Authenticator';
import { IUserImplicitConfig } from './config/UserImplicitConfig';
import { IHttpClient } from '../../http/HttpClientInterface';
import { OAuthHttpClient } from '../../http/OAuthHttpClient';
import { TokenStorage } from '../storage/TokenStorage';
export declare class UserImplicitAuthenticator extends Authenticator {
    protected config: IUserImplicitConfig;
    protected httpClient: OAuthHttpClient;
    constructor(config: IUserImplicitConfig, storage: TokenStorage);
    init(): Promise<boolean>;
    authenticate(): Promise<void>;
    getHttpClient(): IHttpClient;
}
