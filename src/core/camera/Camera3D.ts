import { Vector3 } from './../math/Vector3';
import { GL } from './../gl/Context';
import { Matrix4 } from './../math/Matrix4';
import './../math/Math';

export class PerspectiveCamera3D {
    private worldUp: Vector3;
    private near: number;
    private far: number;
    private fov: number;
    private aspectRatio: number;
    private _projectionMatrix: Matrix4;
    private _viewMatrix: Matrix4;

    private yaw: number;
    private pitch: number;
    private sensitivity: number;
    private moveSpeed: number;

    private position: Vector3;
    private front: Vector3;
    private right: Vector3;
    private up: Vector3;

    constructor(options: {
        sensitivity?: number, moveSpeed?: number, near?: number, far?: number, fov?: number, width: number, height: number, worldUp?: Vector3
    }) {
        const gl = GL.context;

        this.near = options.near || 0.1;
        this.far = options.far || 100;
        this.fov = options.fov || Math.rad(60);
        this.aspectRatio = options.width / options.height;
        this.worldUp = options.worldUp || Vector3.create([0,1,0]);

        this.yaw = -90.0;
        this.pitch = 0.0;
        this.sensitivity = options.sensitivity || 0.1;
        this.moveSpeed = options.moveSpeed || 0.1;

        this.position = Vector3.create([0,0,0]);

        this.front = Vector3.create([
            Math.cos(Math.rad(this.yaw)) * Math.cos(Math.rad(this.pitch)),
            Math.sin(Math.rad(this.pitch)),
            Math.sin(Math.rad(this.yaw)) * Math.cos(Math.rad(this.pitch))
        ]).normalize();
        this.right = this.front.cross(this.worldUp).normalize();
        this.up = this.right.cross(this.front).normalize();

        this._projectionMatrix = Matrix4.perspective(this.fov, this.aspectRatio, this.near, this.far);
        this._viewMatrix = Matrix4.lookAt(this.position, this.position.clone().add(this.front), this.up);
    }

    public get projectionMatrix() {
        return this._projectionMatrix;
    }

    public get viewMatrix() {
        return this._viewMatrix;
    }

    public resize(newWidth: number, newHeight: number) {
        this.aspectRatio = newWidth / newHeight;
        this.calcProjectionMatrix();
    }

    public keyMove(direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down', deltaTime: number) {
		let vel = this.moveSpeed * deltaTime;
		switch (direction)
		{
			case 'forward': this.position.add(this.front.clone().scale(vel)); break;
			case 'backward': this.position.sub(this.front.clone().scale(vel)); break;
            case 'right': this.position.add(this.right.clone().scale(vel)); break;
			case 'left': this.position.sub(this.right.clone().scale(vel)); break;
			case 'up': this.position.add(this.up.clone().scale(vel)); break;
			case 'down': this.position.sub(this.up.clone().scale(vel)); break;
        }
        
        this.calcViewMatrix();
    }

    public mouseMove(offsetX: number, offsetY: number) {
		offsetX *= this.sensitivity;
		offsetY *= this.sensitivity;

		this.yaw += offsetX;
		this.pitch += offsetY;

		if (this.pitch > 89.0)
			this.pitch = 89.0;
		if (this.pitch < -89.0)
            this.pitch = -89.0;

        this.calcViewMatrix();
    }

    private calcProjectionMatrix() {
        this._projectionMatrix = Matrix4.perspective(this.fov, this.aspectRatio, this.near, this.far);
    }

    private calcViewMatrix() {
        this.front = Vector3.create([
            Math.cos(Math.rad(this.yaw)) * Math.cos(Math.rad(this.pitch)),
            Math.sin(Math.rad(this.pitch)),
            Math.sin(Math.rad(this.yaw)) * Math.cos(Math.rad(this.pitch))
        ]).normalize();
        this.right = this.front.cross(this.worldUp).normalize();
        this.up = this.right.cross(this.front).normalize();

        this._viewMatrix = Matrix4.lookAt(this.position, this.position.clone().add(this.front), this.up);
    }
}