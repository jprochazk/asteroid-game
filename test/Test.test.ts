import { Test } from './../src/Test';


test('Test should have value', () => {
    let test = new Test(6);

    expect(test.data).toBe(6);
});