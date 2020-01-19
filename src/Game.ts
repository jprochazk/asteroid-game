import { FpsCounter } from './core/ui/FpsCounter';
import { Scene, NodeData } from 'core/scene/Scene';
import { Renderer3D } from 'core/gl/Renderer3D';
import { PerspectiveCamera3D } from 'core/camera/Camera3D';
import { Spinner } from 'core/ui/LoadingAnimation';
import { GL } from 'core/gl/Context';
import { AssetManager } from 'core/io/AssetManager';
import { Vector3 } from 'core/math/Math';
import { Material } from 'core/scene/Material';
import { PointLight } from 'core/scene/PointLight';

export class Game {
    // @temp
    private hasFocus: boolean = false;
    private buttons: {left:boolean, right:boolean, middle:boolean, b4: boolean, b5: boolean} = 
        {left:false, right:false, middle:false, b4: false, b5: false};
    private keys: Map<string, boolean>;

    private canvas: HTMLCanvasElement;
    private renderer: Renderer3D;
    private camera: PerspectiveCamera3D;

    private fpsCounter: FpsCounter;
    private loadingSpinner: Spinner;

    constructor(container: HTMLElement = document.body) {
        // ui stuff
        this.loadingSpinner = new Spinner();
        this.fpsCounter = new FpsCounter(200);

        // initialize canvas
        this.canvas = document.createElement("canvas");
        container.appendChild(this.canvas);

        // initialize webgl
        GL.init(this.canvas);
        GL.context.clearColor(0.1,0.1,0.1,1);
        GL.context.enable(GL.context.DEPTH_TEST);

        this.renderer = new Renderer3D();

        // initialize asset manager
        AssetManager.init();

        // initialize camera
        this.camera = new PerspectiveCamera3D({
            sensitivity: 0.1,
            width: this.canvas.clientWidth,
            height: this.canvas.clientHeight,
            far: 1000,
            moveSpeed: 0.01
        });

        // initialize input handling
        this.keys = new Map();

        this.canvas.oncontextmenu = (e) => e.preventDefault();
        window.addEventListener("mousedown", (e) => {
            e.preventDefault();

            switch(e.button) {
                case 0: this.buttons.left = true;
                case 1: this.buttons.middle = true;
                case 2: this.buttons.right = true;
                case 3: this.buttons.b4 = true;
                case 4: this.buttons.b5 = true;
            }

            if(!document.pointerLockElement) {
                this.canvas.requestPointerLock();
                this.hasFocus = true;
            }
        });
        window.addEventListener("mouseup", (e) => {
            e.preventDefault();

            switch(e.button) {
                case 0: this.buttons.left = false;
                case 1: this.buttons.middle = false;
                case 2: this.buttons.right = false;
                case 3: this.buttons.b4 = false;
                case 4: this.buttons.b5 = false;
            }

            for(const button of Object.values(this.buttons)) {
                if(button === true) return;
                
                document.exitPointerLock();
                this.hasFocus = false;
            }
        });
        window.addEventListener("mousemove", (e) => {
            if(this.hasFocus) this.camera.mouseMove(e.movementX, -e.movementY);
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
        // @todo materials should contain shaders
        
        let scene = new Scene(this.camera);
        let sceneBase: NodeData = {
            transform: {
                position: Vector3.create([0,0,-5])
            }
        }

        let lightshader = await AssetManager.loadShader("assets/shaders/pointlight.glsl");
        let sunObj: NodeData = {
            object: {
                shader: lightshader,
                // @todo remove this hardcoded bs
                material: new Material("test", 0.8, Vector3.create([255/255,69/255,0/255]), Vector3.create([255/255,215/255,0/255]), 128),
                mesh: await AssetManager.loadObj(lightshader.layout, "assets/geometry/sphere.obj")
            },
            transform: {
                position: Vector3.create([0,0,0]),
                scale: Vector3.create([0.05,0.05,0.05])
            },
            // @todo remove this hardcoded bs
            lightProperties: new PointLight(Vector3.create([1,1,1]), 10, 0.36*5, 0.128*5)
        };

        let objshader = await AssetManager.loadShader("assets/shaders/material_and_pointlight_no_tex.glsl");
        let spaceshipObj: NodeData = {
            object: {
                shader: objshader,
                // @todo remove this hardcoded bs
                material: new Material("test", 0.2, Vector3.create([255/255,69/255,0/255]), Vector3.create([255/255,215/255,0/255]), 32),
                mesh: await AssetManager.loadObj(objshader.layout, "assets/geometry/SmallSpaceFighter.obj")
                //mesh: await AssetManager.loadObj(objshader.layout, "assets/geometry/cube.obj")
            },
            transform: {
                position: Vector3.create([0,0,2]),
                scale: Vector3.create([0.2,0.2,0.2]),
                rotation: Vector3.create([-20, 50, 0])
            }
        }

        let baseNode = scene.createNode("anchor", sceneBase);
        let spaceshipNode = baseNode.createNode("object", spaceshipObj);
        let sunNode = baseNode.createNode("light", sunObj);

        let t = 0;
        let lastFrame = Date.now();
        const loop = () => {
            let currentFrame = Date.now();
            let frameTime = currentFrame - lastFrame;
            lastFrame = currentFrame;
            this.fpsCounter.update(1000 / frameTime);

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
            
            let queue = scene.build();
            this.renderer.render(queue);

            // loop
            window.requestAnimationFrame(loop);
        }

        // stop loading spinner
        this.loadingSpinner.hide();
        // start loop
        window.requestAnimationFrame(loop);
    }
}