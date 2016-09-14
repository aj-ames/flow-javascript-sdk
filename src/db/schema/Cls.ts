import {Field} from "./Field";
import {Index} from "./Index";
import {Config} from "./Config";
import {deserialize, deserializeAs} from "cerialize";

export class Cls {
    @deserialize public name: string;
    @deserializeAs(Field) public fields: Array<Field>;
    @deserializeAs(Index) public indices: Array<Index>;
    @deserializeAs(Config) public config: Config;
}