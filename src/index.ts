import { CNF } from "./models/CNF";
import { GLC } from "./models/GLC";
import { TwoNF } from "./models/TwoNF";
import { CYK } from "./services/CYK";
import { CYKM } from "./services/CYKM";
import FS from "fs";
import _ from "lodash";

const read = (file: string) => {
	let content = FS.readFileSync(file, "utf8");
	while (content.includes("\r")) content = content.replace("\r", "");

	const lines = content.split("\n");
	const newGLC = new GLC();

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
		const variable = lines[i].split(":")[0]!;
		const rules = lines[i].split(":")[1]?.replace("''", "").split("|");
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
		if (index <= 1) return { ...a };

		const propName = b.split("=")[0];
		const propValue = b.split("=")[1] ?? true;

		return { ...a, [propName]: propValue };
	}, {}) as { file: string };

	const { GLC, words, amount } = read(args.file);
	const logs = [];
	for (var word of words) {
		const tr = {
			word,
			amount: [] as any,
		};
		for (var i = 0; i < amount; i++) {
			const times = {
				CYK: 0,
				CYKM: 0,
				SpeedUp: 0,
			};
			const start = performance.now();
			CYK(new CNF(GLC.clone()), word);
			const end = performance.now();
			times["CYK"] = end - start;

			const startCYKM = performance.now();
			CYKM(new TwoNF(GLC.clone()), word);
			const endCYKM = performance.now();
			times["CYKM"] = endCYKM - startCYKM;

			times["SpeedUp"] = times.CYKM / times.CYK;
			tr.amount.push(times);
		}
		logs.push(tr);
	}
	FS.writeFile(
		"files/out2.txt",
		JSON.stringify({ grammar: GLC, times: logs }, null, "\t"),
		() => {}
	);
}

run();
