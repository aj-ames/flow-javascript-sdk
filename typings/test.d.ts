/// <reference path="chai/chai.d.ts" />
import ExpectStatic = Chai.ExpectStatic;

declare var expect: ExpectStatic;

declare namespace jsverify {
    var assert: (a: any) => void;
    var forall: (...a: any[]) => void;
    var int16: any;
    var uint16: any;
    var int32: any;
    var uint32: any;
    var string: any;
    var nestring: any;
    var asciistring: any;
    var asciinestring: any;
    var number: any;
    var sampler: (a: any, b?: any) => Function;
}

declare module "jsverify" {
    export = jsverify;
}