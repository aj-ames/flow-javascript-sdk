import { HttpClient } from "./HttpClient";
import { Response, RequestOptions } from "./HttpClientInterface";
import { Token } from "../auth/token/Token";
import { Authenticator } from "../auth/authenticator/Authenticator";
export declare class OAuthHttpClient extends HttpClient {
    private authenticator;
    private token;
    constructor(authenticator: Authenticator);
    request(method: string, url: string, options?: RequestOptions): Promise<Response>;
    setAccessToken(token: Token): void;
    getAuthenticationHeader(): string;
    hasAuthenticationInfo(): boolean;
}
