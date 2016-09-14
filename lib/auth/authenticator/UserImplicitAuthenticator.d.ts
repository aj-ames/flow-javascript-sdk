import { Authenticator } from "./Authenticator";
import { UserImplicitConfig } from "./config/UserImplicitConfig";
import { HttpClientInterface } from "../../http/HttpClientInterface";
import { OAuthHttpClient } from "../../http/OAuthHttpClient";
import { TokenStorage } from "../storage/TokenStorage";
export declare class UserImplicitAuthenticator extends Authenticator {
    protected config: UserImplicitConfig;
    protected httpClient: OAuthHttpClient;
    constructor(config: UserImplicitConfig, storage: TokenStorage);
    init(): Promise<boolean>;
    authenticate(...credentials: string[]): Promise<void>;
    getHttpClient(): HttpClientInterface;
}
