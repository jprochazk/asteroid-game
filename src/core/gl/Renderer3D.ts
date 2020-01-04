import { GL } from './Context';
import { Shader } from './shader/Shader';
import { Uniform } from './shader/reflection/Uniform';
import { UniformBlock } from './UniformBlock';
import { VertexArrayBuffer } from './shader/Buffer';

/*
Potential to-do list:

Create these objects:
scene: 
    - holds all data required to render the current scene
    - can be a relational database or a tree graph
renderer: 
    - takes a scene and renders it

Notes on the scene concept:
relational database version:
    - load all assets used in the scene into containers, giving each one a unique primary key
    - an "object" holds primary keys of assets that will be used to draw it
    - the renderer traverses all objects in the queue, collects their assets, and uses them for rendering
pros:
    - simpler
    - less development time
    - for small scenes good enough
cons:
    - less efficient (performance-wise)
    - potentially worse maintainability

scene graph version:
    - scene graph is a tree consisting of nodes, each of which contains references to assets 
        which are used to render it, and/or child nodes
    - a node may have no rendering information, in which case it is skipped
    - the renderer traverses the scene tree graph, rendering all nodes in post-order, using the assets
        they contain to render them
pros:
    - more efficient (performance-wise)
    - provides huge possibilities for efficient rendering through modern techniques
    - better maintainability and flexibility due to clear dependency graphs between nodes
    - e.g. a spaceship node could contain different parts (guns, engines, other modules) which can be 
        switched out for others very easily
cons:
    - MUCH more complex
    - more development time
    - for small scenes (which is probably our case), it's overkill

*/

export interface Renderable {
    VAO: VertexArrayBuffer,
    //texture: Texture | null,
    uniformData: { [x: string]: any }
}

export class Renderer3D {

    private globalUniformBlock: UniformBlock;
    private objectUniformBlock: UniformBlock;
    private renderQueue: Array<Renderable>;

    constructor(globalUniformMap: { [x: string]: Uniform }, objectUniformMap: { [x: string]: Uniform }) {

        this.globalUniformBlock = new UniformBlock(globalUniformMap);
        this.objectUniformBlock = new UniformBlock(objectUniformMap);
        this.renderQueue = new Array();
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