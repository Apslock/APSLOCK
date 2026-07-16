export const sphereVertexShader = `
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying vec3 v_modelPosition;
varying vec3 v_worldPosition;
varying vec3 v_viewPosition;
varying vec4 v_ndcPos;

#ifdef USE_SHADOWMAP
    uniform mat4 directionalShadowMatrix[1];
    varying vec4 vDirectionalShadowCoord[1];

    struct DirectionalLightShadow {
        float shadowBias;
        float shadowNormalBias;
        float shadowRadius;
        vec2 shadowMapSize;
    };

    uniform DirectionalLightShadow directionalLightShadows[1];
#endif

#define saturate( a ) clamp( a, 0.0, 1.0 )
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {
    return normalize((vec4(dir, 0.0) * matrix).xyz);
}

void main () {
    vec3 pos = position;
    vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * viewPosition;
    v_ndcPos = gl_Position;

    vec4 worldPosition = (modelMatrix * vec4(pos, 1.0));
    v_viewNormal = normalMatrix * normal;
    v_uv = uv;
    v_modelPosition = position;
    v_worldPosition = worldPosition.xyz;
    v_viewPosition = -viewPosition.xyz;
    vec3 worldNormal = inverseTransformDirection(v_viewNormal, viewMatrix);

    vDirectionalShadowCoord[0] = directionalShadowMatrix[0] * worldPosition + vec4(worldNormal * directionalLightShadows[0].shadowNormalBias, 0.);
}
`

export const sphereFragmentShader = `
varying vec3 v_viewNormal;
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;
varying vec2 v_uv;
varying vec4 v_ndcPos;

uniform vec3 u_lightPosition;
uniform sampler2D u_sceneTexture;
uniform vec2 u_resolution;
uniform sampler2D u_matcap;

uniform sampler2DShadow directionalShadowMap[ 1 ];
varying vec4 vDirectionalShadowCoord[ 1 ];

struct DirectionalLightShadow {
    float shadowBias;
    float shadowNormalBias;
    float shadowRadius;
    vec2 shadowMapSize;
};
uniform DirectionalLightShadow directionalLightShadows[ 1 ];

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
    return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

#include <packing>

float texture2DCompare( sampler2DShadow depths, vec2 uv, float compare ) {
    return texture( depths, vec3(uv, compare) );
}

float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
    float shadow = 1.0;
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z += shadowBias;
    bvec4 inFrustumVec = bvec4(shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0);
    bool inFrustum = all(inFrustumVec);
    bvec2 frustumTestVec = bvec2(inFrustum, shadowCoord.z <= 1.0);
    bool frustumTest = all(frustumTestVec);
    if (frustumTest) {
        vec2 texelSize = vec2(1.0) / shadowMapSize;
        float dx0 = -texelSize.x * shadowRadius;
        float dy0 = -texelSize.y * shadowRadius;
        float dx1 = +texelSize.x * shadowRadius;
        float dy1 = +texelSize.y * shadowRadius;
        float dx2 = dx0 / 2.0; float dy2 = dy0 / 2.0;
        float dx3 = dx1 / 2.0; float dy3 = dy1 / 2.0;
        shadow = (
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx0, dy0), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(0.0, dy0), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx1, dy0), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx2, dy2), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(0.0, dy2), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx3, dy2), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx0, 0.0), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx2, 0.0), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy, shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx3, 0.0), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx1, 0.0), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx2, dy3), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(0.0, dy3), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx3, dy3), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx0, dy1), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(0.0, dy1), shadowCoord.z) +
            texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx1, dy1), shadowCoord.z)
        ) * (1.0 / 17.0);
    }
    return shadow;
}

float getShadowMask() {
    float shadow = 1.0;
    vec3 blueNoise = vec3(0.0);
    DirectionalLightShadow directionalLight = directionalLightShadows[0];
    shadow *= getShadow(directionalShadowMap[0], directionalLight.shadowMapSize, directionalLight.shadowBias - blueNoise.z * 0.002, directionalLight.shadowRadius, vDirectionalShadowCoord[0] + vec4(blueNoise.xy / directionalLight.shadowMapSize, 0.0, 0.0));
    return shadow;
}

void main() {
    vec3 viewNormal = normalize(v_viewNormal);
    vec3 N = inverseTransformDirection(viewNormal, viewMatrix);
    vec3 V = normalize(cameraPosition - v_worldPosition);
    vec3 L = u_lightPosition - v_worldPosition;
    float lightDistance = length(L);
    L /= lightDistance;

    float NdL = max(0., dot(N, L));
    vec3 H = normalize(V + L);
    float spec = max(0.0, dot(H, N));
    float NdV = max(0., dot(N, V));
    float fresnel = pow(1.0 - NdV, 5.0);

    /* Refraction — use v_ndcPos passed from vertex shader (no projectionMatrix needed here) */
    float thickness = 0.6;
    float refractionRatio = 1.0 / 1.45;
    vec3 refractionVector = refract(-V, N, refractionRatio);
    vec3 refractedRayExit = v_worldPosition + normalize(refractionVector) * thickness;

    /* Project refracted ray exit using the NDC position of the current fragment as base,
       then offset by refraction. We use gl_FragCoord to sample the scene texture. */
    vec2 screenUV = (v_ndcPos.xy / v_ndcPos.w) * 0.5 + 0.5;
    /* Compute a small refraction offset in screen space from the refraction vector */
    vec3 viewRefract = mat3(viewMatrix) * refractionVector;
    vec2 refractionOffset = viewRefract.xy * 0.15;
    vec2 refractionCoords = screenUV + refractionOffset;
    refractionCoords = clamp(refractionCoords, 0.001, 0.999);

    vec3 sceneBlurred = pow(texture2D(u_sceneTexture, refractionCoords).rgb, vec3(2.2));

    vec3 viewDir = normalize(v_viewPosition);
    vec3 x = normalize(vec3(viewDir.z, 0.0, -viewDir.x));
    vec3 y = cross(viewDir, x);
    vec2 uv = vec2(dot(x, v_viewNormal), dot(y, v_viewNormal)) * 0.495 + 0.5;
    vec4 matcapColor = texture2D(u_matcap, uv);

    float shadow = getShadowMask();

    vec3 color = sceneBlurred;
    color += shadow * 0.2 * pow(spec, 500.0);
    color += (0.1 + 0.9 * shadow) * 0.03 * pow(matcapColor.rgb, vec3(2.2));
    color += shadow * 0.005 * fresnel;

    gl_FragColor = vec4(0.8 * color, 1.0);
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 2.2));
}
`
