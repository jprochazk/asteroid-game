import { Spinner } from './ui/LoadingAnimation';
import { Matrix4 } from './math/Matrix4';
import { GL } from './gl/Context';
import { Assets } from './util/AssetLoader';

async function run() {
    const container = document.querySelector(".game-container") || document.body;
    
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    
    GL.init(canvas);
}

export class Game {
    private loadingSpinner: Spinner;

    constructor(container: HTMLElement = document.body) {
        this.loadingSpinner = new Spinner();
        this.loadingSpinner.start();

        const canvas = document.createElement("canvas");
        container.appendChild(canvas);

        GL.init(canvas);
    }

    public async run() {
        let shader = await Assets.loadShader("assets/shaders/pos3_tex2_n3.glsl");
        let obj = await Assets.loadObj(shader.layout, "assets/geometry/cube.obj");
    
        shader.bind();
        shader.uniforms.get("u_model")?.set(Matrix4.create()).upload();

        this.loadingSpinner.stop();
    }
}