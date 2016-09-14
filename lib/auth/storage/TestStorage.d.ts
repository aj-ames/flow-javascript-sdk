import { TokenStorage } from "./TokenStorage";
import { Token } from "../token/Token";
export declare class TestStorage extends TokenStorage {
    private token;
    getToken(): Promise<Token>;
    setToken(token: Token): Promise<void>;
    clear(): Promise<void>;
}
