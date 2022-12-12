"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CYK = void 0;
function buildTable(n) {
    const table = [];
    for (var i = 0; i < n; i++) {
        table[i] = [];
        for (var j = 0; j < n; j++) {
            table[i][j] = [];
        }
    }
    return table;
}
function CYK(glc, word) {
    var wordSize = word.length;
    var recognitionTable = buildTable(wordSize);
    for (var i = 0; i < wordSize; i++) {
        for (var variables in glc.variables) {
            for (var key of glc.variables[variables]) {
                if (glc.isTerminal(key) && word[i] === key) {
                    recognitionTable[i][i].push(`${variables}`);
                }
            }
        }
    }
    for (var l = 1; l < wordSize; l++) {
        for (var i = 0; i < wordSize - l; i++) {
            const j = i + l;
            for (var k = i; k < j; k++) {
                for (var variables in glc.variables) {
                    for (var key of glc.variables[variables]) {
                        if (glc.isTerminal(key))
                            continue;
                        const hasOnFirst = recognitionTable[i][k].indexOf(key[0]) >= 0;
                        const hasOnSecond = recognitionTable[k + 1][j].indexOf(key[1]) >= 0;
                        if (hasOnFirst && hasOnSecond) {
                            recognitionTable[i][j].push(variables);
                            recognitionTable[i][j] = recognitionTable[i][j]
                                .filter((v, i, a) => a.indexOf(v) === i)
                                .sort();
                        }
                    }
                }
            }
        }
    }
    if (recognitionTable[0][wordSize - 1].indexOf(glc.initialState) >= 0) {
        console.log("CYKM:recognize");
        return true;
    }
    console.log("CYKM: DONT recognize");
    return false;
}
exports.CYK = CYK;
