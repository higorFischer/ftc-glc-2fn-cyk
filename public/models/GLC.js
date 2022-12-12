"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLC = void 0;
//@ts-ignore
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
class GLC {
    constructor(initialState = "", terminals = [], variables = {}) {
        this.initialState = initialState;
        this.terminals = terminals;
        this.variables = variables;
        // this.initialState = "E";
        // this.terminals = ["a", "b", "0", "1", "(", ")", "+", "*"];
        // this.variables = {
        // 	E: ["T", "E+T"],
        // 	T: ["F", "T*F"],
        // 	F: ["aI", "bI", "(E)"],
        // 	I: ["0I", "1I", "λ"],
        // };
        // this.initialState = "S";
        // this.terminals = ["a", "b"];
        // this.variables = {
        // 	S: ["ASA", "aB"],
        // 	A: ["B", "S"],
        // 	B: ["b", ""],
        // };
    }
    clone() {
        return new GLC(this.initialState, this.terminals, this.variables);
    }
    isSingleVariable(value) {
        return (value.length == 1 && Object.keys(this.variables).indexOf(value) >= 0);
    }
    isDoubleVariable(value) {
        return (value.length == 2 &&
            [...value].every((char) => {
                Object.keys(this.variables).indexOf(char) >= 0;
            }));
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
        return value === "λ";
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
    instantiateNew(glc, withNewState = true) {
        var newGLC = new GLC();
        newGLC.initialState = glc.initialState;
        newGLC.variables = glc.variables;
        newGLC.terminals = glc.terminals;
        if (withNewState) {
            newGLC.initialState = "F";
            newGLC.variables = Object.assign({ F: ["S"] }, newGLC.variables);
        }
        return newGLC;
    }
    DEL(glc) {
        for (var variable of Object.keys(glc.variables).reverse()) {
            let needToRemove = "";
            for (var rule of glc.variables[variable]) {
                if (glc.isEmpty(rule))
                    needToRemove = variable;
            }
            if (needToRemove.length > 0) {
                const otherVariables = Object.keys(glc.variables).filter((c) => c != variable);
                for (var otherVariable of otherVariables) {
                    for (var otherRule of glc.variables[otherVariable]) {
                        /** Remove lambda and reconstruct */
                        if (otherRule.includes(needToRemove)) {
                            for (var i = 0; i < otherRule.length; i++) {
                                if (otherRule[i] === needToRemove) {
                                    var newRule = [...otherRule];
                                    newRule.splice(i, 1);
                                    if (!glc.variables[otherVariable].includes(newRule.join()))
                                        glc.variables[otherVariable].push(newRule.join(""));
                                }
                            }
                        }
                    }
                }
            }
            glc.variables[variable] = glc.variables[variable].filter((c) => c !== "");
        }
    }
    UNIT(glc) {
        /** Rules with one variable */
        for (var variable of Object.keys(glc.variables)) {
            for (var rule of glc.variables[variable]) {
                if (glc.isSingleVariable(rule)) {
                    glc.variables[variable] = [
                        ...glc.variables[rule],
                        ...glc.variables[variable],
                    ];
                    glc.variables[variable] =
                        glc.variables[variable].filter(onlyUnique);
                    const index = glc.variables[variable].indexOf(rule);
                    if (index >= 0) {
                        glc.variables[variable].splice(index, 1);
                    }
                }
            }
        }
    }
    BIN(glc) {
        /** Rules with 2 symbles */
        let newKeys = {};
        for (var variable of Object.keys(glc.variables)) {
            for (var rule of glc.variables[variable]) {
                if (rule.length > 2) {
                    for (var i = 1; i < rule.length - 1; i++) {
                        var oldRuleIndex = glc.variables[variable].indexOf(rule);
                        var substr = rule.substring(i, i + 2);
                        if (!newKeys[substr]) {
                            var newKey = glc.getNewKey();
                            newKeys[substr] = newKey;
                        }
                        var newKey = newKeys[substr];
                        glc.variables[variable].splice(oldRuleIndex, 1, rule.replace(substr, newKey));
                    }
                }
            }
        }
        for (var key of Object.keys(newKeys)) {
            const newKey = newKeys[key];
            glc.variables[newKey] = [key];
        }
    }
    TERM(glc) {
        /** Rules with 1 symble 1 variable */
        const newKeys = {};
        for (var variable of Object.keys(glc.variables)) {
            for (var rule of glc.variables[variable]) {
                if (glc.isTerminalAndValue(rule)) {
                    var terminal = glc.fetchTerminal(rule);
                    var oldRuleIndex = glc.variables[variable].indexOf(rule);
                    if (!newKeys[terminal]) {
                        var newKey = glc.getNewKey();
                        newKeys[terminal] = newKey;
                    }
                    var newKey = newKeys[terminal];
                    glc.variables[variable][oldRuleIndex] = rule.replace(terminal, newKey);
                }
            }
        }
        for (var key of Object.keys(newKeys)) {
            const newKey = newKeys[key];
            glc.variables[newKey] = [key];
        }
    }
}
exports.GLC = GLC;
