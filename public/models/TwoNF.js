"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoNF = void 0;
const GLC_1 = require("./GLC");
class TwoNF extends GLC_1.GLC {
    constructor(glc) {
        super();
        this.fromGLC(glc);
    }
    fromGLC(glc) {
        var newGLC = this.instantiateNew(glc, false);
        this.BIN(newGLC);
        Object.assign(this, newGLC);
    }
}
exports.TwoNF = TwoNF;
