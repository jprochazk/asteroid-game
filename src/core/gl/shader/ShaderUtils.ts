import { ThrowAnywhere } from 'core/exception/Exception';
import { Uniform } from 'core/gl/shader/Uniform';
import { UniformBlock } from 'core/gl/UniformBlock';
import { Attribute } from 'core/gl/shader/Attribute';
import { GL } from './../Context';

export namespace ShaderUtils {

    /// SHADER BUILDING ///

    function compileShader(shaderSource: string, shaderType: number) {
        const gl = GL.context;
        var shader = gl.createShader(shaderType) || ThrowAnywhere("Failed to create shader!");

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            console.log(shaderSource);
            const infoLog = gl.getShaderInfoLog(shader);
            throw new Error("could not compile shader\n" + infoLog);
        }
        return shader;
    };

    function linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const gl = GL.context;
        var program = gl.createProgram() || ThrowAnywhere("Failed to create program!");

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) throw new Error("program failed to link:" + gl.getProgramInfoLog (program));

        return program;
    };

    /**
     * 
     * @param sources the vertex and fragment shaders, provided individually  
     * this allows you the freedom to store the text form of shaders in any way (even as one file),  
     * as long as you provide them to this function individually
     */
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
    

    /// REFLECTION ///
    // @todo this kind of reflection is pretty bad. it needs to be changed
    // from relying only on string manipulation and regex
    // to using gl info querying and string manip as a last resort
    
    interface ReflectionData {
        attributeArray: Array<Attribute>,
        uniformBlock: UniformBlock
    }

    function reflectAttributes(shader: WebGLProgram, vertex_source: string): Array<Attribute> {
        let attribute_lines = vertex_source.match(/(?<!\/)in\s.+/g) || [];
        let attributes: Array<Attribute> = [];
        for(let attribute_line of attribute_lines) {
            attribute_line = attribute_line.replace(';', '');
            attributes.push(Attribute.factory(shader, attribute_line));
        }


        return attributes;
    }

    type StructTypeMap = Map<string, string | StructTypeMap>;

    function reflectStructs(shader: WebGLProgram, combined_source: string): StructTypeMap {
        // grab all struct blocks we can find
        let struct_blocks = combined_source.match(/(?<!\/)struct\s.+{([^}]*)}/g) || [];

        // initialize a struct type map
        let struct_types_map: StructTypeMap = new Map();

        // for each block we found,
        struct_blocks.forEach(struct_block => {
            // grab every line individually
            let struct_lines = struct_block.split(/\n/);
            // remove the last line because we dont need it (it's a closing bracket)
            struct_lines.splice(struct_lines.length - 1, 1);

            // first line contains the struct signature
            // split it by whitespace
            let struct_sig = struct_lines[0].split(/\s+/);
            // grab the struct's type (2nd element)
            let type = struct_sig[1];
            // remove line we just processed
            struct_lines.splice(0, 1);

            // other lines except last one are members
            // put them into an object
            let typeMembers: StructTypeMap = new Map();
            struct_lines.forEach(member => {
                member = member.replace(";", "");
                member = member.trim();

                let member_elements = member.split(/\s+/);
                let memberName = member_elements[1];
                let memberTypeName = member_elements[0];
                // if typeName is a known struct type, use it
                // otherwise just use the string representation of the type
                let memberType: string | StructTypeMap = struct_types_map.get(memberTypeName) || memberTypeName;

                typeMembers.set(memberName, memberType);
            });

            struct_types_map.set(type, typeMembers);
        });
        
        return struct_types_map;
    }

    function destructureStructUniform(uniform_name: string, struct_type: StructTypeMap) {
        // initialize the array to return
        let destructured_uniforms: [string,string][] = [];

        // put the logic into an inline function so it can be called recursively
        // the parameters are the current name 
        // e.g. "structUniform.structMember" => to which another name would be appended like
        // "structUniform.structMember.anotherStructMember"
        const recursiveUniformNameAppend = (currentName: string, members: StructTypeMap) => {
            // iterate over the keys of the struct type map we were given
            for(const key of members.keys()) {
                // set the next name for appending to be the param currentName.currentKey
                let nextName = `${currentName}.${key}`;
                // grab the next member
                let nextMember = members.get(key)!;
                // if the next member is not a string, it is another StructTypeMap
                if(typeof nextMember !== 'string') {
                    // so we call this function again with the nextName we've built
                    // and the next member
                    recursiveUniformNameAppend(nextName, nextMember as StructTypeMap);
                    // we make sure to continue the loop here, because we ONLY want to append
                    // uniforms that have been flattened all the way to a base type
                    // (which means that typeof nextMember IS 'string', thus skipping this if statement block)
                    // if the type is "SomeStruct", our uniform builder won't know
                    // what to do with it and will throw an error.
                    continue;
                }
                destructured_uniforms.push([nextName, members.get(key)! as string]);
            }
        }

        // now start the process by giving the function the actual uniform name
        // e.g. "uniform Camera u_camera", where "u_camera" is uniform_name, and can be anything
        // and "Camera" is the struct_type - it is not passed as a string,
        // but as the overarching StructTypeMap
        recursiveUniformNameAppend(uniform_name, struct_type);

        // once we're done, return the array
        return destructured_uniforms;
    }

    function unwrapArrayUniform(uniform_name: string, combined_source: string) {
        let unwrapped_uniform_name_array: string[] = [];
        if(uniform_name.match(/\[/)) {
            // we are an array
            // get contents of square brackets
            // this has two possibilities: a number, or the name of a constant
            let sqr_bracket_content = uniform_name.split('[')[1];
            sqr_bracket_content = sqr_bracket_content.replace(']', '');
            let temp_uniform_name = uniform_name.replace(sqr_bracket_content, '__INDEX__');

            // try to parse it as a number
            let n = parseInt(sqr_bracket_content);
            if(isNaN(n)) {
                // it's a string, which means it's a constant. we have to find its value:
                // first, generate a regex for finding anything that matches "const*{sqr_bracket_content}*=*"; where * is anything
                // this should find a line where the constant is assigned a value
                let dyn_regex = `(const).*(${sqr_bracket_content}).*(=).*`;
                let matches = combined_source.match(new RegExp(dyn_regex, 'g')) || [];
                if(matches.length > 1) throw new Error(`no matches found for constant ${sqr_bracket_content}`);

                // this regex will find the rvalue of the assignment
                let rvalue_matches = matches[0].match(/(=).*/g) || ThrowAnywhere(`for ${sqr_bracket_content} found matches, but no assignment operator???`);
                // we have our rvalue
                let rvalue = rvalue_matches[0];
                // remove equals and semicolon, then trim
                rvalue = rvalue.replace('=', '');
                rvalue = rvalue.replace(';', '');
                rvalue = rvalue.trim();
                // finally, try to parse it as an int
                n = parseInt(rvalue);
                if(isNaN(n)) throw new Error(`failed to parse rvalue of constant ${sqr_bracket_content} as int!`);
            }
            
            // eventually, we will get the number of uniforms in the array
            // we have to unwrap the array, so "uniform SomeType someArrayUniform[someConstant];" 
            // will turn into ["uniform SomeType someArrayUniform[0]", "uniform SomeType someArrayUniform[1]" ... "uniform SomeType someArrayUniform[n]"] where n is
            // the size of the array.
            for(let i = 0; i < n; i++) {
                unwrapped_uniform_name_array.push(temp_uniform_name.replace('__INDEX__', i.toString()));
            }
        }

        return unwrapped_uniform_name_array;
    }

    function reflectUniforms(shader: WebGLProgram, combined_source: string): UniformBlock {
        // when reflecting uniforms, we first have to retrieve any struct types
        // that are present in the shader
        let struct_types_map = reflectStructs(shader, combined_source);

        // find any line starting with "uniform", except for if it starts with a C-style comment (//)
        let uniform_lines = combined_source.match(/(?<!\/)uniform\s.+/g) || [];
        // initialize our uniform map to which we'll be passing the uniforms
        // this is used to instantiate a uniform block later on
        let uniformMap: { [x:string]: Uniform } = {};

        const add_uniform = (uniform_name: string, uniform_type: string) => {
            uniformMap[uniform_name] = Uniform.build(shader, uniform_name, uniform_type);
        }

        const process_uniform = (uniform_name: string, uniform_type: string) => {
            // if uniform's type is in the struct types map, the uniform's type is a known struct type
            if(struct_types_map.has(uniform_type)) {
                // do some magic to flatten the uniform into its components with a non-struct type
                let dsus = destructureStructUniform(uniform_name, struct_types_map.get(uniform_type)! as StructTypeMap);
                // add each component we found
                dsus.forEach(destructured_uniform => {
                    add_uniform(destructured_uniform[0], destructured_uniform[1]);
                });
                // the uniform builder can only deal with non-struct types, so we continue here
                // so as to not hit the code after the if statement.
                return;
            }

            // if the type is non-struct, just add it
            add_uniform(uniform_name, uniform_type);
        }

        for(let uniform_line of uniform_lines) {
            uniform_line = uniform_line.replace(';', '');
            // split the line by whitespace, giving us a number of tokens
            let tokens = uniform_line.split(/\s+/);
            // the 3rd one is the uniform variable's name
            let uniform_name = tokens[2];
            // the 2nd one is the type (this is either a base type or a struct type)
            let uniform_type = tokens[1];

            // check if it's an array. if we found that it's an array, 
            // take the unwrapped uniform names and process them one by one as you would a non-array uniform
            let uniform_id_array = unwrapArrayUniform(uniform_name, combined_source);
            if(uniform_id_array.length > 0) {
                uniform_id_array.forEach(unwrapped_array_uniform_name => {
                    // then process each unwrapped uniform individually
                    process_uniform(unwrapped_array_uniform_name, uniform_type);
                });
            } else {
                // otherwise, just process it normally
                process_uniform(uniform_name, uniform_type);
            }
        }

        // once we're done, create the uniform block and return it
        return new UniformBlock(uniformMap);
    }

    export function reflect(shader: WebGLProgram, sources: {vertex:string, fragment:string}): ReflectionData {
        // reflection is composed of two steps:
        // 1. attributes, which are only in the vertex shader
        let attributeArray = reflectAttributes(shader, sources.vertex);

        // 2. uniforms, which are present in all shaders
        let uniformBlock = reflectUniforms(shader, sources.vertex + sources.fragment)

        return { attributeArray, uniformBlock };
    }
}