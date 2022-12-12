"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitRelationGLC = void 0;
const NullableGLC_1 = require("./NullableGLC");
class UnitRelationGLC {
    unitRelation(glc) {
        const graph = {};
        const nullables = new NullableGLC_1.NullableGLC().nullable(glc);
        const addEdge = (l, r) => {
            if (!graph[l])
                graph[l] = [];
            graph[l].push(r);
        };
        for (var variable of Object.keys(glc.variables)) {
            for (var rule of glc.variables[variable]) {
                const word = rule;
                if (word.length == 1)
                    addEdge(word, variable);
                else {
                    if (nullables.includes(word[0]))
                        addEdge(word[1], variable);
                    if (nullables.includes(word[1]))
                        addEdge(word[0], variable);
                }
            }
        }
        return graph;
    }
}
exports.UnitRelationGLC = UnitRelationGLC;
