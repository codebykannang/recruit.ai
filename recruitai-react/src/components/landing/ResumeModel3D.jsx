import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';

function ResumeSheet({ position, rotation, scale, opacity = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
      {/* Main paper */}
      <RoundedBox args={[2.2, 3, 0.04]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.05}
          transparent
          opacity={opacity}
        />
      </RoundedBox>
      {/* Header bar (purple gradient effect) */}
      <mesh position={[0, 1.2, 0.025]}>
        <planeGeometry args={[2.1, 0.55]} />
        <meshStandardMaterial color="#7c3aed" roughness={0.3} metalness={0.2} transparent opacity={opacity} />
      </mesh>
      {/* Name text lines */}
      {[0.7, 0.42, 0.14, -0.14].map((y, i) => (
        <mesh key={i} position={[i === 0 ? 0 : -0.3, y, 0.025]}>
          <planeGeometry args={[i === 0 ? 1.4 : 1.0 - i * 0.1, 0.07]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} transparent opacity={opacity * 0.9} />
        </mesh>
      ))}
      {/* Section dividers */}
      {[-0.28, -0.75, -1.1].map((y, i) => (
        <mesh key={i} position={[0, y, 0.025]}>
          <planeGeometry args={[2.0, 0.03]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.5} transparent opacity={opacity * 0.7} />
        </mesh>
      ))}
      {/* Body text rows */}
      {[-0.38, -0.5, -0.62, -0.88, -1.0, -1.22, -1.34, -1.46].map((y, i) => (
        <mesh key={i} position={[i % 2 === 0 ? -0.15 : 0.1, y, 0.025]}>
          <planeGeometry args={[i % 3 === 0 ? 1.6 : 1.2, 0.055]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} transparent opacity={opacity * 0.6} />
        </mesh>
      ))}
      {/* Avatar circle */}
      <mesh position={[0.72, 1.2, 0.03]}>
        <circleGeometry args={[0.22, 32]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.3} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const count = 60;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#a78bfa" transparent opacity={0.6} />
    </points>
  );
}

function AINodes() {
  const nodes = useMemo(() => Array.from({ length: 6 }, (_, i) => ({
    angle: (i / 6) * Math.PI * 2,
    radius: 2.8,
    id: i,
  })), []);

  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map(({ angle, radius, id }) => (
        <group key={id} position={[Math.cos(angle) * radius, Math.sin(angle * 0.5) * 0.8, Math.sin(angle) * radius]}>
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#0ea5e9"
              emissive="#0ea5e9"
              emissiveIntensity={0.8}
              roughness={0}
              metalness={1}
            />
          </mesh>
          {/* Glow ring */}
          <mesh>
            <torusGeometry args={[0.18, 0.02, 8, 32]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Scene3D() {
  const mainRef = useRef();

  useFrame((state) => {
    if (mainRef.current) {
      mainRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#7c3aed" />
      <pointLight position={[-5, -3, -5]} intensity={1} color="#0ea5e9" />
      <pointLight position={[0, 8, 0]} intensity={0.8} color="#a78bfa" />
      <spotLight position={[0, 10, 5]} intensity={2} angle={0.3} penumbra={0.5} color="#ffffff" />

      <FloatingParticles />
      <AINodes />

      {/* Main resume - center, floating */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <group ref={mainRef} position={[0, 0, 0]}>
          <ResumeSheet position={[0, 0, 0]} rotation={[0.1, -0.3, 0.05]} scale={1} opacity={1} />
        </group>
      </Float>

      {/* Background resumes - blurred effect via opacity */}
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
        <ResumeSheet position={[-2.2, 0.4, -1.8]} rotation={[0.05, 0.4, -0.08]} scale={0.75} opacity={0.35} />
      </Float>
      <Float speed={0.9} rotationIntensity={0.1} floatIntensity={0.4}>
        <ResumeSheet position={[2.4, -0.5, -2.2]} rotation={[-0.05, -0.5, 0.06]} scale={0.7} opacity={0.25} />
      </Float>
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.35}>
        <ResumeSheet position={[1.6, 1.4, -3.5]} rotation={[0.1, 0.3, 0.1]} scale={0.55} opacity={0.15} />
      </Float>
    </>
  );
}
