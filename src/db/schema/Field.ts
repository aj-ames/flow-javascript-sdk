import {deserialize} from 'cerialize';

export class Field {
    @deserialize public name: string;
    // tslint:disable-next-line:no-reserved-keywords
    @deserialize public type: string;
}
