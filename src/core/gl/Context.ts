import { UniformType } from './shader/reflection/Uniform';

export class GL {
    private static _context: WebGL2RenderingContext | null = null;

    public static init(canvas: HTMLCanvasElement): void {
        if(this._context) throw new Error("WebGL is already initialized!");

        this._context = canvas.getContext("webgl2") || (()=>{throw new Error("Failed to get WebGL2 context")})();
    }

    public static get context(): WebGL2RenderingContext {
        if(!this._context) throw new Error("WebGL is not initialized! Call GL.init() first.");

        return this._context;
    }

    public static getPartialUniformSetter(type: UniformType, location: WebGLUniformLocation) {
        if(!this._context) throw new Error("WebGL is not initialized! Call GL.init() first.");
        
        switch(type) {
            case 'mat4': {
                let fn = this._context.uniformMatrix4fv;
                return function (data: any) { 
                    fn.call(GL.context, location, false, data) 
                };
            }
            case 'vec4': {
                let fn = this._context.uniform4fv;
                return function (data: any) { 
                    fn.call(GL.context,location, data) 
                };
            }
            case 'sampler2D': {
                let fn = this._context.uniform1i;
                return function (data: any) { 
                    fn.call(GL.context,location, data) 
                };
            }
        }
    }

    private constructor() {}
}

export default GL;