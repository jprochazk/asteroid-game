import { Vector2 } from './math/Vector2';
import { VertexArrayBuffer, VertexBuffer, IndexBuffer } from './gl/shader/Buffer';
import { PerspectiveCamera3D } from './camera/Camera3D';
import { Spinner } from './ui/LoadingAnimation';
import { Matrix4 } from './math/Matrix4';
import { GL } from './gl/Context';
import { Assets } from './util/AssetLoader';
import { Vector3 } from './math/Math';

export class Game {
    // @temp
    private keys: Map<string, boolean>;

    private hasFocus: boolean = false;

    private canvas: HTMLCanvasElement;
    private camera: PerspectiveCamera3D;
    private loadingSpinner: Spinner;

    constructor(container: HTMLElement = document.body) {
        this.loadingSpinner = new Spinner();
        this.loadingSpinner.start();

        this.canvas = document.createElement("canvas");
        container.appendChild(this.canvas);

        GL.init(this.canvas);
        GL.context.clearColor(0,0,0,1);
        GL.context.enable(GL.context.DEPTH_TEST);

        this.camera = new PerspectiveCamera3D({
            width: this.canvas.clientWidth,
            height: this.canvas.clientHeight
        });

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
            this.keys.set(e.key, true);
        })
        window.addEventListener("keyup", (e) => {
            this.keys.set(e.key, false);
        })
    }

    public async run() {
        const gl = GL.context;

        let shader = await Assets.loadShader("assets/shaders/pos3_tex2_n3.glsl");
        let obj = await Assets.loadObj(shader.layout, "assets/geometry/cube.obj");
    
        let u_model = shader.getUniform("u_model");
        let u_view = shader.getUniform("u_view");
        let u_projection = shader.getUniform("u_projection");

        const loop = () => {
            if(this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                gl.viewport(0, 0, this.canvas.width, this.canvas.height);
                this.camera.resize(this.canvas.width, this.canvas.height);
            }

            if(this.keys.get("w") || this.keys.get("W")) this.camera.keyMove("forward", 1);
            if(this.keys.get("s") || this.keys.get("S")) this.camera.keyMove("backward", 1);
            if(this.keys.get("a") || this.keys.get("A")) this.camera.keyMove("left", 1);
            if(this.keys.get("d") || this.keys.get("D")) this.camera.keyMove("right", 1);
            if(this.keys.get(" "))                       this.camera.keyMove("up", 1);
            if(this.keys.get("Shift"))                   this.camera.keyMove("down", 1);

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            u_model.set(Matrix4.create().translate(Vector3.create([0,0,-1])));
            u_view.set(this.camera.viewMatrix);
            u_projection.set(this.camera.projectionMatrix);


            shader.bind();
            u_view.upload();
            u_projection.upload();
            u_model.upload();

            obj.draw(gl);

            window.requestAnimationFrame(loop);
        }

        this.loadingSpinner.stop();
        window.requestAnimationFrame(loop);
    }
}