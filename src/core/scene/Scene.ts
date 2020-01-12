import { Shader } from './../gl/shader/Shader';
import { Matrix4 } from './../math/Matrix4';
import { RenderQueue } from './../gl/Renderer3D';
import { PerspectiveCamera3D } from './../camera/Camera3D';
import { VertexArrayBuffer } from './../gl/shader/Buffer';
import { Vector3 } from "../math/Math";

export interface Transform {
    position: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
}

export interface Object {
    readonly shader: Shader;
    readonly mesh: VertexArrayBuffer;
}

export interface NodeData {
    readonly transform?: Transform;
    readonly object?: Object;
}

export class SceneNode {
    public readonly type: 'leaf' | 'group';

    public constructor(
        public readonly root: Scene,
        public readonly parent: SceneNode | null = null,
        public readonly data: NodeData,
        public readonly children: SceneNode[] = []
    ) {
        this.type = (children) ? 'leaf' : 'group';
    }

    public createNode(data: NodeData) {
        return new SceneNode(this.root, this, data);
    }

    public addNode(node: SceneNode) {
        this.children.push(node);
    }
}

// need to get each object's VAO and transformation matrix

export class Scene {
    
    public constructor(
        public readonly camera: PerspectiveCamera3D,
        public readonly nodes: SceneNode[] = []
    ) {

    }

    public createNode(data: NodeData) {
        return new SceneNode(this, null, data);
    }

    public addNode(node: SceneNode) {
        this.nodes.push(node);
    }

    public buildRenderQueue(): RenderQueue {
        let queue: RenderQueue = [];

        // traverse the tree
        this.nodes.forEach(node => {
            this.traverse(queue, node);
        });

        return queue;
    }

    /**
     * 
     */
    private traverse(queue: RenderQueue, node: SceneNode, parentPos: Vector3 = Vector3.create()) {
        // get position of current node
        let currentPos = (node.data.transform) ? parentPos.clone().add(node.data.transform.position) : parentPos;
        
        // recursively walk children (until we hit a leaf node)
        if(node.children) {
            node.children.forEach(child => {
                // here we propagate currentPos to all children
                this.traverse(queue, child, currentPos);
            });
        }

        // if we have an object to render
        if(node.data.object) {
            // calculate its transformation
            let transform = Matrix4.create().translate(currentPos);
            if(node.data.transform) {
                if(node.data.transform.rotation) {
                    transform = transform.rotateX(node.data.transform.rotation.x) ?? transform;
                    transform = transform.rotateY(node.data.transform.rotation.y) ?? transform;
                    transform = transform.rotateZ(node.data.transform.rotation.z) ?? transform;
                }
                if(node.data.transform.scale) {
                    transform = transform.scale(node.data.transform.scale);
                }
            }

            // grab its mesh and shader
            let mesh = node.data.object.mesh;
            let shader = node.data.object.shader;

            // then add it to the queue
            queue.push({
                mesh,
                shader,
                uniformData: {
                    u_projection: this.camera.projectionMatrix,
                    u_view: this.camera.viewMatrix,
                    u_model: transform
                }
            });
        }
    }
}