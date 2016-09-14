import { Authenticator } from "./Authenticator";
import { Token } from "../token/Token";
export declare abstract class RefreshableAuthenticator extends Authenticator {
    protected validateToken(token: Token): Promise<boolean>;
    refreshToken(token: Token): Promise<void>;
}
