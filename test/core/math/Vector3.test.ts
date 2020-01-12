import { Vector3 } from '../../../src/core/math/Math';

describe("Vector3", function() {
    test("Vector3.equals()", async function() {
        let vecA = Vector3.create([3,5,5]);
        let vecB = Vector3.create([3,5,5]);
    
        expect(vecA.equals(vecB)).toBe(true);
    });
    
    test("Vector3.equals()", async function() {
        let vecA = Vector3.create([3,5,5]);
        let vecB = Vector3.create([2,5,5]);
    
        expect(vecA.equals(vecB)).toBe(false);
    });
    
    test("Vector3.copy()", async function() {
        let vec = Vector3.create([3,5,5]);
    
        let expected = Vector3.create([3,5,5]);
        let actual = Vector3.create();
        vec.copy(actual);
    
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector3.clone()", async function() {
        let vec = Vector3.create([3,5,5]);
    
        let expected = Vector3.create([3,5,5]);
        let actual = vec.clone();
    
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector3.len()", async function() {
        let vec = Vector3.create([1,1,1]);
    
        expect(vec.len()).toBe(Math.sqrt(3));
    });
    
    test("Vector3.add()", async function() {
        let vecA = Vector3.create([0,1,0]);
        let vecB = Vector3.create([3,5,3]);
    
        let expected = Vector3.create([3,6,3]);
    
        vecA.add(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector3.sub()", async function() {
        let vecA = Vector3.create([3,5,3]);
        let vecB = Vector3.create([0,1,0]);
    
        let expected = Vector3.create([3,4,3]);
    
        vecA.sub(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector3.mult()", async function() {
        let vecA = Vector3.create([3,5,3]);
        let vecB = Vector3.create([0,1,0]);
    
        let expected = Vector3.create([0,5,0]);
    
        vecA.mult(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector3.div()", async function() {
        let vecA = Vector3.create([3,5,3]);
        let vecB = Vector3.create([1,1,1]);
    
        let expected = Vector3.create([3,5,3]);
    
        vecA.div(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector3.div()", async function() {
        let vecA = Vector3.create([3,5,3]);
        let vecB = Vector3.create([0,1,1]);
    
        try {
            vecA.div(vecB);
            
            throw new Error("Division by 0 did not throw!");
        } catch(err) {
            expect(err.message).toBe("Second operand has component 0!");
            return;
        }
    
    });
    
    test("Vector3.ceil()", async function() {
        let vec = Vector3.create([0.1,1.1,0.1]);
    
        let expected = Vector3.create([1,2,1]);
    
        vec.ceil();
        expect(expected.equals(vec)).toBe(true);
    });
    
    test("Vector3.floor()", async function() {
        let vec = Vector3.create([0.1,1.1,0.1]);
    
        let expected = Vector3.create([0,1,0]);
    
        vec.floor();
        expect(expected.equals(vec)).toBe(true);
    });
    
    test("Vector3.min()", async function() {
        let vecA = Vector3.create([3,5,3]);
        let vecB = Vector3.create([1,1,1]);
    
        let expected = Vector3.create([1,1,1]);
    
        let actual = Vector3.min(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector3.max()", async function() {
        let vecA = Vector3.create([3,5,3]);
        let vecB = Vector3.create([1,1,1]);
    
        let expected = Vector3.create([3,5,3]);
    
        let actual = Vector3.max(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector3.minc()", async function() {
        let vecA = Vector3.create([1,5,3]);
        let vecB = Vector3.create([3,4,3]);
    
        let expected = Vector3.create([1,4,3]);
    
        let actual = Vector3.minc(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector3.maxc()", async function() {
        let vecA = Vector3.create([2,5,3]);
        let vecB = Vector3.create([4,3,3]);
    
        let expected = Vector3.create([4,5,3]);
    
        let actual = Vector3.maxc(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector3.scale()", async function() {
        let vecA = Vector3.create([1,1,1]);
        let scale = 5;
    
        let expected = Vector3.create([5,5,5]);
    
        vecA.scale(scale);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector3.dist()", async function() {
        let vecA = Vector3.create([3,5,1]);
        let vecB = Vector3.create([0,1,3]);
    
        let expected = Math.hypot(3,4,2);
    
        let actual = vecA.dist(vecB);
        expect(expected === actual).toBe(true);
    });
    
    test("Vector3.negate()", async function() {
        let vecA = Vector3.create([1,1,1]);
    
        let expected = Vector3.create([-1,-1,-1]);
    
        vecA.negate();
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector3.inverse()", async function() {
        let vecA = Vector3.create([5,5,5]);
    
        let expected = Vector3.create([0.2,0.2,0.2]);
    
        vecA.inverse();
        expect(expected.equals(vecA)).toBe(true);
    });
    
    // Had some trouble with this one. It's precise up to ~7 decimal places,
    // so I resorted to comparing the numbers as strings.
    test("Vector3.normalize()", async function() {
        let vecA = Vector3.create([5,5,5]);
    
        let expected = ["0.5773503","0.5773503","0.5773503"];
    
        let actual = vecA.normalize();
        expect(expected[0] === actual[0].toPrecision(7)).toBe(true);
        expect(expected[1] === actual[1].toPrecision(7)).toBe(true);
        expect(expected[2] === actual[2].toPrecision(7)).toBe(true);
    });
    
    test("Vector3.dot()", async function() {
        let vecA = Vector3.create([5,5,5]);
        let vecB = Vector3.create([5,5,5]);
    
        let expected = 75;
    
        let actual = vecA.dot(vecB);
        expect(expected === actual).toBe(true);
    });
    
    test("Vector3.cross()", async function() {
        let vecA = Vector3.create([5,5,5]);
        let vecB = Vector3.create([5,5,5]);
    
        let expected = Vector3.create([0,0,0]);
    
        let actual = vecA.cross(vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector3.lerp()", async function() {
        let vecA = Vector3.create([0,0,0]);
        let vecB = Vector3.create([5,5,5]);
    
        let expected = Vector3.create([2.5,2.5,2.5]);
    
        let actual = Vector3.lerp(vecA, vecB, 0.5);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector3.random()", async function() {
        let vecA = Vector3.random();
        let vecB = Vector3.random();
        expect(vecA.equals(vecB)).toBe(false);
    });
    
    test("Vector3.zero()", async function() {
        let vecA = Vector3.create([5,5,5]);
    
        let expected = Vector3.create([0,0,0]);
    
        vecA.zero();
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector3.toString()", async function() {
        let vecA = Vector3.create([5,5,5]);
    
        let expected = "5,5,5";
        expect(expected === vecA.toString()).toBe(true);
    });
    
});