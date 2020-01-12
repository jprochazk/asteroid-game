import { Vector2, Vector3 } from '../../../src/core/math/Math';

describe("Vector2", function() {
    test("Vector2.equals()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([3,5]);
    
        expect(vecA.equals(vecB)).toBe(true);
    });
    
    test("Vector2.equals()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([2,5]);
    
        expect(vecA.equals(vecB)).toBe(false);
    });
    
    test("Vector2.copy()", async function() {
        let vec = Vector2.create([3,5]);
    
        let expected = Vector2.create([3,5]);
        let actual = Vector2.create();
        vec.copy(actual);
    
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector2.clone()", async function() {
        let vec = Vector2.create([3,5]);
    
        let expected = Vector2.create([3,5]);
        let actual = vec.clone();
    
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector2.len()", async function() {
        let vec = Vector2.create([1,1]);
    
        expect(vec.len()).toBe(Math.SQRT2);
    });
    
    test("Vector2.add()", async function() {
        let vecA = Vector2.create([0,1]);
        let vecB = Vector2.create([3,5]);
    
        let expected = Vector2.create([3,6]);
    
        vecA.add(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector2.sub()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([0,1]);
    
        let expected = Vector2.create([3,4]);
    
        vecA.sub(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector2.mult()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([0,1]);
    
        let expected = Vector2.create([0,5]);
    
        vecA.mult(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector2.div()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([1,1]);
    
        let expected = Vector2.create([3,5]);
    
        vecA.div(vecB);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector2.div()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([0,1]);
        try {
            vecA.div(vecB);
            
            throw new Error("Division by 0 did not throw!");
        } catch(err) {
            expect(err.message).toBe("Second operand has component 0!");
        }
    });
    
    test("Vector2.ceil()", async function() {
        let vec = Vector2.create([0.1,1.1]);
    
        let expected = Vector2.create([1,2]);
    
        vec.ceil();
        expect(expected.equals(vec)).toBe(true);
    });
    
    test("Vector2.floor()", async function() {
        let vec = Vector2.create([0.1,1.1]);
    
        let expected = Vector2.create([0,1]);
    
        vec.floor();
        expect(expected.equals(vec)).toBe(true);
    });
    
    test("Vector2.min()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([1,1]);
    
        let expected = Vector2.create([1,1]);
    
        let actual = Vector2.min(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector2.max()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([1,1]);
    
        let expected = Vector2.create([3,5]);
    
        let actual = Vector2.max(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector2.minc()", async function() {
        let vecA = Vector2.create([1,5]);
        let vecB = Vector2.create([3,4]);
    
        let expected = Vector2.create([1,4]);
    
        let actual = Vector2.minc(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector2.maxc()", async function() {
        let vecA = Vector2.create([2,5]);
        let vecB = Vector2.create([4,3]);
    
        let expected = Vector2.create([4,5]);
    
        let actual = Vector2.maxc(vecA, vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector2.scale()", async function() {
        let vecA = Vector2.create([1,1]);
        let scale = 5;
    
        let expected = Vector2.create([5,5]);
    
        vecA.scale(scale);
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector2.dist()", async function() {
        let vecA = Vector2.create([3,5]);
        let vecB = Vector2.create([0,1]);
    
        let expected = Math.hypot(3,4);
    
        let actual = vecA.dist(vecB);
        expect(expected === actual).toBe(true);
    });
    
    test("Vector2.negate()", async function() {
        let vecA = Vector2.create([1,1]);
    
        let expected = Vector2.create([-1,-1]);
    
        vecA.negate();
        expect(expected.equals(vecA)).toBe(true);
    }); 
    
    test("Vector2.inverse()", async function() {
        let vecA = Vector2.create([5,5]);
    
        let expected = Vector2.create([0.2,0.2]);
    
        vecA.inverse();
        expect(expected.equals(vecA)).toBe(true);
    });
    
    // Had some trouble with this one. It's precise up to ~7 decimal places,
    // so I resorted to comparing the numbers as strings.
    test("Vector2.normalize()", async function() {
        let vecA = Vector2.create([5,5]);
    
        let expected = ["0.7071068","0.7071068"];
    
        let actual = vecA.normalize();
        expect(expected[0] === actual[0].toPrecision(7)).toBe(true);
        expect(expected[1] === actual[1].toPrecision(7)).toBe(true);
    });
    
    test("Vector2.dot()", async function() {
        let vecA = Vector2.create([5,5]);
        let vecB = Vector2.create([5,5]);
    
        let expected = 50;
    
        let actual = vecA.dot(vecB);
        expect(expected === actual).toBe(true);
    });
    
    test("Vector2.cross()", async function() {
        let vecA = Vector2.create([5,5]);
        let vecB = Vector2.create([5,5]);
    
        let expected = Vector3.create([0,0,0]);
    
        let actual = vecA.cross(vecB);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector2.lerp()", async function() {
        let vecA = Vector2.create([0,0]);
        let vecB = Vector2.create([5,5]);
    
        let expected = Vector2.create([2.5,2.5]);
    
        let actual = Vector2.lerp(vecA, vecB, 0.5);
        expect(expected.equals(actual)).toBe(true);
    });
    
    test("Vector2.random()", async function() {
        let vecA = Vector2.random();
        let vecB = Vector2.random();
        expect(vecA.equals(vecB)).toBe(false);
    });
    
    test("Vector2.zero()", async function() {
        let vecA = Vector2.create([5,5]);
    
        let expected = Vector2.create([0,0]);
    
        vecA.zero();
        expect(expected.equals(vecA)).toBe(true);
    });
    
    test("Vector2.toString()", async function() {
        let vecA = Vector2.create([5,5]);
    
        let expected = "5,5";
        expect(expected === vecA.toString()).toBe(true);
    });
    
});