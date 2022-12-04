"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CNF_1 = require("./models/CNF");
const GLC_1 = require("./models/GLC");
const CYK_1 = require("./services/CYK");
// npm run start nonTerminals=[A, B] terminals=[a, b] transitions=[{ a: [A]}]
function run() {
    (0, CYK_1.CYK)("baaba");
    new CNF_1.CNF(new GLC_1.GLC());
}
run();
