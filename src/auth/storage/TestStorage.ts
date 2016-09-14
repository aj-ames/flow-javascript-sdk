import {TokenStorage} from "./TokenStorage"
import {Token} from "../token/Token";


export class TestStorage extends TokenStorage {
    private token: Token;

    getToken(): Promise<Token> {
        return null;
    }

    setToken(token: Token): Promise<void> {
        return null;
    }

    clear(): Promise<void> {
        return null;
    }
}