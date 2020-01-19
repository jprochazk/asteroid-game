import { AssetManager } from 'core/io/AssetManager';
import { GL } from 'core/gl/Context';
import { ThrowAnywhere } from 'core/exception/Exception';
import { Game } from './Game';
import { Vector3 } from 'core/math/Math';

const container: HTMLDivElement = document.querySelector(".game-container") || ThrowAnywhere("Failed to find game container");
const game = new Game(container);

game.run();

// final look of the game:
// fly a starship around a solar system

// @todo URGENT! lights
// @todo remove all hardcoded material stuff
// @todo URGENT! materials
// - load from JSON
// - holds shader
// - method use(last_shader_id):
//   - if(last_shader_id !== this.shader.id) this.shader.bind()
//   - this.shader.setUniformsPartial(this.uniforms)
//   - let texture_id = 0;
//   - for(const texture of this.textures) {
//   -   texture.bind(texture_id)
//   -   texture_id++;
//   - }
//   - return shader.id
// in renderer, renderables should:
// hold a material to use
// if two materials with the same shader are used in succession, shader should not be rebound
//
// @todo SHADER GENERATION
// - examples:
//   - some objects may not have texcoords, so don't include them in attributes, and don't try to parse them during mesh building
//   - some objects may not be affected by lights, so calculate frag color using only material
//   - some objects may not have a material, so use a flat color
// etc... the shader properties are set by the objects themselves (their type/material), 
// and if a shader with the same properties isn't cached, we have to generate one
// then we can use the generated shader's layout to build out the vertex/index buffers and the uniform blocks
// @todo look into uniform buffer objects, since the amount of uniforms set per object/frame is starting to get quite large
// could abstract them away in the existing uniform block class

/* @todo list - maybe do some of these things
CORE: abstract game initialization (extend a class called Game in your own to gain access to everything in the engine)
CORE: time step
CORE: input handler

CORE: scene space partition
CORE: scene queries (occlusion query, radius query)


CORE: shader pre-processing
    - #include
    - #ifdef/#endif
    - shader cache for permutations

CORE: different method for setting struct / array uniforms
    - instead of setUniforms{Partial}(data)
    - you do setArrayUniform{Partial}(name, data);
    - or setUniforms{Partial}(data)
where {data} looks like...

(setting structs)
{
    u_material: {
        ambient: {some data}
        diffuse: ...
        specular: ...
        etc...
    }
}
(setting arrays of struct-type)
{
    u_light: [
        {
            color: Vector3...
            position: Vector3...
            constant: ...
            etc...
        }
    ]
}
(setting arrays of non-struct)
{
    u_randNums: [
        0, 3, 15, 32, 94, 60
    ]
}

etc. these data layouts should be generated during shader building

CORE: physics/collision
    - bounding volume collision

Uncertain:
CORE: materials (Blinn-Phong? PBR?)
CORE: objects from json (shader + material)
CORE: scene from json
IMPL: do research on more shadow techniques (shadow mapping wasn't great)
IMPL: deferred rendering
IMPL: some sample models (floor, character, enemy, weapon, foliage, tree)
    - blender + learn how to export and load them



GL.init(document.createElement('canvas'));
AssetManager.init();

async function run() {
    let shader = await AssetManager.loadShader("assets/shaders/material_and_pointlight.glsl");
    console.log(shader);

    shader.bind();

    shader.setUniformsPartial({
        "u_material.ambient": 0.5,
        "u_material.specular": Vector3.create([0.1,0.1,0.1]),
        "u_material.diffuse": Vector3.create([0.2,0.2,0.2]),
        "u_material.shininess": 128
    });

    shader.setUniformsPartial({
        "u_light[0].color": Vector3.create([0.8,0.8,0.8]),
        "u_light[0].position": Vector3.create([0,0,0]),
        "u_light[0].constant": 1.0,
        "u_light[0].linear": 0.36,
        "u_light[0].quadratic": 0.128
    });
}

run();*/