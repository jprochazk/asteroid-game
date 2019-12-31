import { GL } from './../Context';
import { VertexLayout } from "./reflection/VertexLayout";

const createGLBuffer = () => 
       GL.context.createBuffer() 
    || (()=>{throw new Error("Failed to create WebGL2 buffer")})()
;

const createGLArrayBuffer = () => 
       GL.context.createVertexArray() 
    || (()=>{throw new Error("Failed to create WebGL2 buffer")})()
;


export type Vertex = Array<Array<number>>;

export class VertexBuffer {
    public readonly VBO: WebGLBuffer;

    private constructor(
        public readonly length: number,
        public readonly layout: VertexLayout,
        public readonly vertices: Float32Array
    ) {
        const gl = GL.context;
        this.VBO = createGLBuffer();
    }

    public bind() {
        const gl = GL.context;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

        this.layout.bind();
    }

    public unbind() {
        const gl = GL.context;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    public static build(data: Array<Vertex>, layout: VertexLayout) {
        let vertices: Array<number> = [];

        data.forEach(vertex => {
            if(vertex.length !== layout.elements.length) {
                console.error(`Wrong vertex layout: required number of elements is ${layout.elements.length}, found ${vertex.length}`);
            }

            vertex.forEach((element, index) => {
                if(element.length !== layout.elements[index].size) {
                    console.error(`Wrong element layout: required length of element ${index} is ${layout.elements[index].size}, found ${element.length}`);
                }

                vertices.push(...element);
            });
        });

        return new VertexBuffer(data.length, layout, new Float32Array(vertices));
    }
}

export class IndexBuffer {
    public readonly EBO: WebGLBuffer;

    constructor(
        public readonly indices: Int32Array
    ) {
        this.EBO = createGLBuffer();
    }

    public bind() {
        const gl = GL.context;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.EBO);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    }

    public unbind() {
        const gl = GL.context;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public static build(indices: Array<number>): IndexBuffer {
        return new IndexBuffer(new Int32Array(indices));
    }
}

export class VertexArrayBuffer {

    private constructor(
        public readonly length: number,
        public readonly VAO: WebGLVertexArrayObject,
        public readonly hasIndexBuffer: boolean
    ) {
    }

    public draw(gl: WebGL2RenderingContext) {
        gl.bindVertexArray(this.VAO);
        if(this.hasIndexBuffer) {
            gl.drawElements(gl.TRIANGLES, this.length, gl.UNSIGNED_INT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.length);
        }
    }

    public static build(vb: VertexBuffer, ib?: IndexBuffer) {
        const gl = GL.context;
        let drawCount = 0;
        let VAO = createGLArrayBuffer();

        gl.bindVertexArray(VAO);
        vb.bind();
        if(ib) {
            ib.bind();
            drawCount = ib.indices.length;
        } else {
            drawCount = vb.length;
        }
        gl.bindVertexArray(null);

        return new VertexArrayBuffer(drawCount, VAO, (ib) ? true : false);
    }
}