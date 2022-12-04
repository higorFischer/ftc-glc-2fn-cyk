export class GLC {
	public initialState: string;
	public terminals: string[];
	public variables: { [key: string]: string[] };

	constructor() {
		this.initialState = "S";
		this.terminals = ["a", "b"];
		this.variables = {
			S: ["ASA", "aB"],
			A: ["B", "S"],
			B: ["b", ""],
		};
		// this.initialState = "S";
		// this.terminals = ["a", "b", "c"];
		// this.variables = {
		// 	S: ["AB", "BC"],
		// 	A: ["BA", "a"],
		// 	B: ["CC", "b"],
		// 	C: ["AB", "a"],
		// };
	}

	isSingleVariable(value: string) {
		return (
			value.length == 1 && Object.keys(this.variables).indexOf(value) >= 0
		);
	}

	isTerminalAndValue(value: string) {
		return (
			Object.keys(this.variables).some(
				(variable) => value.indexOf(variable) >= 0
			) && this.terminals.some((terminal) => value.indexOf(terminal) >= 0)
		);
	}

	fetchTerminal(value: string) {
		return this.terminals.find((terminal) => value.indexOf(terminal) >= 0);
	}

	flatRules() {
		return Object.keys(this.variables).reduce((a: any, b: any) => {
			var vars = this.variables[b];
			return [...a, ...vars];
		}, []);
	}

	isTerminal(value: string) {
		return this.terminals.indexOf(value) >= 0;
	}

	isEmpty(value: string) {
		return value === "";
	}

	getNewKey() {
		let newKey = this.makeid(1).toUpperCase();
		while (Object.keys(this.variables).includes(newKey)) {
			newKey = this.makeid(1).toUpperCase();
		}
		return newKey;
	}

	private makeid(length: number) {
		var result = "";
		var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	}
}
