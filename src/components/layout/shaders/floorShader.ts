export const floorVertexShader = `
varying vec3 v_viewNormal; varying vec2 v_uv; varying vec3 v_modelPosition;
varying vec3 v_worldPosition; varying vec3 v_viewPosition;
#ifdef USE_SHADOWMAP
    uniform mat4 directionalShadowMatrix[1]; varying vec4 vDirectionalShadowCoord[1];
    struct DirectionalLightShadow { float shadowBias; float shadowNormalBias; float shadowRadius; vec2 shadowMapSize; };
    uniform DirectionalLightShadow directionalLightShadows[1];
#endif
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) { return normalize((vec4(dir,0.)*matrix).xyz); }
void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    v_viewNormal = normalMatrix * normal; v_uv = uv;
    v_modelPosition = position; v_worldPosition = worldPosition.xyz;
    v_viewPosition = -viewPosition.xyz;
    vec3 worldNormal = inverseTransformDirection(v_viewNormal, viewMatrix);
    vDirectionalShadowCoord[0] = directionalShadowMatrix[0] * worldPosition + vec4(worldNormal * directionalLightShadows[0].shadowNormalBias, 0.);
}
`

export const floorFragmentShader = `
varying vec3 v_viewNormal; varying vec3 v_viewPosition; varying vec3 v_worldPosition; varying vec2 v_uv;
uniform sampler2DShadow directionalShadowMap[1]; varying vec4 vDirectionalShadowCoord[1];
struct DirectionalLightShadow { float shadowBias; float shadowNormalBias; float shadowRadius; vec2 shadowMapSize; };
uniform DirectionalLightShadow directionalLightShadows[1];
uniform sampler2D u_noiseTexture; uniform vec2 u_noiseTexelSize; uniform vec2 u_noiseCoordOffset;
#include <packing>
float texture2DCompare(sampler2DShadow depths, vec2 uv, float compare) { return texture(depths, vec3(uv, compare)); }
float getShadow(sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord) {
    float shadow=1.0; shadowCoord.xyz/=shadowCoord.w; shadowCoord.z+=shadowBias;
    bool inFrustum=all(bvec4(shadowCoord.x>=0.,shadowCoord.x<=1.,shadowCoord.y>=0.,shadowCoord.y<=1.));
    if(inFrustum&&shadowCoord.z<=1.0){
        vec2 ts=vec2(1.)/shadowMapSize; float dx0=-ts.x*shadowRadius,dy0=-ts.y*shadowRadius,dx1=ts.x*shadowRadius,dy1=ts.y*shadowRadius;
        shadow=(texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx0,dy0),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(0.,dy0),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx1,dy0),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx0,0.),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy,shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx1,0.),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx0,dy1),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(0.,dy1),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx1,dy1),shadowCoord.z))*(1./9.);
    }
    return shadow;
}
vec3 getBlueNoise(vec2 coord) { return texture2D(u_noiseTexture, coord*u_noiseTexelSize+u_noiseCoordOffset).rgb; }
float getShadowMask() {
    vec3 bn=getBlueNoise(gl_FragCoord.xy);
    DirectionalLightShadow dl=directionalLightShadows[0];
    float s=0.75+0.25*getShadow(directionalShadowMap[0],dl.shadowMapSize,dl.shadowBias-bn.z*0.01,dl.shadowRadius,vDirectionalShadowCoord[0]+vec4(50.*bn.xy/dl.shadowMapSize,0.,0.));
    s*=getShadow(directionalShadowMap[0],dl.shadowMapSize,dl.shadowBias-bn.z*0.5,dl.shadowRadius,vDirectionalShadowCoord[0]+vec4(50.*bn.xy/dl.shadowMapSize,0.,0.));
    return s;
}
void main() {
    float shadow=getShadowMask();
    gl_FragColor=vec4(0.,0.02,0.,0.3*(1.-shadow));
}
`
