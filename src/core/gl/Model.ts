import { Mesh } from './Mesh';
import { Texture } from './Texture';
import { Shader } from './shader/Shader';


export class Model {
    

    constructor(
        public readonly shader: Shader,
        public readonly texture: Texture,
        public readonly mesh: Mesh
    ) {

    }

}