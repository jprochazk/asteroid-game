__VERTEX__
#version 300 es
precision mediump float;

in vec3 a_position;
in vec3 a_texCoord;
in vec3 a_normal;

out vec3 v_fragPos;
out vec3 v_texCoord;
out vec3 v_normal;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main()
{
	v_texCoord = a_texCoord;
	v_normal = mat3(transpose(inverse(u_model))) * a_normal;
	v_fragPos = vec3(u_model * vec4(a_position, 1.0));

	gl_Position = u_projection * u_view * vec4(v_fragPos, 1.0);
}

__FRAGMENT__
#version 300 es
precision mediump float;

out vec4 o_fragColor;

struct Material {
	float ambient;
	vec3 specular;
	vec3 diffuse;
	float shininess;
}; 

struct PointLight {
	vec3 color;
	vec3 position;
	float constant;
	float linear;
	float quadratic;
};

in vec3 v_fragPos;
in vec3 v_normal;
in vec3 v_texcoord;

const int NR_LIGHTS = 1;

uniform vec3 u_viewPos;
uniform Material u_material;
uniform PointLight u_light[NR_LIGHTS];

vec3 CalcPointLight(PointLight light, Material material, vec3 fragPos, vec3 normal, vec3 viewDir);

void main()
{
	vec3 norm = normalize(v_normal);
    vec3 viewDir = normalize(u_viewPos - v_fragPos);

	vec3 sum = vec3(0.0);
	for(int i = 0; i < NR_LIGHTS; i ++) {
		sum += CalcPointLight(u_light[i], u_material, v_fragPos, norm, viewDir);
	}

	o_fragColor = vec4(sum, 1.0);
}

vec3 CalcPointLight(PointLight light, Material material, vec3 fragPos, vec3 normal, vec3 viewDir)
{
	vec3 lightDir = normalize(light.position - fragPos);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    // attenuation
    float distance    = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + 
  			     light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient  = material.ambient * material.diffuse * light.color * attenuation;
    vec3 diffuse  = material.diffuse  * diff * light.color * attenuation;
    vec3 specular = material.specular * spec * light.color * attenuation;
    return (ambient + diffuse + specular);
}