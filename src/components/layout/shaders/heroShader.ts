export const heroVertexShader = `
    attribute vec3 a_instancePos;
    attribute vec4 a_instanceQuaternions;
    #ifdef IS_DEPTH
        varying vec2 vHighPrecisionZW;
    #else
        varying vec3 v_worldPosition;
        varying vec2 v_uv;
        varying vec3 v_instancePos;
        varying vec3 v_viewPosition;
        varying vec3 v_viewNormal;
        varying vec3 v_modelPosition;
        varying vec3 v_worldNormal;
        #ifdef USE_SHADOWMAP
            uniform mat4 directionalShadowMatrix[1];
            varying vec4 vDirectionalShadowCoord[1];
            struct DirectionalLightShadow {
                float shadowBias; float shadowNormalBias; float shadowRadius; vec2 shadowMapSize;
            };
            uniform DirectionalLightShadow directionalLightShadows[1];
        #endif
    #endif
    uniform float u_scale;
    uniform vec3 u_sphere1Position;
    uniform vec3 u_sphere2Position;
    uniform vec3 u_sphere3Position;
    uniform vec3 u_sphere4Position;
    vec3 rotateByQuaternion(vec3 v, vec4 q) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
    vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) { return normalize((vec4(dir, 0.0) * matrix).xyz); }
    float linearStep(float edge0, float edge1, float x) { return clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0); }
    void main() {
        vec3 pos = position; vec3 norm = normal;
        float d1 = length(a_instancePos - u_sphere1Position);
        float d2 = length(a_instancePos - u_sphere2Position);
        float d3 = length(a_instancePos - u_sphere3Position);
        float d4 = length(a_instancePos - u_sphere4Position);
        float s = 4.0;
        float displacement = 1.0 - clamp(1.0/(s*d1*d1),0.,1.);
        displacement = min(displacement, 1.0 - clamp(1.0/(s*d2*d2),0.,1.));
        displacement = min(displacement, 1.0 - clamp(1.0/(s*d3*d3),0.,1.));
        displacement = min(displacement, 1.0 - clamp(1.0/(s*d4*d4),0.,1.));
        float tip = 1.0 - step(-2.5, pos.y);
        if (tip > 0.5) { pos.y = -2.5; norm = vec3(0,-1,0); }
        pos = rotateByQuaternion(pos, a_instanceQuaternions);
        pos *= u_scale;
        pos += a_instancePos;
        pos += normalize(a_instancePos) * 0.4 * pow(displacement, 0.7);
        norm = rotateByQuaternion(norm, a_instanceQuaternions);
        vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        #ifdef IS_DEPTH
            vHighPrecisionZW = gl_Position.zw;
        #else
            vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
            v_uv = uv; v_viewNormal = normalize(normalMatrix * norm);
            v_worldPosition = worldPosition.xyz; v_modelPosition = position;
            v_viewPosition = -viewPosition.xyz; v_instancePos = a_instancePos;
            v_worldNormal = inverseTransformDirection(v_viewNormal, viewMatrix);
            vDirectionalShadowCoord[0] = directionalShadowMatrix[0] * worldPosition + vec4(v_worldNormal * directionalLightShadows[0].shadowNormalBias, 0.);
        #endif
    }
`

export const heroFragmentShader = `
    varying vec3 v_worldPosition; varying vec2 v_uv; varying vec3 v_instancePos;
    varying vec3 v_viewPosition; varying vec3 v_viewNormal; varying vec3 v_modelPosition; varying vec3 v_worldNormal;
    uniform vec3 u_lightPosition; uniform sampler2D u_noiseTexture; uniform vec2 u_noiseTexelSize;
    uniform vec2 u_noiseCoordOffset; uniform vec3 u_color;
    uniform sampler2DShadow directionalShadowMap[1]; varying vec4 vDirectionalShadowCoord[1];
    struct DirectionalLightShadow { float shadowBias; float shadowNormalBias; float shadowRadius; vec2 shadowMapSize; };
    uniform DirectionalLightShadow directionalLightShadows[1];
    float linearStep(float edge0, float edge1, float x) { return clamp((x-edge0)/(edge1-edge0),0.,1.); }
    #include <packing>
    float texture2DCompare(sampler2DShadow depths, vec2 uv, float compare) { return texture(depths, vec3(uv, compare)); }
    float getShadow(sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord) {
        float shadow = 1.0; shadowCoord.xyz /= shadowCoord.w; shadowCoord.z += shadowBias;
        bool inFrustum = all(bvec4(shadowCoord.x>=0.,shadowCoord.x<=1.,shadowCoord.y>=0.,shadowCoord.y<=1.));
        if(inFrustum && shadowCoord.z<=1.0) {
            vec2 ts = vec2(1.)/shadowMapSize; float dx0=-ts.x*shadowRadius,dy0=-ts.y*shadowRadius,dx1=ts.x*shadowRadius,dy1=ts.y*shadowRadius;
            shadow=(texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx0,dy0),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(0.,dy0),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx1,dy0),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx0,0.),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy,shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx1,0.),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx0,dy1),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(0.,dy1),shadowCoord.z)+texture2DCompare(shadowMap,shadowCoord.xy+vec2(dx1,dy1),shadowCoord.z))*(1./9.);
        }
        return shadow;
    }
    vec3 getBlueNoise(vec2 coord) { return texture2D(u_noiseTexture, coord*u_noiseTexelSize+u_noiseCoordOffset).rgb; }
    float getShadowMask() {
        float shadow=1.0; vec3 bn=getBlueNoise(gl_FragCoord.xy);
        DirectionalLightShadow dl=directionalLightShadows[0];
        shadow*=getShadow(directionalShadowMap[0],dl.shadowMapSize,dl.shadowBias-bn.z*0.002,dl.shadowRadius,vDirectionalShadowCoord[0]+vec4(bn.xy/dl.shadowMapSize,0.,0.));
        return shadow;
    }
    void main() {
        vec3 L=normalize(u_lightPosition-v_instancePos);
        vec3 N=normalize(normalize(v_instancePos)+0.2*normalize(v_worldNormal));
        float NdL=max(0.,dot(N,L));
        float distFromLight=length(u_lightPosition-v_worldPosition);
        float attenuation=1.0/(0.00025*pow(distFromLight,8.0));
        float ao=linearStep(-0.5,-3.0,v_modelPosition.y);
        float shadow=0.4+0.6*getShadowMask();
        vec3 color=u_color*clamp(attenuation+smoothstep(-0.05,1.0,NdL),0.,1.);
        color=pow(color,vec3(0.8))*ao*ao*shadow;
        gl_FragColor=vec4(color,1.0);
        gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(1./2.2));
    }
`

export const heroDepthFragmentShader = `
    #include <common>
    #include <packing>
    varying vec2 vHighPrecisionZW;
    void main() {
        float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
        gl_FragColor = packDepthToRGBA(fragCoordZ);
    }
`
