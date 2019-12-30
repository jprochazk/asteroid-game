import { GL } from './../../Context';

export type UniformType = 'mat4' | 'vec4' | 'sampler2D';

const isKnownUniformType = (type: string): type is UniformType => 
       type === 'mat4' 
    || type === 'vec4'
    || type === 'sampler2D'

export class Uniform {
    private dirty: boolean = false;
    private data: any;

    public static build(
        shader: WebGLProgram,
        uniform: string
    ) {
        let tokens = uniform.split(" ");

        let name = tokens[2];
        let type = tokens[1];
        let location = GL.context.getUniformLocation(shader, name);

        if(!isKnownUniformType(type)) throw new Error(`Unsupported uniform type: "uniform ${type} ${name}"`);
        if(!location) throw new Error(`Uniform location not found: "uniform ${type} ${name}"`);

        let setter = GL.getPartialUniformSetter(type, location);

        return new Uniform(name, setter);
    }

    private constructor(
        public readonly name: string,
        private readonly setter: (data: any)=>void
    ) {

    }

    public set(data: any): this {
        this.data = data;

        this.dirty = true;

        return this;
    }

    public upload(): this {
        this.setter(this.data);

        this.dirty = false;

        return this;
    }
}