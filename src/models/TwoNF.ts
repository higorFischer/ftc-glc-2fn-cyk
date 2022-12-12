import { GLC } from "./GLC";

export class TwoNF extends GLC {
	constructor(glc: GLC) {
		super();
		this.fromGLC(glc);
	}

	private fromGLC(glc: GLC) {
		var newGLC = this.instantiateNew(glc, false);
		this.BIN(newGLC);
		Object.assign(this, newGLC);
	}
}
