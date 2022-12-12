import { TwoNF } from "../models/TwoNF";

export class NullableGLC {
	nullable(glc: TwoNF) {
		const occurence = {} as { [key: string]: string[] };
		const nullable = [];
		const todo = [];

		for (var variable of Object.keys(glc.variables)) {
			occurence[variable] = [];
		}

		for (var variable of Object.keys(glc.variables)) {
			for (var rule of glc.variables[variable]) {
				if (glc.isSingleVariable(rule))
					occurence[variable].push(variable);
			}
		}

		for (var variable of Object.keys(glc.variables)) {
			for (var rule of glc.variables[variable]) {
				if (glc.isDoubleVariable(rule)) {
					var [first, second] = rule;
					occurence[first].push(variable + second);
					occurence[second].push(variable + first);
				}
			}
		}

		for (var variable of Object.keys(glc.variables)) {
			for (var rule of glc.variables[variable]) {
				if (glc.isEmpty(rule)) {
					nullable.push(variable);
					todo.push(variable);
				}
			}
		}

		while (todo.length != 0) {
			var B = todo.pop()! as any;
			for (var i = 0; i < occurence[B].length; i++) {
				if (occurence[B][i].length == 1) continue;

				const A = occurence[B][i][0];
				const C = occurence[B][i][1];

				const skip =
					nullable.indexOf(C) < 0 || nullable.indexOf(A) >= 0;

				if (skip) continue;

				nullable.push(A);
				todo.push(A);
			}
		}
		return nullable;
	}
}
