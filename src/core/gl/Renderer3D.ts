import { GL } from './Context';
import { Shader } from './shader/Shader';
import { Uniform } from './shader/reflection/Uniform';
import { UniformBlock } from './UniformBlock';
import { VertexArrayBuffer } from './shader/Buffer';

export interface Renderable {
    VAO: VertexArrayBuffer,
    //texture: Texture | null,
    uniformData: { [x: string]: any }
}

export class Renderer3D {

    private initialized: boolean = false;
    private globalUniformBlock: UniformBlock;
    private objectUniformBlock: UniformBlock;
    private renderQueue: Array<Renderable>;

    constructor(globalUniformMap: { [x: string]: Uniform }, objectUniformMap: { [x: string]: Uniform }) {
        if(this.initialized) throw new Error(`Renderer already initialized!`);

        this.globalUniformBlock = new UniformBlock(globalUniformMap);
        this.objectUniformBlock = new UniformBlock(objectUniformMap);
        this.renderQueue = new Array();

        this.initialized = true;
    }

    public clearQueue() {
        this.renderQueue = new Array();
    }

    public queue(object: Renderable) {
        this.renderQueue.push(object);
    }

    public setGlobalUniformData(data: { [x: string]: any }) {
        this.globalUniformBlock.set(data);
    }

    public render(shader: Shader) {
        const gl = GL.context;
        if(!this.initialized) throw new Error(`Renderer not initialized!`);

        shader.bind();
        this.globalUniformBlock.upload();

        for (const object of this.renderQueue) {
            this.objectUniformBlock.set(object.uniformData);
            this.objectUniformBlock.upload();

            object.VAO.draw(gl);
        }

        this.clearQueue();
    }
}