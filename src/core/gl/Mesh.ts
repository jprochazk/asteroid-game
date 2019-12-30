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
        this.geometry.forEach(vao => {
            vao.draw();
        });
    }

}

export class GeometryParser {
    private constructor() {}

    public static parse(file: string) {
        let lines = file.match(/.+/g) || [];

        let vertices: Vector3[] = [];
        let normals: Vector3[] = [];
        let uvs: Vector2[] = [];

        let processedVertices = new Array();

        for(let i = 0; i < lines.length; i++) {

            if(lines[i][0] === 'v' && lines[i][1] === ' ') {
                let data: [number,number,number] = [0,0,0];
                lines[i].split(' ').slice(1).forEach((v, i) => {
                    data[i] = parseFloat(v);
                });
                vertices.push(Vector3.create(data));
            } else if(lines[i][0] === 'v' && lines[i][1] === 'n') {
                let data: [number,number,number] = [0,0,0];
                lines[i].split(' ').slice(1).forEach((v, i) => {
                    data[i] = parseFloat(v);
                });
                normals.push(Vector3.create(data));
            } else if(lines[i][0] === 'v' && lines[i][1] === 't') {
                let data: [number,number] = [0,0];
                lines[i].split(' ').slice(1).forEach((v, i) => {
                    data[i] = parseFloat(v);
                });
                uvs.push(Vector2.create(data));
            } else if(lines[i][0] === 'f') {
                lines[i].split(' ').slice(1).forEach(v => {

                    let indices = v.split('/').map(it => parseInt(it));
                    let vertex = [];
                    vertex.push(vertices[indices[0] - 1].toArray());
                    vertex.push(uvs[indices[1] - 1].toArray());
                    vertex.push(normals[indices[2] - 1].toArray());
                    processedVertices.push(vertex);
                });
            }
        }

        return processedVertices;
    }
}