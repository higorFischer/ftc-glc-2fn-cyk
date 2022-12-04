"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLC = void 0;
class GLC {
    constructor() {
        this.initialState = "S";
        this.terminals = ["a", "b"];
        this.variables = {
            S: ["ASA", "aB"],
            A: ["B", "S"],
            B: ["b", ""],
        };
        // this.initialState = "S";
        // this.terminals = ["a", "b", "c"];
        // this.variables = {
        // 	S: ["AB", "BC"],
        // 	A: ["BA", "a"],
        // 	B: ["CC", "b"],
        // 	C: ["AB", "a"],
        // };
    }
    isSingleVariable(value) {
        return (value.length == 1 && Object.keys(this.variables).indexOf(value) >= 0);
    }
    isTerminalAndValue(value) {
        return (Object.keys(this.variables).some((variable) => value.indexOf(variable) >= 0) && this.terminals.some((terminal) => value.indexOf(terminal) >= 0));
    }
    fetchTerminal(value) {
        return this.terminals.find((terminal) => value.indexOf(terminal) >= 0);
    }
    flatRules() {
        return Object.keys(this.variables).reduce((a, b) => {
            var vars = this.variables[b];
            return [...a, ...vars];
        }, []);
    }
    isTerminal(value) {
        return this.terminals.indexOf(value) >= 0;
    }
    isEmpty(value) {
        return value === "";
    }
    getNewKey() {
        let newKey = this.makeid(1).toUpperCase();
        while (Object.keys(this.variables).includes(newKey)) {
            newKey = this.makeid(1).toUpperCase();
        }
        return newKey;
    }
    makeid(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
exports.GLC = GLC;
