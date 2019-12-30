import { Vector3 } from './Vector3';
import './Math';

// @todo: write tests
export class Quaternion extends Array<number> {

    
    private constructor(array: [number,number,number,number]) {
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    /**
     * 
     * @param {[number,number,number]} array array of length 3
     * @returns {Quaternion} resulting quaternion
     */
    public static create(array?: [number,number,number,number]): Quaternion {
        return new Quaternion(array || [0,0,0,0]);
    }

    public static identity(): Quaternion {
        return new Quaternion([0,0,0,1]);
    }

    /**
     * Creates a new quaternion from an existing one
     * @returns {Quaternion} new quaternion
     */
    public clone(): Quaternion {
        return Quaternion.create([this[0], this[1], this[2], this[3]]);
    }

    /**
     * Copies the values of one quaternion to another
     * @param {Quaternion} out receiving quaternion
     */
    public copy(out: Quaternion) {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
    }

    /**
     * Adds other quaternion to the receiving quaternion
     * @this {this} first operand
     * @param {Quaternion} that second operand
     */
    public add(that: Quaternion): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];
        this[2] = this[2] + that[2];
        this[3] = this[3] + that[3];

        return this;
    }

    /**
     * Subtracts other quaternion from the receiving quaternion
     * @this {this} first operand
     * @param {Quaternion} that second operand
     */
    public sub(that: Quaternion): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];
        this[2] = this[2] - that[2];
        this[3] = this[3] - that[3];

        return this;
    }

    /**
     * Scales receiving quaternion by some amount
     * @param {number} amount the amount to scale by
     */
    public scale(amount: number): this {
        this[0] = this[0] * amount;
        this[1] = this[1] * amount;
        this[2] = this[2] * amount;
        this[3] = this[3] * amount;

        return this;
    }

    /**
     * Normalize the receiving quaternion
     */
    public normalize(): this {
        let x = this[0];
        let y = this[1];
        let z = this[2];
        let w = this[3];
        let len = x * x + y * y + z * z + w * w;

        if (len > 0) len = 1 / Math.sqrt(len);

        this[0] = this[0] * len;
        this[1] = this[1] * len;
        this[2] = this[2] * len;
        this[3] = this[3] * len;

        return this;
    }

    /**
     * Calculate the dot product of two quaternions
     * @this {this} first operand
     * @param {Quaternion} that second operand
     */
    public dot(that: Quaternion): number {
        return this[0] * that[0] 
             + this[1] * that[1]
             + this[2] * that[2]
             + this[3] * that[3];
    }

    /**
     * Linearly interpolate between two quaternions, resulting in a new quaternion
     * @param {Quaternion} a first operand
     * @param {Quaternion} b second operand
     * @param {number} weight number in range 0~1
     * @returns {Quaternion} resulting quaternion
     */
    public static lerp(a: Quaternion, b: Quaternion, weight: number): Quaternion {
        let out = Quaternion.create([
            a[0] + weight * (b[0] - a[0]),
            a[1] + weight * (b[1] - a[1]),
            a[2] + weight * (b[2] - a[2]),
            a[3] + weight * (b[3] - a[3])
        ]);
        return out;
    }

    public setAxisRotation(axis: Vector3, angle: number): Quaternion {
        angle = angle * 0.5;
        let s = Math.sin(angle);
        let out = Quaternion.create();
        out[0] = s * axis[0];
        out[1] = s * axis[1];
        out[2] = s * axis[2];
        out[3] = Math.cos(angle);
        return out;
    }

    public multiply(other: Quaternion): Quaternion {
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let bx = other[0],
            by = other[1],
            bz = other[2],
            bw = other[3];
        let out = Quaternion.create();
        out[0] = ax * bw + aw * bx + ay * bz - az * by;
        out[1] = ay * bw + aw * by + az * bx - ax * bz;
        out[2] = az * bw + aw * bz + ax * by - ay * bx;
        out[3] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    public rotateX(angle: number): Quaternion {
        angle *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let bx = Math.sin(angle),
            bw = Math.cos(angle);
        let out = Quaternion.create();
        out[0] = ax * bw + aw * bx;
        out[1] = ay * bw + az * bx;
        out[2] = az * bw - ay * bx;
        out[3] = aw * bw - ax * bx;
        return out;
    }

    public rotateY(angle: number): Quaternion {
        angle *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let by = Math.sin(angle),
            bw = Math.cos(angle);
        let out = Quaternion.create();
        out[0] = ax * bw - az * by;
        out[1] = ay * bw + aw * by;
        out[2] = az * bw + ax * by;
        out[3] = aw * bw - ay * by;
        return out;
    }

    public rotateZ(angle: number): Quaternion {
        angle *= 0.5;
        let ax = this[0],
            ay = this[1],
            az = this[2],
            aw = this[3];
        let bz = Math.sin(angle),
            bw = Math.cos(angle);
        let out = Quaternion.create();
        out[0] = ax * bw + ay * bz;
        out[1] = ay * bw - ax * bz;
        out[2] = az * bw + aw * bz;
        out[3] = aw * bw - az * bz;
        return out;
    }

    public exponential(): Quaternion {
        let x = this[0],
            y = this[1],
            z = this[2],
            w = this[3];
        let r = Math.sqrt(x * x + y * y + z * z);
        let et = Math.exp(w);
        let s = r > 0 ? et * Math.sin(r) / r : 0;
        let out = Quaternion.create();
        out[0] = x * s;
        out[1] = y * s;
        out[2] = z * s;
        out[3] = et * Math.cos(r);
        return out;
    }

    public ln(): Quaternion {
        var x = this[0],
            y = this[1],
            z = this[2],
            w = this[3];
        var r = Math.sqrt(x * x + y * y + z * z);
        var t = r > 0 ? Math.atan2(r, w) / r : 0;
        let out = Quaternion.create();
        out[0] = x * t;
        out[1] = y * t;
        out[2] = z * t;
        out[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
        return out;
    }

    public pow(scale: number): Quaternion {
        let out = this.ln();
        out = out.scale(scale);
        out = out.exponential();
        return out;
    }

    public static slerp(a: Quaternion, b: Quaternion, amount: number): Quaternion {
        let ax = a[0],
            ay = a[1],
            az = a[2],
            aw = a[3];
        let bx = b[0],
            by = b[1],
            bz = b[2],
            bw = b[3];
        let omega, cosom, sinom, scale0, scale1;
      
        cosom = ax * bx + ay * by + az * bz + aw * bw;
      
        if (cosom < 0.0) {
          cosom = -cosom;
          bx = -bx;
          by = -by;
          bz = -bz;
          bw = -bw;
        }
      
      
        if (1.0 - cosom > Math.EPSILON) {
          omega = Math.acos(cosom);
          sinom = Math.sin(omega);
          scale0 = Math.sin((1.0 - amount) * omega) / sinom;
          scale1 = Math.sin(amount * omega) / sinom;
        } else {
          // "from" and "to" quaternions are very close
          //  ... so we can do a linear interpolation
          scale0 = 1.0 - amount;
          scale1 = amount;
        } // calculate final values
      
        let out = Quaternion.create();
        out[0] = scale0 * ax + scale1 * bx;
        out[1] = scale0 * ay + scale1 * by;
        out[2] = scale0 * az + scale1 * bz;
        out[3] = scale0 * aw + scale1 * bw;
        return out;
    }

    public random(): Quaternion {
        let u1 = Math.random();
        let u2 = Math.random();
        let u3 = Math.random();
        let sqrt1MinusU1 = Math.sqrt(1 - u1);
        let sqrtU1 = Math.sqrt(u1);
        let out = Quaternion.create();
        out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
        out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
        out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
        out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
        return out;
    }

    public invert(): Quaternion {
        let a0 = this[0],
            a1 = this[1],
            a2 = this[2],
            a3 = this[3];
        let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        if(dot === 0) {
            return Quaternion.create([0,0,0,0]);
        }
        let invDot = 1.0 / dot;
        let out = Quaternion.create();
        out[0] = -a0 * invDot;
        out[1] = -a1 * invDot;
        out[2] = -a2 * invDot;
        out[3] = a3 * invDot;
        return out;
    }

    public conjugate(): Quaternion {
        let out = Quaternion.create();
        out[0] = -this[0];
        out[1] = -this[1];
        out[2] = -this[2];
        out[3] = this[3];
        return out;
    }

    public fromEuler(x: number, y: number, z: number): Quaternion {
        var halfToRad = 0.5 * (Math.PI / 180);
        x *= halfToRad;
        y *= halfToRad;
        z *= halfToRad;
        var sx = Math.sin(x);
        var cx = Math.cos(x);
        var sy = Math.sin(y);
        var cy = Math.cos(y);
        var sz = Math.sin(z);
        var cz = Math.cos(z);
        let out = Quaternion.create();
        out[0] = sx * cy * cz - cx * sy * sz;
        out[1] = cx * sy * cz + sx * cy * sz;
        out[2] = cx * cy * sz - sx * sy * cz;
        out[3] = cx * cy * cz + sx * sy * sz;
        return out;
    }

    public static getAngle(a: Quaternion, b: Quaternion): number {
        let dotp = a.dot(b);
        return Math.acos(2 * dotp * dotp - 1);
    }

    /**
     * Checks for strict equality between two vectors
     * @this {this} first operand
     * @param {Quaternion} that second operand
     */
    public equals(that: Quaternion): boolean {
        return this[0] === that[0] && this[1] === that[1] && this[2] === that[2] && this[3] === that[3];
    }
}