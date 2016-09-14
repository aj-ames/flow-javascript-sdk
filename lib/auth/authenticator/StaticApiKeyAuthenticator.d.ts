import { Authenticator } from "./Authenticator";
import { HttpClientInterface } from "../../http/HttpClientInterface";
import { StaticKeyConfig } from "./config/StaticKeyConfig";
import { TokenStorage } from "../storage/TokenStorage";
export declare class StaticApiKeyAuthenticator extends Authenticator {
    protected config: StaticKeyConfig;
    constructor(config: StaticKeyConfig, storage: TokenStorage);
    init(): Promise<boolean>;
    authenticate(): Promise<void>;
    getHttpClient(): HttpClientInterface;
}
