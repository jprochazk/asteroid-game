import { Vector3, Matrix4 } from '../../../src/core/math/Math';

describe("Matrix4", function() { 
    test("Matrix4.identity()", async function() {
        let expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let actual = Matrix4.identity();
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.clone()", async function() {
        let expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let actual = Matrix4.identity().clone();
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.copy()", async function() {
        let expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let actual = Matrix4.create();
        Matrix4.identity().copy(actual);
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.transpose()", async function() {
        let expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let actual = Matrix4.identity().transpose();
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.invert()", async function() {
        let expected = [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1];
        let actual = Matrix4.identity().invert();
    
        if(actual === null) throw new Error("Actual should not be null!");
        if(expected === null) throw new Error("Expected should not be null!");
    
        for(let i = 0; i < actual.length; i++) {
            expect(actual[i]).toBeCloseTo(expected[i]);
        };
    });
    test("Matrix4.adjoint()", async function() {
        let expected = [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1];
        let actual = Matrix4.identity().adjoint();
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.determinant()", async function() {
        let expected = 1;
        let actual = Matrix4.identity().determinant();
    
        expect(actual).toBeCloseTo(expected);
    });
    test("Matrix4.multiply()", async function() {
        let expected = [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1];
        let actual = Matrix4.identity().multiply(Matrix4.identity().transpose());
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.translate()", async function() {
        let expected = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 2, 2, 2, 1];
        let actual = Matrix4.identity().translate(Vector3.create([2,2,2]));
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.scale()", async function() {
        let expected = [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        let actual = Matrix4.identity().scale(Vector3.create([2,2,1]));
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.rotate()", async function() {
        let expected = [1, 0, 0, 0, 0, 0.7071067811865476, 0.7071067811865475, 0, 0, -0.7071067811865475, 0.7071067811865476, 0, 0, 0, 0, 1];
        let actual = Matrix4.identity().rotate(Math.rad(45), Vector3.create([1,0,0]));
    
        if(actual === null) throw new Error("Actual should not be null!");
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.frustum()", async function() {
        let expected = [0.001, 0, 0, 0, 0, 0.001, 0, 0, 0, 0, -1.002002002002002, -1, 0, 0, -0.20020020020020018, 0];
        let actual = Matrix4.frustum(-200/2, 200/2, -200/2, 200/2, 0.1, 100);
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.perspective()", async function() {
        let expected = [1.7320508075688774, 0, 0, 0, 0, 1.7320508075688774, 0, 0, 0, 0, -1.002002002002002, -1, 0, 0, -0.20020020020020018, 0];
        let actual = Matrix4.perspective(Math.rad(60), 1, 0.1, 100);
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.orthographic()", async function() {
        let expected = [0.01, 0, 0, 0, 0, 0.01, 0, 0, 0, 0, -0.02002002002002002, 0, -0, -0, -1.002002002002002, 1];
        let actual = Matrix4.orthographic(-200/2, 200/2, -200/2, 200/2, 0.1, 100);
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.lookAt()", async function() {
        let expected = [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, -0, -0, -1, 1];
        let actual = Matrix4.lookAt(Vector3.create([0,0,-1]), Vector3.create([0,0,0]), Vector3.create([0,1,0]));
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.add()", async function() {
        let expected = [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2];
        let actual = Matrix4.identity().translate(Vector3.create([2,2,2])).add(Matrix4.identity());
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.sub()", async function() {
        let expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, 0];
        let actualTranslatedMatrix = Matrix4.identity().translate(Vector3.create([2,2,2]));
        let actual = Matrix4.identity().sub(actualTranslatedMatrix);
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
    test("Matrix4.scalar()", async function() {
        let expected = [50, 0, 0, 0, 0, 50, 0, 0, 0, 0, 50, 0, 0, 0, 0, 50];
        let actual = Matrix4.identity().multiplyScalar(50);
    
        actual.forEach((num,i) => {
            expect(num).toBeCloseTo(expected[i]);
        });
    });
});