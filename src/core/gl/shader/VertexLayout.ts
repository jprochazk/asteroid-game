import { GL } from 'core/gl/Context';
import { Attribute } from "core/gl/shader/Attribute";

interface VertexElement {
    readonly name: string,
    readonly location: number,
    readonly size: number,
    readonly type: number,
    readonly normalized: boolean,
    readonly offset: number
}

export class VertexLayout {

    private constructor(
        public readonly stride: number,
        public readonly elements: Array<VertexElement>
    ) {

    }

    public bind() {
        const gl = GL.context;
        this.elements.forEach(element => {
            gl.enableVertexAttribArray(element.location);
            gl.vertexAttribPointer(
                element.location, 
                element.size, 
                element.type, 
                element.normalized, 
                this.stride, 
                element.offset
            );
        });
    }

    public static fromAttributes(attributes: Array<Attribute>): VertexLayout {
        const gl = GL.context;

        let elements = new Array<VertexElement>();

        let total_stride = 0;
        let offset = 0;
        for (const attribute of attributes) {
            elements.push({
                name: attribute.name,
                location: attribute.location,
                size: attribute.type.size,
                type: (attribute.type.btype === 'float') ? gl.FLOAT : gl.UNSIGNED_INT,
                normalized: false,
                offset: offset
            });

            total_stride += attribute.type.stride;
            offset = attribute.type.stride;
        }

        return new VertexLayout(total_stride, elements);
    }
}