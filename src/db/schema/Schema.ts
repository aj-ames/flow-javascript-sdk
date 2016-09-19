import {Cls} from './Cls';
import {deserializeAs} from 'cerialize';

export class Schema {
    @deserializeAs(Cls) public classes: Cls[];
}
