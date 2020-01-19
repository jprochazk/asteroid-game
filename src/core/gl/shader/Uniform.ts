import { GL } from 'core/gl/Context';


export class Uniform {
    private dirty: boolean = false;
    private data: any;

    public static build(
        shader: WebGLProgram,
        name: string,
        type: string
    ) {
        let location = GL.context.getUniformLocation(shader, name);

        if(!location) throw new Error(`Uniform location not found: "uniform ${type} ${name}"`);

        let setter = GL.getPartialUniformSetter(type, location);

        return new Uniform(name, type, setter);
    }

    private constructor(
        public readonly name: string,
        public readonly type: string,
        private readonly setter: (data: any)=>void
    ) {

    }

    public set(data: any): this {
        this.data = data;

        this.dirty = true;

        return this;
    }

    public upload(): this {
        if(!this.dirty) throw new Error(`uniform ${this.name} has no data set or already uploaded!`);
        this.setter(this.data);

        this.dirty = false;

        return this;
    }
}