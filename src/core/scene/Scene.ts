import { PointLight } from './PointLight';
import { Material } from 'core/scene/Material';
import { Shader } from 'core/gl/shader/Shader';
import { Vector3, Matrix4 } from 'core/math/Math';
import { RenderQueue } from 'core/gl/Renderer3D';
import { Camera } from 'core/camera/Camera3D';
import { VertexArrayBuffer } from 'core/gl/shader/Buffer';

export interface Transform {
    position: Vector3;
    rotation?: Vector3;
    scale?: Vector3;
}

export interface Object {
    shader: Shader;
    material: Material;
    mesh: VertexArrayBuffer;
}

export interface NodeData {
    transform?: Transform;
    object?: Object;
    lightProperties?: PointLight;
}

export type SceneNodeType = 'light' | 'object' | 'anchor';

export class SceneNode {

    public constructor(
        public type: SceneNodeType,
        public root: Scene,
        public data: NodeData,
        public parent: SceneNode | null = null,
        public children: SceneNode[] = []
    ) {}

    public createNode(type: SceneNodeType, data: NodeData) {
        let node = new SceneNode(type, this.root, data, null);
        this.children.push(node);

        return node;
    }

    public addNode(node: SceneNode) {
        this.children.push(node);
    }
}

export class Scene {
    
    public constructor(
        public camera: Camera,
        public readonly nodes: SceneNode[] = []
    ) {

    }

    public createNode(type: SceneNodeType, data: NodeData) {
        let node = new SceneNode(type, this, data, null);
        this.nodes.push(node);

        return node;
    }

    public addNode(node: SceneNode) {
        this.nodes.push(node);
    }

    public build(): RenderQueue {
        let lights: PointLight[] = [];
        let queue: RenderQueue = [];

        // traverse the tree
        this.nodes.forEach(node => {
            this.traverse(queue, lights, node);
        });

        // apply lights to every obj in the scene
        // @todo this could be optimized to only account for obj within the light's bounding volume or space partitioning grid cell
        lights.forEach((light, index) => {
            queue.forEach(obj => {
                // @todo remove this hardcoded bs
                // dont apply light properties to any lights
                if(obj.type === "light") return;

                // @todo remove this hardcoded bs
                // light.appendUniforms ??
                // or light.uploadUniforms in renderer
                // but lights are shader-specific, so think about this carefully
                obj.uniformData["u_light["+index+"].color"] = light.color;
                obj.uniformData["u_light["+index+"].position"] = light.position;
                obj.uniformData["u_light["+index+"].constant"] = light.constant;
                obj.uniformData["u_light["+index+"].linear"] = light.linear;
                obj.uniformData["u_light["+index+"].quadratic"] = light.quadratic;
            });
        })

        return queue;
    }

    private traverse(
        queue: RenderQueue,
        lights: PointLight[],
        node: SceneNode, 
        parentPos: Vector3 = Vector3.create()
    ) {

        // get position of current node
        let currentPos = (node.data.transform) ? parentPos.clone().add(node.data.transform.position) : parentPos;
        
        // recursively walk children (until we hit a leaf node)
        if(node.children) {
            node.children.forEach(child => {
                // here we propagate currentPos to all children
                this.traverse(queue, lights, child, currentPos);
            });
        }

        if(node.type === "anchor") return;

        // if node is a light
        if(node.type === "light") {
            if(!node.data.lightProperties) throw new Error(`Light properties not found for node of type "light"! ${node}`);
            node.data.lightProperties.position = currentPos;
            lights.push(node.data.lightProperties);
        }

        // if we have an object to render
        if(node.data.object) {
            // calculate its transformation
            let transform = Matrix4.create().translate(currentPos);
            if(node.data.transform) {
                if(node.data.transform.rotation) {
                    transform = transform.rotateX(Math.rad(node.data.transform.rotation.x)) ?? transform;
                    transform = transform.rotateY(Math.rad(node.data.transform.rotation.y)) ?? transform;
                    transform = transform.rotateZ(Math.rad(node.data.transform.rotation.z)) ?? transform;
                }
                if(node.data.transform.scale) {
                    transform = transform.scale(node.data.transform.scale);
                }
            }

            // grab its mesh and shader
            let mesh = node.data.object.mesh;
            let shader = node.data.object.shader;

            // @todo remove this hardcoded bs
            let uniformData = {};
            if(node.type === 'light') {
                uniformData = {
                    u_view: this.camera.viewMatrix,
                    u_projection: this.camera.projectionMatrix,
                    u_model: transform,
                    u_lightColor: node.data.lightProperties!.color
                };
            } else {
                uniformData = {
                    u_view: this.camera.viewMatrix,
                    u_projection: this.camera.projectionMatrix,
                    u_model: transform,
                    "u_viewPos": this.camera.position,
                    "u_material.ambient": node.data.object.material.ambient,
                    "u_material.diffuse": node.data.object.material.diffuse,
                    "u_material.specular": node.data.object.material.specular,
                    "u_material.shininess": node.data.object.material.shininess
                };
            }

            // then add it to the queue
            queue.push({
                type: node.type,
                mesh,
                shader,
                uniformData
            });
        }
    }
}