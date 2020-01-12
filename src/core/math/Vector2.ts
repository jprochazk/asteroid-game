import { Vector3 } from './Vector3';

export class Vector2 extends Array<number> {
    
    private constructor(array: [number,number]) { 
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public toArray(): Array<number> { return [this[0], this[1] ]; }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }

    /**
     * 
     * @param {[number,number,number]} array array of length 3
     * @returns {Vector2} resulting vector
     */
    public static create(array?: [number,number]): Vector2 {
        return new Vector2(array || [0,0]);
    }

    /**
     * Creates a new vector from an existing one
     * @returns {Vector2} new vector
     */
    public clone(): Vector2 {
        return Vector2.create([this[0], this[1]]);
    }

    /**
     * Copies the values of one vector to another
     * @param {Vector2} out receiving vector
     */
    public copy(out: Vector2) {
        out[0] = this[0];
        out[1] = this[1];
    }

    /**
     * @returns {number} length of the vector
     */
    public len(): number {
        return Math.hypot(...this);
    }

    /**
     * Adds other vector to the receiving vector
     * @this {this} first operand
     * @param {Vector2} that second operand
     */
    public add(that: Vector2): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];

        return this;
    }

    /**
     * Subtracts other vector from the receiving vector
     * @this {this} first operand
     * @param {Vector2} that second operand
     */
    public sub(that: Vector2): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];

        return this;
    }

    /**
     * Multiples receiving vector by the other vector
     * @this {this} first operand
     * @param {Vector2} that second operand
     */
    public mult(that: Vector2): this {
        this[0] = this[0] * that[0];
        this[1] = this[1] * that[1];

        return this;
    }

    /**
     * Divides receiving vector by the other vector
     * @this {this} first operand
     * @param {Vector2} that second operand
     */
    public div(that: Vector2): this {
        if(that[0] === 0) throw new Error("Second operand has component 0!");
        if(that[1] === 0) throw new Error("Second operand has component 0!");
        this[0] = this[0] / that[0];
        this[1] = this[1] / that[1];

        return this;
    }

    /**
     * Applies Math.ceil to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);

        return this;
    }

    /**
     * Applies Math.floor to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);

        return this;
    }

    /**
     * Returns the length-wise min of two vectors
     * @param {Vector2} a first vector
     * @param {Vector2} b second vector
     */
    public static min(a: Vector2, b: Vector2): Vector2 {
        return (a.len() < b.len()) ? a : b;
    }

    /**
     * Returns the length-wise max of two vectors
     * @param {Vector2} a first vector
     * @param {Vector2} b second vector
     */
    public static max(a: Vector2, b: Vector2): Vector2 {
        return (a.len() > b.len()) ? a : b;
    }

    /**
     * Takes the min of each component of two vectors, creating a new vector
     * @param {Vector2} a first vector
     * @param {Vector2} b second vector
     */
    public static minc(a: Vector2, b: Vector2): Vector2 {
        let out = Vector2.create([
            Math.min(a[0], b[0]),
            Math.min(a[1], b[1])
        ]);
        return out;
    }

    /**
     * Takes the max of each component of two vectors, creating a new vector
     * @param {Vector2} a first vector
     * @param {Vector2} b second vector
     */
    public static maxc(a: Vector2, b: Vector2): Vector2 {
        let out = Vector2.create([
            Math.max(a[0], b[0]), 
            Math.max(a[1], b[1])
        ]);
        return out;
    }

    /**
     * Scales receiving vector by some amount
     * @param {number} amount the amount to scale by
     */
    public scale(amount: number): this {
        this[0] = this[0] * amount;
        this[1] = this[1] * amount;

        return this;
    }

    /**
     * Calculate the distance between two vectors
     * @param that 
     * @returns {number} distance
     */
    public dist(that: Vector2): number {
        let x = that[0] - this[0];
        let y = that[1] - this[1];
        return Math.hypot(x,y);
    }

    /**
     * Component-wise negation of the receiving vector
     */
    public negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];

        return this;
    }

    /**
     * Component-wise inversion of the receiving vector
     */
    public inverse(): this {
        this[0] = 1.0 / this[0];
        this[1] = 1.0 / this[1];

        return this;
    }

    /**
     * Normalize the receiving vector
     */
    public normalize(): this {
        let x = this[0];
        let y = this[1];
        let len = x * x + y * y;

        if (len > 0) len = 1 / Math.sqrt(len);

        this[0] = this[0] * len;
        this[1] = this[1] * len;

        return this;
    }

    /**
     * Calculate the dot product of two vectors
     * @this {this} first operand
     * @param {Vector2} that second operand
     */
    public dot(that: Vector2): number {
        return this[0] * that[0] + this[1] * that[1];
    }

    /**
     * Calculate the cross product of two vectors
     * @this {this} first operand
     * @param {Vector2} that second operand
     * @returns {Vector2} resulting vector
     */
    public cross(that: Vector2): Vector3 {
        var z = this[0] * that[1] - this[1] * that[0];
        let out = Vector3.create([0,0,z]);
        return out;
    }

    /**
     * Linearly interpolate between two vectors, resulting in a new vector
     * @param {Vector2} a first operand
     * @param {Vector2} b second operand
     * @param {number} weight number in range 0~1
     * @returns {Vector2} resulting vector
     */
    public static lerp(a: Vector2, b: Vector2, weight: number): Vector2 {
        let out = Vector2.create([
            a[0] + weight * (b[0] - a[0]), 
            a[1] + weight * (b[1] - a[1])
        ])
        return out;
    }

    /**
     * Generates a random vector of max length scale  
     * Returns a unit vector if no scale is given
     * @param {number} scale amount to scale final vector
     * @returns {Vector2} resulting vector
     */
    public static random(scale: number = 1.0): Vector2 {
        let r = Math.random() * 2.0 * Math.PI;
        let out = Vector2.create([Math.cos(r) * scale, Math.sin(r) * scale]);
        return out;
    }

    /**
     * Sets all components of the receiving vector to 0
     */
    public zero(): this {
        this[0] = 0;
        this[1] = 0;

        return this;
    }

    /**
     * Checks for strict equality between two vectors
     * @this {this} first operand
     * @param {Vector2} that second operand
     */
    public equals(that: Vector2): boolean {
        return this[0] === that[0] && this[1] === that[1];
    }
}