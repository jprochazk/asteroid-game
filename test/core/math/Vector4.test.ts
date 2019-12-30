import { Vector4 } from '../../../src/core/math/Math';

describe("Vector4", function() {
    test("Vector4.equals()", async function() {
        let vecA = Vector4.create([3,5,5,3]);
        let vecB = Vector4.create([3,5,5,3]);
    
        expect(vecA.equals(vecB)).toBe(true);
    });
    
    test("Vector4.equals()", async function() {
        let vecA = Vector4.create([3,5,5,3]);
        let vecB = Vector4.create([2,5,5,3]);
    
        expect(vecA.equals(vecB)).toBe(false);
    });
    
    test("Vector4.copy()", async function() {
        let vec = Vector4.create([3,5,5,3]);
    
        let expected = Vector4.create([3,5,5,3]);
        let actual = Vector4.create();
        vec.copy(actual);
    
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector4.clone()", async function() {
        let vec = Vector4.create([3,5,5,3]);
    
        let expected = Vector4.create([3,5,5,3]);
        let actual = vec.clone();
    
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector4.len()", async function() {
        let vec = Vector4.create([1,1,1,1]);
    
        expect(vec.len()).toBe(Math.sqrt(4));
    });
    
    test("Vector4.add()", async function() {
        let vecA = Vector4.create([0,1,0,0]);
        let vecB = Vector4.create([3,5,3,3]);
    
        let expected = Vector4.create([3,6,3,3]);
    
        vecA.add(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector4.sub()", async function() {
        let vecA = Vector4.create([3,5,3,3]);
        let vecB = Vector4.create([0,1,0,0]);
    
        let expected = Vector4.create([3,4,3,3]);
    
        vecA.sub(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector4.mult()", async function() {
        let vecA = Vector4.create([3,5,3,3]);
        let vecB = Vector4.create([0,1,0,0]);
    
        let expected = Vector4.create([0,5,0,0]);
    
        vecA.mult(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector4.div()", async function() {
        let vecA = Vector4.create([3,5,3,3]);
        let vecB = Vector4.create([1,1,1,1]);
    
        let expected = Vector4.create([3,5,3,3]);
    
        vecA.div(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector4.div()", async function() {
        let vecA = Vector4.create([3,5,3,3]);
        let vecB = Vector4.create([0,1,1,0]);
    
        try {
            vecA.div(vecB);
            
            throw new Error("Division by 0 did not throw!");
        } catch(err) {
            expect(err.message).toBe("Second operand has component 0!");
            return;
        }
    
    });
    
    test("Vector4.ceil()", async function() {
        let vec = Vector4.create([0.1,1.1,0.1,0]);
    
        let expected = Vector4.create([1,2,1,0]);
    
        vec.ceil();
        expect(expected.equals(vec)).toBe(true);
    });
    
    test("Vector4.floor()", async function() {
        let vec = Vector4.create([0.1,1.1,0.1,0]);
    
        let expected = Vector4.create([0,1,0,0]);
    
        vec.floor();
        expect(expected.equals(vec)).toBe(true);
    });
    
    test("Vector4.min() (static)", async function() {
        let vecA = Vector4.create([3,5,3,0]);
        let vecB = Vector4.create([1,1,1,0]);
    
        let expected = Vector4.create([1,1,1,0]);
    
        let actual = Vector4.min(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector4.max() (static)", async function() {
        let vecA = Vector4.create([3,5,3,0]);
        let vecB = Vector4.create([1,1,1,0]);
    
        let expected = Vector4.create([3,5,3,0]);
    
        let actual = Vector4.max(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector4.minc() (static)", async function() {
        let vecA = Vector4.create([1,5,3,0]);
        let vecB = Vector4.create([3,4,3,0]);
    
        let expected = Vector4.create([1,4,3,0]);
    
        let actual = Vector4.minc(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector4.maxc() (static)", async function() {
        let vecA = Vector4.create([2,5,3,0]);
        let vecB = Vector4.create([4,3,3,0]);
    
        let expected = Vector4.create([4,5,3,0]);
    
        let actual = Vector4.maxc(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector4.scale()", async function() {
        let vecA = Vector4.create([1,1,1,1]);
        let scale = 5;
    
        let expected = Vector4.create([5,5,5,5]);
    
        vecA.scale(scale);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector4.dist()", async function() {
        let vecA = Vector4.create([3,5,1,0]);
        let vecB = Vector4.create([0,1,3,2]);
    
        let expected = Math.hypot(3,4,2,2);
    
        let actual = vecA.dist(vecB);
        expect(expected === actual).toBe(true);
    });
    
    test("Vector4.negate()", async function() {
        let vecA = Vector4.create([1,1,1,1]);
    
        let expected = Vector4.create([-1,-1,-1,-1]);
    
        vecA.negate();
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector4.inverse()", async function() {
        let vecA = Vector4.create([5,5,5,5]);
    
        let expected = Vector4.create([0.2,0.2,0.2,0.2]);
    
        vecA.inverse();
        expect(expected.equals(vecA)).toBe(true);
    });
    
    // Had some trouble with this one. It's precise up to ~7 decimal places,
    // so I resorted to comparing the numbers as strings.
    test("Vector4.normalize()", async function() {
        let vecA = Vector4.create([5,5,5,5]);
    
        let expected = ["0.5","0.5","0.5","0.5"];
    
        let actual = vecA.normalize();
        expect(expected[0] === actual[0].toString()).toBe(true);
        expect(expected[1] === actual[1].toString()).toBe(true);
        expect(expected[2] === actual[2].toString()).toBe(true);
    });
    
    test("Vector4.dot()", async function() {
        let vecA = Vector4.create([5,5,5,5]);
        let vecB = Vector4.create([5,5,5,5]);
    
        let expected = 100;
    
        let actual = vecA.dot(vecB);
        expect(expected === actual).toBe(true);
    });
    
    test("Vector4.cross()", async function() {
        let vecA = Vector4.create([5,5,5,5]);
        let vecB = Vector4.create([5,5,5,5]);
        let vecC = Vector4.create([5,5,5,5]);
    
        let expected = Vector4.create([0,0,0,0]);
    
        let actual = Vector4.cross(vecA, vecB, vecC);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector4.lerp()", async function() {
        let vecA = Vector4.create([0,0,0,0]);
        let vecB = Vector4.create([5,5,5,5]);
    
        let expected = Vector4.create([2.5,2.5,2.5,2.5]);
    
        let actual = Vector4.lerp(vecA, vecB, 0.5);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector4.random()", async function() {
        let vecA = Vector4.random();
        let vecB = Vector4.random();
        expect(vecA.equals(vecB)).toBe(false);
    });
    
    test("Vector4.zero()", async function() {
        let vecA = Vector4.create([5,5,5,5]);
    
        let expected = Vector4.create([0,0,0,0]);
    
        vecA.zero();
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector4.toString()", async function() {
        let vecA = Vector4.create([5,5,5,5]);
    
        let expected = "5,5,5,5";
        expect(expected === vecA.toString()).toBe(true);
    });
    
});