import { ThrowAnywhere } from 'core/exception/Exception';

export class GL {
    private static _context: WebGL2RenderingContext | null = null;

    public static init(canvas: HTMLCanvasElement): void {
        if(this._context) throw new Error("WebGL is already initialized!");

        this._context = canvas.getContext("webgl2") || ThrowAnywhere("Failed to get WebGL2 context");
    }

    public static get context(): WebGL2RenderingContext {
        if(!this._context) throw new Error("WebGL is not initialized! Call GL.init() first.");

        return this._context;
    }

    public static getPartialUniformSetter(
        type: string, 
        location: WebGLUniformLocation): ((data: any) => void) 
    {
        if(!this._context) throw new Error("WebGL is not initialized! Call GL.init() first.");
        
        switch(type) {
            case 'float': {
                return function (data: any) {
                    GL.context.uniform1f.call(GL.context,location,data);
                }
            }
            case 'vec3': {
                return function (data: any) {
                    GL.context.uniform3f.call(GL.context,location,data[0],data[1],data[2]);
                }
            }
            case 'vec4': {
                return function (data: any) { 
                    GL.context.uniform4fv.call(GL.context,location, data) 
                };
            }
            case 'mat4': {
                return function (data: any) { 
                    GL.context.uniformMatrix4fv.call(GL.context, location, false, data) 
                };
            }
            case 'sampler2D': {
                return function (data: any) { 
                    GL.context.uniform1i.call(GL.context,location, data) 
                };
            }
            default: {
                throw new Error(`Unsupported uniform type "${type}". Try adding a case for type ${type} to GL.getPartialUniformSetter`);
            }
        }
    }

    private constructor() {}
}

export default GL;