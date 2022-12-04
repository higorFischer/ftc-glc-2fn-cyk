"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CNF = void 0;
const GLC_1 = require("./GLC");
//@ts-ignore
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
class CNF extends GLC_1.GLC {
    constructor(glc) {
        super();
        this.fromGLC(glc);
    }
    fromGLC(glc) {
        console.log("GLC: ", glc);
        var newGLC = new GLC_1.GLC();
        var emptiedRules = [];
        /*
            Create new initial state: S' -> S
        */
        newGLC.initialState = "F";
        newGLC.variables = Object.assign({ F: ["S"] }, glc.variables);
        newGLC.terminals = glc.terminals;
        /*
           Remove lambda on Variables (only on start)
        */
        for (var variable of Object.keys(glc.variables).reverse()) {
            let needToRemove = "";
            for (var rule of glc.variables[variable]) {
                if (glc.isEmpty(rule))
                    needToRemove = variable;
            }
            emptiedRules.push(needToRemove);
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
            newGLC.variables[variable] = glc.variables[variable].filter((c) => c !== "");
        }
        /** Rules with one variable */
        for (var variable of Object.keys(newGLC.variables)) {
            for (var rule of newGLC.variables[variable]) {
                if (newGLC.isSingleVariable(rule)) {
                    newGLC.variables[variable] = [
                        ...newGLC.variables[rule],
                        ...newGLC.variables[variable],
                    ];
                    newGLC.variables[variable] =
                        newGLC.variables[variable].filter(onlyUnique);
                    const index = newGLC.variables[variable].indexOf(rule);
                    if (index >= 0) {
                        newGLC.variables[variable].splice(index, 1);
                    }
                }
            }
        }
        /** Rules with 2 symbles */
        let newKeys = {};
        for (var variable of Object.keys(newGLC.variables)) {
            for (var rule of newGLC.variables[variable]) {
                if (rule.length > 2) {
                    for (var i = 1; i < rule.length - 1; i++) {
                        var oldRuleIndex = newGLC.variables[variable].indexOf(rule);
                        var substr = rule.substring(i, i + 2);
                        if (!newKeys[substr]) {
                            var newKey = newGLC.getNewKey();
                            newKeys[substr] = newKey;
                        }
                        var newKey = newKeys[substr];
                        newGLC.variables[variable].splice(oldRuleIndex, 1, rule.replace(substr, newKey));
                    }
                }
            }
        }
        for (var key of Object.keys(newKeys)) {
            const newKey = newKeys[key];
            newGLC.variables[newKey] = [key];
        }
        /** Rules with 1 symble 1 variable */
        newKeys = {};
        for (var variable of Object.keys(newGLC.variables)) {
            for (var rule of newGLC.variables[variable]) {
                if (newGLC.isTerminalAndValue(rule)) {
                    var terminal = newGLC.fetchTerminal(rule);
                    var oldRuleIndex = newGLC.variables[variable].indexOf(rule);
                    if (!newKeys[terminal]) {
                        var newKey = newGLC.getNewKey();
                        newKeys[terminal] = newKey;
                    }
                    var newKey = newKeys[terminal];
                    console.log(newKey, terminal, oldRuleIndex);
                    newGLC.variables[variable][oldRuleIndex] = rule.replace(terminal, newKey);
                }
            }
        }
        for (var key of Object.keys(newKeys)) {
            const newKey = newKeys[key];
            newGLC.variables[newKey] = [key];
        }
        console.log(newGLC);
    }
}
exports.CNF = CNF;
