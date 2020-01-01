import { Uniform } from './shader/reflection/Uniform';



export class UniformBlock {
    private uniforms: Map<string, Uniform>

    public constructor(
        uniformLayout: { [x:string]: Uniform }
    ) {
        this.uniforms = new Map();
        for (const name in uniformLayout) {
            if(uniformLayout.hasOwnProperty(name)) {
                this.uniforms.set(name, uniformLayout[name]);
            }
        }
    }

    /**
     * Set the data of the uniform block.  
     * Only checks if all required uniform data is present, does not check types
     * @param data 
     */
    public set(data: { [x: string]: any }) {
        for (const [name, uniform] of this.uniforms) {
            if(!data[name]) throw new Error(`missing data for uniform ${name}`);
            uniform.set(data[name]);
        }
    }

    public upload() {
        this.uniforms.forEach(uniform => uniform.upload());
    }
}