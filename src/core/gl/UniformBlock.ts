import { Uniform } from 'core/gl/shader/Uniform';

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
     * Checks if all uniforms are present, does not check for types
     * @param uniformData 
     */
    public set(uniformData: { [x: string]: any }) {
        for (const [name, uniform] of this.uniforms) {
            if(!uniformData[name]) throw new Error(`missing data for uniform "${name}". data: ${uniformData}`);
            uniform.set(uniformData[name]);
            uniform.upload();
        }
    }

    /**
     * Set the data of the uniform block.  
     * Allows for partial 
     * @param uniformData 
     */
    public setPartial(uniformData: { [x: string]: any }) {
        for (const name in uniformData) {
            if(uniformData.hasOwnProperty(name)) {
                let uniform = this.uniforms.get(name);
                if(!uniform) throw new Error(`could not find uniform "${name}". data: ${uniformData}`);

                uniform.set(uniformData[name]);
                uniform.upload();
            }
        }
    }
}