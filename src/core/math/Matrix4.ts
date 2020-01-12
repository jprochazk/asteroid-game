import { Vector3 } from './Vector3';
import './Math';

export class Matrix4 extends Array<number> {

    private constructor(array: [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number]) {
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public static create(array?: [number,number,number,number,number,number,number,number,number,number,number,number,number,number,number,number]): Matrix4 {
        return new Matrix4(array || [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    }

    public static identity(): Matrix4 {
        return new Matrix4([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
    }

    public clone(): Matrix4 {
        let out = Matrix4.create();
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
        out[4] = this[4];
        out[5] = this[5];
        out[6] = this[6];
        out[7] = this[7];
        out[8] = this[8];
        out[9] = this[9];
        out[10] = this[10];
        out[11] = this[11];
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
        return out;
    }

    public copy(out: Matrix4): void {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
        out[4] = this[4];
        out[5] = this[5];
        out[6] = this[6];
        out[7] = this[7];
        out[8] = this[8];
        out[9] = this[9];
        out[10] = this[10];
        out[11] = this[11];
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
    }

    public transpose(): Matrix4 {
        let out = Matrix4.create();
        out[0] = this[0];
        out[1] = this[4];
        out[2] = this[8];
        out[3] = this[12];
        out[4] = this[1];
        out[5] = this[5];
        out[6] = this[9];
        out[7] = this[13];
        out[8] = this[2];
        out[9] = this[6];
        out[10] = this[10];
        out[11] = this[14];
        out[12] = this[3];
        out[13] = this[7];
        out[14] = this[11];
        out[15] = this[15];
        return out;
    }

    public invert(): Matrix4 | null {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }

        det = 1.0 / det;
        let out = Matrix4.create();
        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return out;
    }

    public adjoint(): Matrix4 {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        let out = Matrix4.create();
        out[0] = a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22);
        out[1] = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
        out[2] = a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12);
        out[3] = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
        out[4] = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
        out[5] = a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22);
        out[6] = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
        out[7] = a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12);
        out[8] = a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21);
        out[9] = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
        out[10] = a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11);
        out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
        out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
        out[13] = a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21);
        out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
        out[15] = a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11);
        return out;
    }

    public determinant(): number {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15];
        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32; // Calculate the determinant
    
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    public multiply(other: Matrix4): Matrix4 {
        let a00 = this[0],
            a01 = this[1],
            a02 = this[2],
            a03 = this[3];
        let a10 = this[4],
            a11 = this[5],
            a12 = this[6],
            a13 = this[7];
        let a20 = this[8],
            a21 = this[9],
            a22 = this[10],
            a23 = this[11];
        let a30 = this[12],
            a31 = this[13],
            a32 = this[14],
            a33 = this[15]; // Cache only the current line of the second matrix
    
        let b0 = other[0],
            b1 = other[1],
            b2 = other[2],
            b3 = other[3];

        let out = Matrix4.create();
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other[4];
        b1 = other[5];
        b2 = other[6];
        b3 = other[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other[8];
        b1 = other[9];
        b2 = other[10];
        b3 = other[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = other[12];
        b1 = other[13];
        b2 = other[14];
        b3 = other[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
    }

    public translate(offset: Vector3): Matrix4 {
        let x = offset[0],
            y = offset[1],
            z = offset[2];
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let out = Matrix4.create();
        if (this === out) {
            out[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
            out[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
            out[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
            out[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
        } else {
            a00 = this[0];
            a01 = this[1];
            a02 = this[2];
            a03 = this[3];
            a10 = this[4];
            a11 = this[5];
            a12 = this[6];
            a13 = this[7];
            a20 = this[8];
            a21 = this[9];
            a22 = this[10];
            a23 = this[11];
            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a03;
            out[4] = a10;
            out[5] = a11;
            out[6] = a12;
            out[7] = a13;
            out[8] = a20;
            out[9] = a21;
            out[10] = a22;
            out[11] = a23;
            out[12] = a00 * x + a10 * y + a20 * z + this[12];
            out[13] = a01 * x + a11 * y + a21 * z + this[13];
            out[14] = a02 * x + a12 * y + a22 * z + this[14];
            out[15] = a03 * x + a13 * y + a23 * z + this[15];
        }

        return out;
    }

    public scale(scale: Vector3) {
        let x = scale[0],
            y = scale[1],
            z = scale[2];
        let out = Matrix4.create();
        out[0] = this[0] * x;
        out[1] = this[1] * x;
        out[2] = this[2] * x;
        out[3] = this[3] * x;
        out[4] = this[4] * y;
        out[5] = this[5] * y;
        out[6] = this[6] * y;
        out[7] = this[7] * y;
        out[8] = this[8] * z;
        out[9] = this[9] * z;
        out[10] = this[10] * z;
        out[11] = this[11] * z;
        out[12] = this[12];
        out[13] = this[13];
        out[14] = this[14];
        out[15] = this[15];
        return out;
    }

    public rotate(angle: number, axis: Vector3): Matrix4 | null {
        let x = axis[0],
            y = axis[1],
            z = axis[2];
        let len = Math.hypot(x, y, z);
        let s, c, t;
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;
        let b00, b01, b02;
        let b10, b11, b12;
        let b20, b21, b22;
      
        if (len < Math.EPSILON) {
          return null;
        }
      
        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;
        s = Math.sin(angle);
        c = Math.cos(angle);
        t = 1 - c;
        a00 = this[0];
        a01 = this[1];
        a02 = this[2];
        a03 = this[3];
        a10 = this[4];
        a11 = this[5];
        a12 = this[6];
        a13 = this[7];
        a20 = this[8];
        a21 = this[9];
        a22 = this[10];
        a23 = this[11]; // Construct the elements of the rotation matrix
      
        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c; // Perform rotation-specific matrix multiplication
        
        let out = Matrix4.create();
        out[0] = a00 * b00 + a10 * b01 + a20 * b02;
        out[1] = a01 * b00 + a11 * b01 + a21 * b02;
        out[2] = a02 * b00 + a12 * b01 + a22 * b02;
        out[3] = a03 * b00 + a13 * b01 + a23 * b02;
        out[4] = a00 * b10 + a10 * b11 + a20 * b12;
        out[5] = a01 * b10 + a11 * b11 + a21 * b12;
        out[6] = a02 * b10 + a12 * b11 + a22 * b12;
        out[7] = a03 * b10 + a13 * b11 + a23 * b12;
        out[8] = a00 * b20 + a10 * b21 + a20 * b22;
        out[9] = a01 * b20 + a11 * b21 + a21 * b22;
        out[10] = a02 * b20 + a12 * b21 + a22 * b22;
        out[11] = a03 * b20 + a13 * b21 + a23 * b22;
      
        if (this !== out) {
          // If the source and destination differ, copy the unchanged last row
          out[12] = this[12];
          out[13] = this[13];
          out[14] = this[14];
          out[15] = this[15];
        }
      
        return out;
    }

    public rotateX(angle: number): Matrix4 | null {
        return this.rotate(angle, Vector3.create([1,0,0]));
    }

    public rotateY(angle: number): Matrix4 | null {
        return this.rotate(angle, Vector3.create([0,1,0]));
    }

    public rotateZ(angle: number): Matrix4 | null {
        return this.rotate(angle, Vector3.create([0,0,1]));
    }

    public static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
        let out = Matrix4.create();
        let rl = 1 / (right - left);
        let tb = 1 / (top - bottom);
        let nf = 1 / (near - far);
        out[0] = near * 2 * rl;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = near * 2 * tb;
        out[6] = 0;
        out[7] = 0;
        out[8] = (right + left) * rl;
        out[9] = (top + bottom) * tb;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = far * near * 2 * nf;
        out[15] = 0;
        return out;
    }

    public static perspective(fov: number, aspect: number, near: number, far: number): Matrix4 {
        let out = Matrix4.create();
        let f = 1.0 / Math.tan(fov / 2), nf;
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[15] = 0;

        if (far != null && far !== Infinity) {
            nf = 1 / (near - far);
            out[10] = (far + near) * nf;
            out[14] = 2 * far * near * nf;
        } else {
            out[10] = -1;
            out[14] = -2 * near;
        }

        return out;
    }

    public static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
        let out = Matrix4.create();
        let lr = 1 / (left - right);
        let bt = 1 / (bottom - top);
        let nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    }

    public static lookAt(eye: Vector3, center: Vector3, up: Vector3 = Vector3.create([0,1,0])): Matrix4 {
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
        var eyex = eye[0];
        var eyey = eye[1];
        var eyez = eye[2];
        var upx = up[0];
        var upy = up[1];
        var upz = up[2];
        var centerx = center[0];
        var centery = center[1];
        var centerz = center[2];

        if (Math.abs(eyex - centerx) < Math.EPSILON && Math.abs(eyey - centery) < Math.EPSILON && Math.abs(eyez - centerz) < Math.EPSILON) {
            return Matrix4.identity();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;
        len = 1 / Math.hypot(z0, z1, z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;
        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.hypot(x0, x1, x2);

        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;
        len = Math.hypot(y0, y1, y2);

        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        let out = Matrix4.create();
        out[0] = x0;
        out[1] = y0;
        out[2] = z0;
        out[3] = 0;
        out[4] = x1;
        out[5] = y1;
        out[6] = z1;
        out[7] = 0;
        out[8] = x2;
        out[9] = y2;
        out[10] = z2;
        out[11] = 0;
        out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out[15] = 1;
        return out;
    }

    public add(other: Matrix4): Matrix4 {
        let out = Matrix4.create();
        out[0] = other[0] + this[0];
        out[1] = other[1] + this[1];
        out[2] = other[2] + this[2];
        out[3] = other[3] + this[3];
        out[4] = other[4] + this[4];
        out[5] = other[5] + this[5];
        out[6] = other[6] + this[6];
        out[7] = other[7] + this[7];
        out[8] = other[8] + this[8];
        out[9] = other[9] + this[9];
        out[10] = other[10] + this[10];
        out[11] = other[11] + this[11];
        out[12] = other[12] + this[12];
        out[13] = other[13] + this[13];
        out[14] = other[14] + this[14];
        out[15] = other[15] + this[15];
        return out;
    }

    public sub(other: Matrix4): Matrix4 {
        let out = Matrix4.create();
        out[0] = this[0] - other[0];
        out[1] = this[1] - other[1];
        out[2] = this[2] - other[2];
        out[3] = this[3] - other[3];
        out[4] = this[4] - other[4];
        out[5] = this[5] - other[5];
        out[6] = this[6] - other[6];
        out[7] = this[7] - other[7];
        out[8] = this[8] - other[8];
        out[9] = this[9] - other[9];
        out[10] = this[10] - other[10];
        out[11] = this[11] - other[11];
        out[12] = this[12] - other[12];
        out[13] = this[13] - other[13];
        out[14] = this[14] - other[14];
        out[15] = this[15] - other[15];
        return out;
    }

    public multiplyScalar(scalar: number): Matrix4 {
        let out = Matrix4.create();
        out[0] = this[0] * scalar;
        out[1] = this[1] * scalar;
        out[2] = this[2] * scalar;
        out[3] = this[3] * scalar;
        out[4] = this[4] * scalar;
        out[5] = this[5] * scalar;
        out[6] = this[6] * scalar;
        out[7] = this[7] * scalar;
        out[8] = this[8] * scalar;
        out[9] = this[9] * scalar;
        out[10] = this[10] * scalar;
        out[11] = this[11] * scalar;
        out[12] = this[12] * scalar;
        out[13] = this[13] * scalar;
        out[14] = this[14] * scalar;
        out[15] = this[15] * scalar;
        return out;
    }
}