import {deserialize} from "cerialize";

export class Index {
    @deserialize public name: string;
    @deserialize public fields: string[];
}
