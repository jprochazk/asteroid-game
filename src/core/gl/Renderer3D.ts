import { GL } from './Context';
import { Shader } from './shader/Shader';
import { VertexArrayBuffer } from './shader/Buffer';

export interface Renderable {
    mesh: VertexArrayBuffer;
    // part of Material in the future:
    //texture: Texture | null,
    shader: Shader;
    uniformData: { 
        [x: string]: any 
    };
}

export type RenderQueue = Renderable[];

export class Renderer3D {
    constructor() {}

    public render(queue: RenderQueue) {
        const gl = GL.context;

        let lastShaderId;
        for (const object of queue) {
            // if two objects using the same shader are next to eachother in the queue, don't bind the shader twice
            if(lastShaderId !== object.shader.id)
                object.shader.bind();
            lastShaderId = object.shader.id;

            object.shader.setUniforms(object.uniformData);
            object.mesh.draw(gl);
        }
    }
}