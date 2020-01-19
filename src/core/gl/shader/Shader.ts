import { UniformBlock } from 'core/gl/UniformBlock';
import { UUID } from 'core/util/UUID';
import { GL } from 'core/gl/Context';
import { ShaderUtils } from "core/gl/shader/ShaderUtils";
import { VertexLayout } from "core/gl/shader/VertexLayout";


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


    public setUniformsPartial(data: { [x: string]: any }) {
        this.uniformBlock.setPartial(data);
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

        let reflectionData = ShaderUtils.reflect(program, sources);
        return new Shader(
            program,
            VertexLayout.fromAttributes(reflectionData.attributeArray),
            reflectionData.uniformBlock
        );
    }
}
