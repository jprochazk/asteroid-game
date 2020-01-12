import { Scene, SceneNode, NodeData } from './scene/Scene';
import { Renderer3D } from './gl/Renderer3D';
import { PerspectiveCamera3D } from './camera/Camera3D';
import { Spinner } from './ui/LoadingAnimation';
import { GL } from './gl/Context';
import { AssetManager } from './util/AssetManager';
import { Vector3 } from './math/Math';

export class Game {
    // @temp
    private keys: Map<string, boolean>;

    private hasFocus: boolean = false;

    private canvas: HTMLCanvasElement;
    private renderer: Renderer3D;
    private camera: PerspectiveCamera3D;
    private loadingSpinner: Spinner;

    constructor(container: HTMLElement = document.body) {
        // loading spinner
        this.loadingSpinner = new Spinner();
        this.loadingSpinner.start();

        // initialize canvas
        this.canvas = document.createElement("canvas");
        container.appendChild(this.canvas);

        // initialize webgl
        GL.init(this.canvas);
        GL.context.clearColor(0,0,0,1);
        GL.context.enable(GL.context.DEPTH_TEST);

        this.renderer = new Renderer3D();

        // initialize asset manager
        AssetManager.init();

        // initialize camera
        this.camera = new PerspectiveCamera3D({
            sensitivity: 0.1,
            width: this.canvas.clientWidth,
            height: this.canvas.clientHeight
        });

        // initialize input handling
        this.keys = new Map();

        this.canvas.addEventListener("mousedown", () => {
            this.canvas.requestPointerLock();
            this.hasFocus = true;
        });
        this.canvas.addEventListener("mouseup", () => {
            document.exitPointerLock();
            this.hasFocus = false;
        });
        this.canvas.addEventListener("mousemove", (e) => {
            if(this.hasFocus) {
                this.camera.mouseMove(e.movementX, -e.movementY);
            }
        });

        window.addEventListener("keydown", (e) => {
            this.keys.set(e.key.toLowerCase(), true);
        })
        window.addEventListener("keyup", (e) => {
            this.keys.set(e.key.toLowerCase(), false);
        })
    }

    public async run() {
        const gl = GL.context;

        // build the scene
        // @todo build from json file including loading all the assets required
        // @todo cache resources, 
        let shader = await AssetManager.loadShader("assets/shaders/pos3_tex2_n3.glsl");
        let scene = new Scene(this.camera);
        let cubeObj: NodeData = {
            object: {
                shader: shader,
                mesh: await AssetManager.loadObj(shader.layout, "assets/geometry/cube.obj")
            },
            transform: {
                position: Vector3.create([0,0,0])
            }
        };
        let sphereObj: NodeData = {
            object: {
                shader: shader,
                mesh: await AssetManager.loadObj(shader.layout, "assets/geometry/sphere.obj")
            },
            transform: {
                position: Vector3.create([15,0,15]),
                scale: Vector3.create([0.1,0.1,0.1])
            }
        };
        let sphereObj2: NodeData = {
            object: {
                shader: shader,
                mesh: await AssetManager.loadObj(shader.layout, "assets/geometry/sphere.obj")
            },
            transform: {
                position: Vector3.create([5,0,5]),
                scale: Vector3.create([0.05,0.05,0.05])
            }
        };

        // 1st layer - parent is root
        let cubeNode = scene.createNode(cubeObj);
        let sphereNode = scene.createNode(sphereObj);

        // 2nd layer - parent is sphereNode
        let sphereNode2 = sphereNode.createNode(sphereObj2);
        sphereNode.addNode(sphereNode2);

        // push both 1st layer nodes
        scene.nodes.push(cubeNode);
        scene.nodes.push(sphereNode);

        let t = 0;
        const loop = () => {
            t = 0.001 + (t % 360);
            // resize if necessary
            if(this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                gl.viewport(0, 0, this.canvas.width, this.canvas.height);
                this.camera.resize(this.canvas.width, this.canvas.height);
            }

            // propagate key input to camera
            if(this.keys.get("w"))      this.camera.keyMove("forward", 1);
            if(this.keys.get("s"))      this.camera.keyMove("backward", 1);
            if(this.keys.get("a"))      this.camera.keyMove("left", 1);
            if(this.keys.get("d"))      this.camera.keyMove("right", 1);
            if(this.keys.get(" "))      this.camera.keyMove("up", 1);
            if(this.keys.get("shift"))  this.camera.keyMove("down", 1);

            // clear the canvas
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            sphereNode.data.transform!.position = Vector3.create([Math.cos(t) * 15, 0, Math.sin(t) * 15]);
            sphereNode2.data.transform!.position = Vector3.create([Math.cos(t * 10) * 5, Math.cos(t * 10) * 2.4, Math.sin(t * 10) * 5]);

            let queue = scene.buildRenderQueue();
            this.renderer.render(queue);

            // loop
            window.requestAnimationFrame(loop);
        }

        // stop loading spinner
        this.loadingSpinner.stop();
        // start loop
        window.requestAnimationFrame(loop);
    }
}