import { UserCredentialsConfig } from "./config/UserCredentialsConfig";
import { OAuthHttpClient } from "../../http/OAuthHttpClient";
import { HttpClientInterface } from "../../http/HttpClientInterface";
import { TokenStorage } from "../storage/TokenStorage";
import { RefreshableAuthenticator } from "./RefreshableAuthenticator";
export declare class UserCredentialsAuthenticator extends RefreshableAuthenticator {
    protected config: UserCredentialsConfig;
    protected httpClient: OAuthHttpClient;
    constructor(config: UserCredentialsConfig, storage: TokenStorage);
    init(): Promise<boolean>;
    authenticate(...credentials: string[]): Promise<void>;
    getHttpClient(): HttpClientInterface;
}
