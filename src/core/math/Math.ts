import { Quaternion } from './Quaternion';
import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';
import { Vector4 } from './Vector4';
import { Matrix4 } from './Matrix4';

declare global {
    interface Math {
        rad(angle: number): number;
        deg(angle: number): number;
        EPSILON: number;
    } 
}

const PI_DIV_180 = Math.PI/180;

Math.rad = function(angle: number): number {
    return angle * PI_DIV_180;
}

Math.deg = function(angle: number): number {
    return angle * PI_DIV_180;
}

Math.EPSILON = 0.000001;

export {
    Vector2, Vector3, Vector4,
    Matrix4,
    Quaternion
}

export default {
    Vector2, Vector3, Vector4,
    Matrix4,
    Quaternion
}











