import { Vector3 } from 'core/math/Math';

class MeshParseError extends Error {
    constructor(lineNum: number, line: string, errorMessage: string) {
        super(`error while parsing .obj file\n\t(line ${lineNum}) ${line}: ${errorMessage}`);
    }
}

export class MeshBuilder {
    private static readonly WHITESPACE_REGEX = /\s+/;
    // @todo support .mtl files
    // @todo support usemtl in .obj files
    // private static readonly USE_MATERIAL_REGEX = /^usemtl/; 

    private constructor() {}

    // @todo enforce requirements set by shader properties
    public static parse(file: string): { vertexBuffer: any[], indexBuffer: number[] } {

        let warnings: string[] = [];

        // .obj files define vertices, normals, and texture coordinates separately from faces. all their data is
        // dumped into three arrays. faces then contain indices for these three arrays.
        // note: a "vertex" which goes into the shader is different from a "vertex" in an .obj file.
        // a vertex in an .obj file is just a vector of length 2 to 4, containing position of the vertex in model space.
        // a shader vertex contains the position data described by the .obj vertex, then the texture coordinates (for texture mapping) and the normal data (for lighting calculation).
        // the naming is confusing, but i chose to respect it in this parser.

        let lines = file.split("\n") || [];

        let vertices: Vector3[] = [];
        let normals: Vector3[] = [];
        let uvs: Vector3[] = [];

        let vertexBuffer = new Array(); // array of packed vertex, texCoord and normal data
        let indexBuffer: number[] = []; // array of indices into the vertex buffer
        let hashedIndices: Map<string, number> = new Map(); // used to prevent repeated vertex construction
        let currentIndex: number = 0; // used in constructing new vertices

        let currentLineNum = 0;
        for(const line of lines) {

            line.trim();
            // split the line by whitespace
            // v 1.000000 -1.000000 -1.000000
            // becomes
            // ['v', '1.000000', '-1.000000', '-1.000000']
            const line_elements = line.split(this.WHITESPACE_REGEX);
            // first element is the line type
            let type = line_elements.shift();

            // @temp fix for when lines inexplicably have another element at the end that is empty
            // i trimmed the line (removing any combination and length of '\n', '\r', '\t', or ' ' from the start and end of the line)
            // despite that, it still finds an empty element at the end of the line sometimes. really strange.
            if(line_elements[line_elements.length - 1] === '') {
                line_elements.pop();
            }

            switch(type?.toLowerCase()) {
                case 'v': {
                    if(line_elements.length !== 3) {
                        console.log(line_elements);
                        throw new MeshParseError(currentLineNum, line, "vertices must have 3 elements!");
                    }
                    let data: [number,number,number] = [0,0,0];
                    line_elements.forEach((v, i) => {
                        data[i] = parseFloat(v);
                    });
                    vertices.push(Vector3.create(data));
                    break;
                }
                case 'vn': {
                    if(line_elements.length !== 3) {
                        console.log(line_elements);
                        throw new MeshParseError(currentLineNum, line, "normals must have 3 elements!");
                    }
                    let data: [number,number,number] = [0,0,0];
                    line_elements.forEach((v, i) => {
                        data[i] = parseFloat(v);
                    });
                    normals.push(Vector3.create(data));
                    break;
                }
                case 'vt': {
                    let n_missing = 3 - line_elements.length;
                    for(let i = 0; i < n_missing; i++) {
                        line_elements.push("0");
                    }
                    let data: [number,number,number] = [0,0,0];
                    line_elements.forEach((v, i) => {
                        data[i] = parseFloat(v);
                    });
                    uvs.push(Vector3.create(data));
                    break;
                }
                case 'f': {
                    if(line_elements.length !== 3) {
                        console.log(line_elements);
                        throw new MeshParseError(currentLineNum, line, "faces must have 3 elements!");
                    }
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
                            let _v = vIndexData[0]; // the first number in the array signifies the vertex index
                            let _vt = vIndexData[1]; // the second number in the array signifies the texture coord index
                            let _vn = vIndexData[2]; // the third number in the array signifies the normal index

                            // @todo remove this hardcoded bs
                            if(isNaN(_vt)) {
                                vertexBuffer.push([
                                    vertices[_v - 1].toArray(),                         // grab the position data
                                    normals[_vn - 1].toArray()                          // grab the normal data
                                ]);
                            } else {
                                vertexBuffer.push([
                                    vertices[_v - 1].toArray(),                         // grab the position data
                                    uvs[_vt - 1].toArray(),    // grab the texture coordinate data
                                    normals[_vn - 1].toArray()                          // grab the normal data
                                ]);
                            }
    
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
            }

            currentLineNum++;
        }

        if(warnings.length !== 0) {
            console.warn(`${warnings.length} warnings while parsing .obj file`, warnings);
        }

        return {vertexBuffer, indexBuffer};
    }
}