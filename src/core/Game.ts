import { Renderer3D } from './gl/Renderer3D';
import { PerspectiveCamera3D } from './camera/Camera3D';
import { Spinner } from './ui/LoadingAnimation';
import { Matrix4 } from './math/Matrix4';
import { GL } from './gl/Context';
import { AssetManager } from './util/AssetManager';
import { Vector3 } from './math/Math';

export class Game {
    // @temp
    private keys: Map<string, boolean>;

    private hasFocus: boolean = false;

    private canvas: HTMLCanvasElement;
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

        // load some stuff
        let shader = await AssetManager.loadShader("assets/shaders/pos3_tex2_n3.glsl");
        let obj = await AssetManager.loadObj(shader.layout, "assets/geometry/cube.obj");
        let obj2 = await AssetManager.loadObj(shader.layout, "assets/geometry/cube.obj");
    
        // prepare uniform block
        let perFrameUniforms = {
            "u_view": shader.getUniform("u_view"),
            "u_projection": shader.getUniform("u_projection")
        };
        let perObjectUniforms = {
            "u_model": shader.getUniform("u_model")
        };

        const renderer = new Renderer3D(perFrameUniforms, perObjectUniforms);

        const loop = () => {
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

            renderer.setGlobalUniformData({
                u_view: this.camera.viewMatrix,
                u_projection: this.camera.projectionMatrix
            });

            renderer.queue({
                VAO: obj,
                uniformData: {
                    u_model: Matrix4.create().translate(Vector3.create([-5,0,-1]))
                }
            });

            renderer.queue({
                VAO: obj2,
                uniformData: {
                    u_model: Matrix4.create().translate(Vector3.create([0,0,-1]))
                }
            });
            
            renderer.render(shader);

            // loop
            window.requestAnimationFrame(loop);
        }

        // stop loading spinner
        this.loadingSpinner.stop();
        // start loop
        window.requestAnimationFrame(loop);
    }
}