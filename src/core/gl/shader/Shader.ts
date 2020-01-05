import { UUID } from './../../util/UUID';
import { GL } from './../Context';
import { Uniform } from './reflection/Uniform';
import { ShaderUtils } from "./ShaderUtils";
import { ShaderReflection } from "./reflection/ShaderReflection";
import { VertexLayout } from "./reflection/VertexLayout";


export class Shader {
    public readonly id: UUID;

    private constructor(
        public readonly program: WebGLProgram,
        private readonly uniforms: Map<string, Uniform>,
        public readonly layout: VertexLayout
    ) {
        this.id = new UUID();
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
            program, 
            reflectionData.uniforms, 
            VertexLayout.fromAttributes(reflectionData.attributes)
        );
    }
}
