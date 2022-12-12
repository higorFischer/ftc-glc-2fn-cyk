import { GLC } from "./GLC";

export class CNF extends GLC {
	constructor(glc: GLC) {
		super();
		this.fromGLC(glc);
	}

	private fromGLC(glc: GLC) {
		var newGLC = this.instantiateNew(glc);
		this.DEL(newGLC);
		this.UNIT(newGLC);
		this.TERM(newGLC);
		this.BIN(newGLC);
		Object.assign(this, newGLC);
	}
}
