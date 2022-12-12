"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CNF = void 0;
const GLC_1 = require("./GLC");
class CNF extends GLC_1.GLC {
    constructor(glc) {
        super();
        this.fromGLC(glc);
    }
    fromGLC(glc) {
        var newGLC = this.instantiateNew(glc);
        this.DEL(newGLC);
        this.UNIT(newGLC);
        this.TERM(newGLC);
        this.BIN(newGLC);
        Object.assign(this, newGLC);
    }
}
exports.CNF = CNF;
