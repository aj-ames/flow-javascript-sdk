import {Authenticator} from "./Authenticator";
import {HttpClientInterface} from "../../http/HttpClientInterface";
import {HttpClient} from "../../http/HttpClient";
import {StaticKeyConfig} from "./config/StaticKeyConfig";
import {TokenStorage} from "../storage/TokenStorage";

export class StaticApiKeyAuthenticator extends Authenticator {
    protected config: StaticKeyConfig;

    constructor(config: StaticKeyConfig, storage: TokenStorage) {
        super(config, storage);
        this.httpClient = new HttpClient();
    }

    public init(): Promise<boolean> {
        this.httpClient.setAuthenticationHeader(this.config.key);
        return Promise.resolve<boolean>(true);
    }

    public authenticate(): Promise<void> {
        return Promise.resolve<void>(null);
    }

    public getHttpClient(): HttpClientInterface {
        return this.httpClient;
    }
}