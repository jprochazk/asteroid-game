import { Vector3 } from "core/math/Math";


// @todo remove this hardcoded bs
export class PointLight {

    constructor(
        public color: Vector3,
        public constant: number,
        public linear: number,
        public quadratic: number,
        public position: Vector3 = Vector3.create([0,0,0]),
    ) {

    }
}