import {deserialize} from "cerialize";

export class Field {
    @deserialize public name: string;
    @deserialize public type: string;
}
