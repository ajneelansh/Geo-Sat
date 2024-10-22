// StarBackground.js
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars() {
  const starMesh = useRef();
  const [positions] = useMemo(() => {
    const positions = new Float32Array(500 * 3); // 500 stars
    for (let i = 0; i < 500; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000; // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000; // Z
    }
    return [positions];
  }, []);

  // Move stars to simulate a starfield
  useFrame(() => {
    starMesh.current.rotation.x += 0.0005;
    starMesh.current.rotation.y += 0.0005;
  });

  return (
    <points ref={starMesh}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" size={2} color="#ffffff" />
    </points>
  );
}

function StarBackground() {
  return (
    <Canvas
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
      camera={{ position: [0, 0, 100] }}
    >
      <Stars />
    </Canvas>
  );
}

export default StarBackground;
