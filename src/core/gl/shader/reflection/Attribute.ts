import { GL } from './../../Context';

export enum AttributeBasicType {
    FLOAT = "float", 
    UINT = "uint"
}

/**
 * Contains pre-defined attribute types
 */
export class AttributeCompoundType {
    static readonly VEC2 = new AttributeCompoundType("vec2", AttributeBasicType.FLOAT, 2*4, 2);
    static readonly VEC3 = new AttributeCompoundType("vec3", AttributeBasicType.FLOAT, 3*4, 3);
    static readonly VEC4 = new AttributeCompoundType("vec4", AttributeBasicType.FLOAT, 4*4, 4);

    private constructor(
        private readonly _name: string, 
        private readonly _btype: AttributeBasicType,
        private readonly _stride: number,
        private readonly _size: number) {
    }

    get btype() { return this._btype; }
    get name() { return this._name; }
    get stride() { return this._stride; }
    get size() { return this._size; }

    toString() {
        return `{ name: \"${this._name}\", stride: ${this._stride/4}*4 }`;
    }

    static fromString(str: string) {
        switch(str.toLowerCase()) {
            case "vec2": return this.VEC2;
            case "vec3": return this.VEC3;
            case "vec4": return this.VEC4;
            default: throw new Error(`Unknown or unsupported attribute type: ${str.toLowerCase()}`);
        }
    }
}

export class Attribute {

    public static factory(shader: WebGLProgram, attribute: string) {
        const gl = GL.context;

        let tokens = attribute.split(" ");

        let name = tokens[2];
        let type = AttributeCompoundType.fromString(tokens[1]);
        let location = gl.getAttribLocation(shader, name);

        return new Attribute(name, type, location);
    }

    private constructor(
        private _name: string,
        private _type: AttributeCompoundType,
        private _location: number
    ) {

    }

    public get name() { return this._name; }
    public get type() { return this._type; }
    public get location() { return this._location; }
}