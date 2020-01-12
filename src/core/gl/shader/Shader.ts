import { UniformBlock } from './../UniformBlock';
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
        public readonly layout: VertexLayout,
        private readonly uniformBlock: UniformBlock
    ) {
        this.id = new UUID();
    }

    public setUniforms(data: { [x: string]: any }) {
        this.uniformBlock.set(data);
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
            VertexLayout.fromAttributes(reflectionData.attributes),
            reflectionData.uniforms
        );
    }
}
