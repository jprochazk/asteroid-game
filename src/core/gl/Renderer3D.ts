import { Material } from './../scene/Material';
import { GL } from 'core/gl/Context';
import { Shader } from 'core/gl/shader/Shader';
import { VertexArrayBuffer } from 'core/gl/shader/Buffer';
import { SceneNodeType } from 'core/scene/Scene';


export interface Renderable {
    type: SceneNodeType;
    mesh: VertexArrayBuffer;
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