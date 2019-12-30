import { Attribute } from "./Attribute";
import { Uniform } from "./Uniform";

export interface ReflectionData {
    attributes: Array<Attribute>,
    uniforms: Map<string, Uniform>
}

export namespace ShaderReflection {
    export function reflect(shader: WebGLProgram, sources: {vertex:string, fragment:string}): ReflectionData {
        let attribute_lines = sources.vertex.match(/in.+\b/g) || [];
        let attributes: Array<Attribute> = [];
        for(let attribute_line of attribute_lines) {
            attributes.push(Attribute.factory(shader, attribute_line));
        }
        
        let combined_source = sources.vertex + sources.fragment;
        let uniform_lines = combined_source.match(/(?<!\/)uniform.+\b/g) || [];
        let uniforms: Map<string, Uniform> = new Map();
        for(const uniform_line of uniform_lines) {
            let uniform = Uniform.build(shader, uniform_line);
            uniforms.set(uniform.name, uniform);
        }

        return {attributes, uniforms};
    }
}
