import { GLC } from "./GLC";

export class TwoNF extends GLC {
	constructor(glc: GLC) {
		super();
		this.fromGLC(glc);
	}

	private fromGLC(glc: GLC) {
		console.log(glc);
	}
}
