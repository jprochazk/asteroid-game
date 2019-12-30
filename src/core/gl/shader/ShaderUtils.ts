import { GL } from './../Context';

export namespace ShaderUtils {
    // Helper functions to compile
    function compileShader(shaderSource: string, shaderType: number) {
        const gl = GL.context;
        var shader = gl.createShader(shaderType) || (()=>{throw new Error("Failed to create shader!")})();

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) throw new Error("could not compile shader:" + gl.getShaderInfoLog(shader));

        return shader;
    };

    // and link shader programs
    function linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const gl = GL.context;
        var program = gl.createProgram() || (()=>{throw new Error("Failed to create program!")})();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) throw new Error("program filed to link:" + gl.getProgramInfoLog (program));

        return program;
    };

    export function createShaderProgram(sources: {vertex:string, fragment:string}): WebGLProgram {
        const gl = GL.context;
        let vertexShader = compileShader(sources.vertex, gl.VERTEX_SHADER);
        let fragmentShader = compileShader(sources.fragment, gl.FRAGMENT_SHADER);
        return linkProgram(vertexShader, fragmentShader);
    };

    /**
     * Used to split a single shader source file into the corresponding vertex and fragment shaders  
     * Currently done via substring operations (could be done using regex, too)
     */
    export function splitShader(source: string): {vertex:string, fragment:string} {
        let ivertex = source.lastIndexOf("__VERTEX__");
        let ifragment = source.lastIndexOf("__FRAGMENT__");
        let temp_vsrc = source.substring(ivertex + "__VERTEX__".length, ifragment).trim();
        let temp_fsrc = source.substring(ifragment + "__FRAGMENT__".length).trim();
        return {vertex: temp_vsrc, fragment: temp_fsrc};
    }
}