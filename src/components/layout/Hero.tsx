"use client";

import * as THREE from 'three'
import { useEffect, useRef, Suspense, useMemo, useState } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame, Canvas } from '@react-three/fiber'
import { sphereFragmentShader, sphereVertexShader } from './shaders/sphereShader'
import { heroDepthFragmentShader, heroFragmentShader, heroVertexShader } from './shaders/heroShader'

const INSTANCES_COUNT = 3000;

function HeroScene() {
    const groupRef = useRef<THREE.Group>(null);
    const sphere1Ref = useRef<THREE.Mesh>(null);
    const sphere2Ref = useRef<THREE.Mesh>(null);
    const sphere3Ref = useRef<THREE.Mesh>(null);
    const sphere4Ref = useRef<THREE.Mesh>(null);

    const lightPosition = useMemo(() => new THREE.Vector3(-1, 0.8, 0.25).normalize().multiplyScalar(5), []);

    // Using an existing image as noise texture to avoid missing file errors
    const noise = useTexture("/images/home/retro-tvs.png");
    useEffect(() => {
        if (noise) {
            noise.wrapS = THREE.RepeatWrapping;
            noise.wrapT = THREE.RepeatWrapping;
        }
    }, [noise]);

    const uniforms = useMemo(() => (Object.assign({
        u_scale: { value: 0.06 },
        u_lightPosition: { value: lightPosition },
        u_noiseTexture: { value: noise },
        u_noiseTexelSize: { value: new THREE.Vector2(1/128, 1/128) },
        u_noiseCoordOffset: { value: new THREE.Vector2(0, 0) },
        u_color: { value: new THREE.Color("#FAFAF7") },
        u_sphere1Position: { value: new THREE.Vector3(0, 0, 0) },
        u_sphere2Position: { value: new THREE.Vector3(0, 0, 0) },
        u_sphere3Position: { value: new THREE.Vector3(0, 0, 0) },
        u_sphere4Position: { value: new THREE.Vector3(0, 0, 0) },
        ...THREE.UniformsUtils.merge([THREE.UniformsLib.lights]),
    })), [noise, lightPosition]);

    const geometry = useMemo(() => {
        const refGeometry = new THREE.CapsuleGeometry(1, 4, 4, 16);
        refGeometry.computeBoundingBox();

        const geo = new THREE.InstancedBufferGeometry();
        for (let id in refGeometry.attributes) {
            geo.setAttribute(id, refGeometry.attributes[id]);
        }
        geo.setIndex(refGeometry.index);
    
        const positionsArray = new Float32Array(INSTANCES_COUNT * 3);
        const quaternionsArray = new Float32Array(INSTANCES_COUNT * 4);

        const sphereRadius = 1.5; 
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const up = new THREE.Vector3(0, 1, 0);
        const tempPos = new THREE.Vector3();
        const tempQuat = new THREE.Quaternion();

        for (let i = 0, i3 = 0, i4 = 0; i < INSTANCES_COUNT; i++, i3 += 3, i4 += 4) {
          const y = 1 - (i / (INSTANCES_COUNT - 1)) * 2;
          const radius = Math.sqrt(1 - y * y);
          const theta = goldenAngle * i;

          const x = Math.cos(theta) * radius * sphereRadius;
          const z = Math.sin(theta) * radius * sphereRadius;
          const posY = y * sphereRadius;

          positionsArray[i3] = x;
          positionsArray[i3 + 1] = posY;
          positionsArray[i3 + 2] = z;

          tempPos.set(-x, -posY, -z).normalize();
          tempQuat.setFromUnitVectors(up, tempPos);

          quaternionsArray[i4] = tempQuat.x;
          quaternionsArray[i4 + 1] = tempQuat.y;
          quaternionsArray[i4 + 2] = tempQuat.z;
          quaternionsArray[i4 + 3] = tempQuat.w;
        }
        geo.setAttribute(
          "a_instancePos",
          new THREE.InstancedBufferAttribute(positionsArray, 3),
        );
        geo.setAttribute(
          "a_instanceQuaternions",
          new THREE.InstancedBufferAttribute(quaternionsArray, 4),
        );
    
        return geo;
    }, []);

    useEffect(() => {
        return () => {
            geometry.dispose();
        };
    }, [geometry]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        
        const configs = [
            { speed: 1.0, phase: Math.PI/1.1,     plane: 'yz', dir:  1 },  
            { speed: 0.75, phase: Math.PI/3.4, plane: 'xz', dir: -1 },
            { speed: 0.5, phase: Math.PI/2.2,  plane: 'yz', dir:  1 },
            { speed: 1.2, phase: Math.PI/1.7, plane: 'xy', dir: -1 },
        ];
        const radius = 1.9;
        
        function orbitPosition(t: number, config: any) {
            const angle = config.dir * config.speed * t + config.phase;
            if (config.plane === 'xy') return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0] as [number, number, number];
            if (config.plane === 'xz') return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number];
            return [0, Math.cos(angle) * radius, Math.sin(angle) * radius] as [number, number, number];
        }

        if (sphere1Ref.current) {
            const pos = orbitPosition(time, configs[0]);
            sphere1Ref.current.position.set(...pos);
            uniforms.u_sphere1Position.value.copy(sphere1Ref.current.position);
        }
        if (sphere2Ref.current) {
            const pos = orbitPosition(time, configs[1]);
            sphere2Ref.current.position.set(...pos);
            uniforms.u_sphere2Position.value.copy(sphere2Ref.current.position);
        }
        if (sphere3Ref.current) {
            const pos = orbitPosition(time, configs[2]);
            sphere3Ref.current.position.set(...pos);
            uniforms.u_sphere3Position.value.copy(sphere3Ref.current.position);
        }
        if (sphere4Ref.current) {
            const pos = orbitPosition(time, configs[3]);
            sphere4Ref.current.position.set(...pos);
            uniforms.u_sphere4Position.value.copy(sphere4Ref.current.position);
        }
        
        uniforms.u_noiseCoordOffset.value.set(Math.random(), Math.random());

        if (groupRef.current) {
            groupRef.current.rotation.y += 0.002;
            groupRef.current.rotation.x += 0.001;
        }
    });

    return (
        <group ref={groupRef}>
            <directionalLight
                castShadow
                position={[lightPosition.x, lightPosition.y, lightPosition.z]}
                shadow-camera-left={-3}
                shadow-camera-right={3}
                shadow-camera-top={3}
                shadow-camera-bottom={-3}
                shadow-camera-near={0.1}
                shadow-camera-far={20}
                shadow-bias={-0.0001}
                shadow-mapSize={[1024, 1024]}
            />
            <mesh renderOrder={-1} >
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial color="#FAFAF7" />
            </mesh>
            <mesh geometry={geometry} renderOrder={0} receiveShadow castShadow>
                <shaderMaterial vertexShader={heroVertexShader} fragmentShader={heroFragmentShader} uniforms={uniforms} lights={true} />
                <shaderMaterial attach="customDepthMaterial" vertexShader={heroVertexShader} fragmentShader={heroDepthFragmentShader} uniforms={uniforms} defines={{ IS_DEPTH: true }} />
            </mesh>

            <group>
                <mesh ref={sphere1Ref} renderOrder={1} receiveShadow castShadow>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
                </mesh>
                <mesh ref={sphere2Ref} renderOrder={1} receiveShadow castShadow>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
                </mesh>
                <mesh ref={sphere3Ref} renderOrder={1} receiveShadow castShadow>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
                </mesh>
                <mesh ref={sphere4Ref} renderOrder={1} receiveShadow castShadow>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#FFFFFF" roughness={0.2} metalness={0.1} />
                </mesh>
            </group>
        </group>
    )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      if (el) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", minWidth: "320px", minHeight: "320px", flexShrink: 0 }}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], near: 0.1, far: 30, fov: 75 }}
        gl={{ powerPreference: "high-performance", antialias: true, stencil: false, alpha: true }}
        shadows
        frameloop={isVisible ? "always" : "never"}
      >
        <Suspense fallback={null}>
            <group scale={1.35} position={[-2.8, 0.8, 0]}>
                <HeroScene />
            </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
