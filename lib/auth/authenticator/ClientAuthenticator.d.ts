import { Authenticator } from "./Authenticator";
import { ClientConfig } from "./config/ClientConfig";
import { HttpClientInterface } from "../../http/HttpClientInterface";
import { OAuthHttpClient } from "../../http/OAuthHttpClient";
import { TokenStorage } from "../storage/TokenStorage";
export declare class ClientAuthenticator extends Authenticator {
    protected config: ClientConfig;
    protected httpClient: OAuthHttpClient;
    constructor(config: ClientConfig, storage: TokenStorage);
    init(): Promise<boolean>;
    authenticate(...credentials: string[]): Promise<void>;
    getHttpClient(): HttpClientInterface;
}
