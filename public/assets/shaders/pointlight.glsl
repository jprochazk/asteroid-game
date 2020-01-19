__VERTEX__
#version 300 es
precision mediump float;

in vec3 a_position;
in vec3 a_texCoord;
in vec3 a_normal;

out vec3 v_texCoord;
out vec3 v_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main()
{
    v_texCoord = a_texCoord;
    v_normal = a_normal;
    gl_Position = u_projection * u_view * u_model * vec4(a_position.xyz, 1.0);
}

__FRAGMENT__
#version 300 es
precision mediump float;

out vec4 FragColor;

uniform vec3 u_lightColor;

void main()
{
    FragColor = vec4(u_lightColor, 1.0);
}