import { TwoNF } from "../models/TwoNF";
import { NullableGLC } from "./NullableGLC";

export class UnitRelationGLC {
	unitRelation(glc: TwoNF) {
		const graph = {} as any;
		const nullables = new NullableGLC().nullable(glc);

		const addEdge = (l: any, r: any) => {
			if (!graph[l]) graph[l] = [];

			graph[l].push(r);
		};

		for (var variable of Object.keys(glc.variables)) {
			for (var rule of glc.variables[variable]) {
				const word = rule;
				if (word.length == 1) addEdge(word, variable);
				else {
					if (nullables.includes(word[0])) addEdge(word[1], variable);
					if (nullables.includes(word[1])) addEdge(word[0], variable);
				}
			}
		}

		return graph;
	}
}
