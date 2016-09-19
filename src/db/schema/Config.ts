import {deserialize} from 'cerialize';

export class Config {
    @deserialize public sync: {
        strategy: string,
        config: {}
    };
}
