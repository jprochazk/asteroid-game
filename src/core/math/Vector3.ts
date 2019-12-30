export class Vector3 extends Array<number> {
    
    private constructor(array: [number,number,number]) {
        super(...array);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    public toArray(): Array<number> { return [this[0], this[1], this[2] ]; }

    public get x(): number { return this[0]; }
    public get y(): number { return this[1]; }
    public get z(): number { return this[2]; }

    /**
     * 
     * @param {[number,number,number]} array array of length 3
     * @returns {Vector3} resulting vector
     */
    public static create(array?: [number,number,number]): Vector3 {
        return new Vector3(array || [0,0,0]);
    }

    /**
     * Creates a new vector from an existing one
     * @returns {Vector3} new vector
     */
    public clone(): Vector3 {
        return Vector3.create([this[0], this[1], this[2]]);
    }

    /**
     * Copies the values of one vector to another
     * @param {Vector3} out receiving vector
     */
    public copy(out: Vector3) {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
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
     * @param {Vector3} that second operand
     */
    public add(that: Vector3): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];
        this[2] = this[2] + that[2];

        return this;
    }

    /**
     * Subtracts other vector from the receiving vector
     * @this {this} first operand
     * @param {Vector3} that second operand
     */
    public sub(that: Vector3): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];
        this[2] = this[2] - that[2];

        return this;
    }

    /**
     * Multiples receiving vector by the other vector
     * @this {this} first operand
     * @param {Vector3} that second operand
     */
    public mult(that: Vector3): this {
        this[0] = this[0] * that[0];
        this[1] = this[1] * that[1];
        this[2] = this[2] * that[2];

        return this;
    }

    /**
     * Divides receiving vector by the other vector
     * @this {this} first operand
     * @param {Vector3} that second operand
     */
    public div(that: Vector3): this {
        if(that[0] === 0) throw new Error("Second operand has component 0!");
        if(that[1] === 0) throw new Error("Second operand has component 0!");
        if(that[2] === 0) throw new Error("Second operand has component 0!");
        this[0] = this[0] / that[0];
        this[1] = this[1] / that[1];
        this[2] = this[2] / that[2];

        return this;
    }

    /**
     * Applies Math.ceil to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);

        return this;
    }

    /**
     * Applies Math.floor to all components of the receiving vector
     * @this {this} vector to apply operation to
     */
    public floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);

        return this;
    }

    /**
     * Returns the length-wise min of two vectors
     * @param {Vector3} a first vector
     * @param {Vector3} b second vector
     */
    public static min(a: Vector3, b: Vector3): Vector3 {
        return (a.len() < b.len()) ? a : b;
    }

    /**
     * Returns the length-wise max of two vectors
     * @param {Vector3} a first vector
     * @param {Vector3} b second vector
     */
    public static max(a: Vector3, b: Vector3): Vector3 {
        return (a.len() > b.len()) ? a : b;
    }

    /**
     * Takes the min of each component of two vectors, creating a new vector
     * @param {Vector3} a first vector
     * @param {Vector3} b second vector
     */
    public static minc(a: Vector3, b: Vector3): Vector3 {
        let out = Vector3.create();
        out[0] = Math.min(a[0], b[0]);
        out[1] = Math.min(a[1], b[1]);
        out[2] = Math.min(a[2], b[2]);
        return out;
    }

    /**
     * Takes the max of each component of two vectors, creating a new vector
     * @param {Vector3} a first vector
     * @param {Vector3} b second vector
     */
    public static maxc(a: Vector3, b: Vector3): Vector3 {
        let out = Vector3.create();
        out[0] = Math.max(a[0], b[0]);
        out[1] = Math.max(a[1], b[1]);
        out[2] = Math.max(a[2], b[2]);
        return out;
    }

    /**
     * Scales receiving vector by some amount
     * @param {number} amount the amount to scale by
     */
    public scale(amount: number): this {
        this[0] = this[0] * amount;
        this[1] = this[1] * amount;
        this[2] = this[2] * amount;

        return this;
    }

    /**
     * Calculate the distance between two vectors
     * @param that 
     * @returns {number} distance
     */
    public dist(that: Vector3): number {
        let x = that[0] - this[0];
        let y = that[1] - this[1];
        let z = that[2] - this[2];
        return Math.hypot(x,y,z);
    }

    /**
     * Component-wise negation of the receiving vector
     */
    public negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];

        return this;
    }

    /**
     * Component-wise inversion of the receiving vector
     */
    public inverse(): this {
        this[0] = 1.0 / this[0];
        this[1] = 1.0 / this[1];
        this[2] = 1.0 / this[2];

        return this;
    }

    /**
     * Normalize the receiving vector
     */
    public normalize(): this {
        let x = this[0];
        let y = this[1];
        let z = this[2];
        let len = x * x + y * y + z * z;

        if (len > 0) len = 1 / Math.sqrt(len);

        this[0] = this[0] * len;
        this[1] = this[1] * len;
        this[2] = this[2] * len;

        return this;
    }

    /**
     * Calculate the dot product of two vectors
     * @this {this} first operand
     * @param {Vector3} that second operand
     */
    public dot(that: Vector3): number {
        return this[0] * that[0] + this[1] * that[1] + this[2] * that[2]
    }

    /**
     * Calculate the cross product of two vectors
     * @this {this} first operand
     * @param {Vector3} that second operand
     * @returns {Vector3} resulting vector
     */
    public cross(that: Vector3): Vector3 {
        let ax = this[0],
            ay = this[1],
            az = this[2];
        let bx = that[0],
            by = that[1],
            bz = that[2];
        let out = Vector3.create();
        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }

    /**
     * Linearly interpolate between two vectors, resulting in a new vector
     * @param {Vector3} a first operand
     * @param {Vector3} b second operand
     * @param {number} weight number in range 0~1
     * @returns {Vector3} resulting vector
     */
    public static lerp(a: Vector3, b: Vector3, weight: number): Vector3 {
        let ax = a[0];
        let ay = a[1];
        let az = a[2];

        let out = Vector3.create();
        out[0] = ax + weight * (b[0] - ax);
        out[1] = ay + weight * (b[1] - ay);
        out[2] = az + weight * (b[2] - az);
        return out;
    }

    /**
     * Generates a random vector of max length scale  
     * Returns a unit vector if no scale is given
     * @param {number} scale amount to scale final vector
     * @returns {Vector3} resulting vector
     */
    public static random(scale: number = 1.0): Vector3 {
        let r = Math.random() * 2.0 * Math.PI;
        let z = Math.random() * 2.0 - 1.0;
        let zScale = Math.sqrt(1.0 - z * z) * scale;

        let out = Vector3.create();
        out[0] = Math.cos(r) * zScale;
        out[1] = Math.sin(r) * zScale;
        out[2] = z * scale;
        return out;
    }

    /**
     * Sets all components of the receiving vector to 0
     */
    public zero(): this {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;

        return this;
    }

    /**
     * Checks for strict equality between two vectors
     * @this {this} first operand
     * @param {Vector3} that second operand
     */
    public equals(that: Vector3): boolean {
        return this[0] === that[0] && this[1] === that[1] && this[2] === that[2];
    }
}