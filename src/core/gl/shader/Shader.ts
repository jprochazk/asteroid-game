import { IdSequence, IdType } from './../../util/Id';
import { GL } from './../Context';
import { Uniform } from './reflection/Uniform';
import { ShaderUtils } from "./ShaderUtils";
import { ShaderReflection } from "./reflection/ShaderReflection";
import { VertexLayout } from "./reflection/VertexLayout";


export class Shader {


    private constructor(
        public readonly id: number,
        public readonly program: WebGLProgram,
        private readonly uniforms: Map<string, Uniform>,
        public readonly layout: VertexLayout
    ) {

    }

    public getUniform(name: string) {
        return this.uniforms.get(name) || (()=>{throw new Error(`Could not get uniform ${name}`)})();
    }

    public bind() {
        GL.context.useProgram(this.program);
    }

    public unbind() {
        GL.context.useProgram(null);
    }

    public static build(source: string): Shader {
        const sources = ShaderUtils.splitShader(source);
        const program = ShaderUtils.createShaderProgram(sources);

        let reflectionData = ShaderReflection.reflect(program, sources);
        return new Shader(
            IdSequence.nextId(IdType.Shader),
            program, 
            reflectionData.uniforms, 
            VertexLayout.fromAttributes(reflectionData.attributes)
        );
    }
}
