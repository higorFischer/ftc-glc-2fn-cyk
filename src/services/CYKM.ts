import { TwoNF } from "../models/TwoNF";
import { UnitRelationGLC } from "./UnitRelationGLC";

function buildTable(n: number): string[][][] {
	const table = [] as Array<Array<any>>;
	for (var i = 0; i < n; i++) {
		table[i] = [];
		for (var j = 0; j < n; j++) {
			table[i][j] = [];
		}
	}
	return table;
}

function depthFirstSearch(graph: any, root: any) {
	const visited = [root] as any[];

	if (!graph[root]) return visited;

	const todo = [];
	for (var i = 0; i < graph[root].length; i++) {
		todo.push(graph[root][i]);
		visited.push(graph[root][i]);
	}

	while (todo.length != 0) {
		const next = todo.pop();
		if (graph[next]) {
			for (var edge of graph[next]) {
				let vertex = null;
				if (graph[next][0] == edge) {
					vertex = graph[next][0];
				} else {
					vertex = graph[next][1];
				}

				if (!visited.includes(vertex)) {
					todo.push(vertex);
					visited.push(vertex);
				}
			}
		}
	}

	return visited;
}

function reachable(graph: any, word: any) {
	let reacheds = [] as any[];
	for (var node of word) {
		const visited = depthFirstSearch(graph, node) as [];
		for (var i = 0; i < visited.length; i++)
			if (!reacheds.includes(visited[i])) {
				reacheds.push(visited[i]);
			}
	}
	return reacheds;
}

export function CYKM(glc: TwoNF, word: string) {
	const unitRelation = new UnitRelationGLC().unitRelation(glc);
	if (word.length == 0) return false;

	const table = buildTable(word.length);
	const auxTable = buildTable(word.length);

	for (var i = 0; i < word.length; i++)
		table[i][i] = reachable(unitRelation, [word[i]]);

	for (var j = 1; j < word.length; j++) {
		for (var i = j - 1; i >= 0; --i) {
			auxTable[i][j] = [];
			for (var h = i; h < j; h++) {
				for (var variables in glc.variables) {
					for (var rule of glc.variables[variables]) {
						const condition1 = rule.length == 2;
						const condition2 = table[i][h].includes(rule[0]);
						const condition3 = table[h + 1][j].includes(rule[1]);
						const condition =
							condition1 && condition2 && condition3;

						if (condition) {
							auxTable[i][j].push(variables);
						}
					}
				}
			}

			table[i][j] = reachable(unitRelation, auxTable[i][j]);
		}
		if (table[0][word.length - 1].includes(glc.initialState))
			console.log("CYKM: recognize");
		else console.log("CYKM: dont recognize");
	}
}
