"use strict";
const buildTable2 = (n) => {
    const table = [];
    for (var i = 0; i < n; i++) {
        table[i] = [];
        for (var j = 0; j < n; j++) {
            table[i][j] = [];
        }
    }
    return table;
};
// npm run start nonTerminals=[A, B] terminals=[a, b] transitions=[{ a: [A]}]
function run2() {
    const GLC = {
        terminals: ["a", "b", "c"],
        variables: { S: ["AB", "BC"], A: ["BA", "a"], B: ["CC", "b"], C: ["AB", "a"] },
        initialState: "S",
    };
    function isTerminal(glc, value) {
        return glc.terminals.indexOf(value) >= 0;
    }
    function CYK(word) {
        var wordSize = word.length;
        var recognitionTable = buildTable2(wordSize);
        for (var i = 0; i < wordSize; i++) {
            for (var variables in GLC.variables) {
                for (var key of GLC.variables[variables]) {
                    if (isTerminal(GLC, key) && word[i] === key) {
                        recognitionTable[i][i].push(`${variables}`);
                    }
                }
            }
        }
        for (var l = 1; l < wordSize; l++) {
            for (var i = 0; i < wordSize - l; i++) {
                const j = i + l;
                for (var k = i; k < j; k++) {
                    for (var variables in GLC.variables) {
                        for (var key of GLC.variables[variables]) {
                            if (isTerminal(GLC, key))
                                continue;
                            const hasOnFirst = recognitionTable[i][k].indexOf(key[0]) >= 0;
                            const hasOnSecond = recognitionTable[k + 1][j].indexOf(key[1]) >= 0;
                            if (hasOnFirst && hasOnSecond) {
                                recognitionTable[i][j].push(variables);
                                recognitionTable[i][j] = recognitionTable[i][j].filter((v, i, a) => a.indexOf(v) === i).sort();
                            }
                        }
                    }
                }
            }
        }
        console.table(recognitionTable);
        console.log(recognitionTable[0][wordSize - 1], wordSize - 1, recognitionTable[0][wordSize - 1].indexOf(GLC.initialState) >= 0);
        if (recognitionTable[0][wordSize - 1].indexOf(GLC.initialState) >= 0) {
            console.log("recognize");
            return true;
        }
        console.log("DONT recognize");
        return false;
    }
    CYK("baaba");
}
run();
