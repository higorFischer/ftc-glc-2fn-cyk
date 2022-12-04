import { CNF } from "./models/CNF";
import { GLC } from "./models/GLC";
import { CYK } from "./services/CYK";

// npm run start nonTerminals=[A, B] terminals=[a, b] transitions=[{ a: [A]}]
function run() {
	CYK("baaba");
	new CNF(new GLC());
}

run();
