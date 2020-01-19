import { Vector3 } from "core/math/Math";


// @todo remove this hardcoded bs
export class Material {

    constructor(
        public readonly name: string,
        public ambient: number,
        public diffuse: Vector3,
        public specular: Vector3,
        public shininess: number,
    ) {

    }
}