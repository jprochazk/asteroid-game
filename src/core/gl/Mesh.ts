import { GL } from './Context';
import { Vector2 } from './../math/Vector2';
import { Vector3 } from './../math/Vector3';
import { VertexArrayBuffer, VertexBuffer } from "./shader/Buffer";


export class Mesh {

    /**
     * @param geometry array of VertexArrayBuffer objects - will be drawn in the order the array is in
     */
    constructor(
        private readonly geometry: Array<VertexArrayBuffer>
    ) {

    }

    public addVertexArray(vab: VertexArrayBuffer) {
        this.geometry.push(vab);
    }

    public draw() {
        const gl = GL.context;
        this.geometry.forEach(vao => {
            vao.draw(gl);
        });
    }

}

export class MeshBuilder {
    private static readonly VERTEX_REGEX = /^v\s/;
    private static readonly NORMAL_REGEX = /^vn\s/;
    private static readonly TEXTURE_REGEX = /^vt\s/;
    private static readonly FACE_REGEX = /^f\s/;
    private static readonly WHITESPACE_REGEX = /\s+/;
    // @todo support .mtl files
    // @todo support usemtl in .obj files
    // private static readonly USE_MATERIAL_REGEX = /^usemtl/; 

    private constructor() {}

    public static parse(file: string): { vertexBuffer: any[], indexBuffer: number[] } {
        let lines = file.split("\n") || [];

        let vertices: Vector3[] = [];
        let normals: Vector3[] = [];
        let uvs: Vector2[] = [];

        let vertexBuffer = new Array(); // array of packed vertex, texCoord and normal data
        let indexBuffer: number[] = []; // array of indices into the vertex buffer
        let hashedIndices: Map<string, number> = new Map(); // used to prevent repeated vertex construction
        let currentIndex: number = 0; // used in constructing new vertices

        let currentLineNum = 0;
        for(const line of lines) {

            // split the line by whitespace
            // v 1.000000 -1.000000 -1.000000
            // becomes
            // ['v', '1.000000', '-1.000000', '-1.000000']
            const line_elements = line.split(' ');
            // remove the first element as we don't need it in the array
            line_elements.shift();

            // is this line "v X Y Z"?
            if(this.VERTEX_REGEX.test(line)) {
                let data: [number,number,number] = [0,0,0];
                line_elements.forEach((v, i) => {
                    data[i] = parseFloat(v);
                });
                vertices.push(Vector3.create(data));
            } 
            // is this line "vn X Y Z"?
            else if(this.NORMAL_REGEX.test(line)) {
                let data: [number,number,number] = [0,0,0];
                line_elements.forEach((v, i) => {
                    data[i] = parseFloat(v);
                });
                normals.push(Vector3.create(data));
            } 
            // is this line "vt U V"?
            else if(this.TEXTURE_REGEX.test(line)) {
                // we don't support 3D texture coordinates
                if(line_elements.length !== 2) {
                    console.log(line_elements);
                    throw new Error(`error while parsing .obj file at line ${currentLineNum}, texture coords must not have more than 2 elements!\n\t${line}`);
                }
                let data: [number,number] = [0,0];
                line_elements.forEach((v, i) => {
                    data[i] = parseFloat(v);
                });
                uvs.push(Vector2.create(data));
            } 
            // is this line "f V/VT/VN V/VT/VN V/VT/VN"?
            else if(this.FACE_REGEX.test(line)) {
                line_elements.forEach(v => {
                    // constructing faces has two routes:
                    // 1. constructing a new face
                    // 2. using an existing face
                    // this will greatly optimize the vertex buffer size for large models

                    // here's the process:
                    // if we've seen this vertex before, just push its index into the index buffer
                    if(hashedIndices.has(v)) {
                        indexBuffer.push(hashedIndices.get(v)!);
                    } else {
                        // if we haven't seen it before, construct a new vertex

                        // first, get the indices from the face vertex
                        // we will use them to grab values from the vertices/uvs/normals array we made previously
                        let vIndexData = v.split('/').map(it => parseInt(it));
                        let _v = vIndexData[0] - 1; // the first number in the array signifies the vertex index
                        let _vt = vIndexData[1] - 1; // the second number in the array signifies the texture coord index
                        let _vn = vIndexData[2] - 1; // the third number in the array signifies the normal index
                        vertexBuffer.push([
                            vertices[_v].toArray(), // grab the position data
                            uvs[_vt].toArray(),     // grab the texture coordinate data
                            normals[_vn].toArray()  // grab the normal data
                        ]);

                        // first, push the current index into the index buffer
                        indexBuffer.push(currentIndex);
                        // then put the current index into the hashIndices map with the face vertex string
                        // as the key (e.g. "'5/1/1': 0")
                        hashedIndices.set(v, currentIndex);
                        // finally, increment the currentIndex for the next iteration
                        currentIndex++;
                    }
                });
            }

            currentLineNum++;
        }

        return {vertexBuffer, indexBuffer};
    }
}