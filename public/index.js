"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CNF_1 = require("./models/CNF");
const GLC_1 = require("./models/GLC");
const TwoNF_1 = require("./models/TwoNF");
const CYK_1 = require("./services/CYK");
const CYKM_1 = require("./services/CYKM");
const fs_1 = __importDefault(require("fs"));
const read = (file) => {
    var _a;
    let content = fs_1.default.readFileSync(file, "utf8");
    while (content.includes("\r"))
        content = content.replace("\r", "");
    const lines = content.split("\n");
    const newGLC = new GLC_1.GLC();
    newGLC.initialState = lines[0];
    newGLC.terminals = lines[1].split(",");
    const [startRule, endRule] = [
        lines.indexOf("RULES"),
        lines.lastIndexOf("RULES"),
    ];
    const [startWord, endWord] = [
        lines.indexOf("WORDS"),
        lines.lastIndexOf("WORDS"),
    ];
    for (var i = startRule + 1; i < endRule; i++) {
        const variable = lines[i].split(":")[0];
        const rules = (_a = lines[i].split(":")[1]) === null || _a === void 0 ? void 0 : _a.replace("''", "").split("|");
        newGLC.variables[variable] = rules;
    }
    const words = [];
    for (var i = startWord + 1; i < endWord; i++) {
        words.push(lines[i]);
    }
    return {
        GLC: newGLC,
        words: words,
        amount: +lines[lines.indexOf("TIMES") + 1],
    };
};
// npm run start nonTerminals=[A, B] terminals=[a, b] transitions=[{ a: [A]}]
function run() {
    const args = process.argv.reduce((a, b, index) => {
        var _a;
        if (index <= 1)
            return Object.assign({}, a);
        const propName = b.split("=")[0];
        const propValue = (_a = b.split("=")[1]) !== null && _a !== void 0 ? _a : true;
        return Object.assign(Object.assign({}, a), { [propName]: propValue });
    }, {});
    const { GLC, words, amount } = read(args.file);
    const logs = [];
    for (var word of words) {
        const tr = {
            word,
            amount: [],
        };
        for (var i = 0; i < amount; i++) {
            const times = {
                CYK: 0,
                CYKM: 0,
                SpeedUp: 0,
            };
            const start = performance.now();
            (0, CYK_1.CYK)(new CNF_1.CNF(GLC.clone()), word);
            const end = performance.now();
            times["CYK"] = end - start;
            const startCYKM = performance.now();
            (0, CYKM_1.CYKM)(new TwoNF_1.TwoNF(GLC.clone()), word);
            const endCYKM = performance.now();
            times["CYKM"] = endCYKM - startCYKM;
            times["SpeedUp"] = times.CYKM / times.CYK;
            tr.amount.push(times);
        }
        logs.push(tr);
    }
    fs_1.default.writeFile("files/out2.txt", JSON.stringify({ grammar: GLC, times: logs }, null, "\t"), () => { });
}
run();
