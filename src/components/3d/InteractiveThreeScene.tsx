
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
// Remove the framer-motion-3d import and use standard framer-motion
import { motion } from 'framer-motion';
import { useSpring } from '@react-spring/three';

interface InteractiveThreeSceneProps {
  color?: string;
  count?: number;
  size?: number;
  mouseInfluence?: number;
}

const InteractiveThreeScene = ({
  color = "#3fb950",
  count = 2000,
  size = 0.06,
  mouseInfluence = 0.05,
}: InteractiveThreeSceneProps) => {
  // Create a reference to the points object
  const pointsRef = useRef<THREE.Points>(null!);
  
  // Get the mouse and viewport from Three
  const { mouse, viewport } = useThree();
  
  // Store the original particle positions
  const [particlePositions, setParticlePositions] = useState<Float32Array | null>(null);
  
  // Store texture
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Load texture
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/images/particle.png', (loadedTexture) => {
      loadedTexture.premultiplyAlpha = true;
      setTexture(loadedTexture);
    });
  }, []);
  
  // Spring for smooth camera movement
  const [{ cameraX, cameraY }] = useSpring(() => ({
    cameraX: 0,
    cameraY: 0,
    config: { mass: 1, tension: 100, friction: 30 },
  }));
  
  // Create particle positions
  useEffect(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create particles in a more cloud-like formation to match the nebula image
      const radius = Math.random() * 5 + 0.5;
      const phi = Math.acos((Math.random() * 2) - 1);
      const theta = Math.random() * Math.PI * 2;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
      positions[i * 3 + 2] = radius * Math.cos(phi) * 0.5;            // z - flatter on z-axis
    }
    
    setParticlePositions(positions);
  }, [count]);
  
  // Animation frame loop
  useFrame((state) => {
    if (!pointsRef.current || !particlePositions) return;
    
    // Rotate the particle system
    pointsRef.current.rotation.y += 0.0008;
    
    // Apply mouse influence to camera
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouse.x * mouseInfluence,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      mouse.y * mouseInfluence,
      0.05
    );
    
    // Look at center
    state.camera.lookAt(0, 0, 0);
    
    // Update uniforms
    if (pointsRef.current.material instanceof THREE.ShaderMaterial) {
      pointsRef.current.material.uniforms.time.value = state.clock.getElapsedTime();
      pointsRef.current.material.uniforms.mousePosition.value.set(
        mouse.x * viewport.width / 2,
        mouse.y * viewport.height / 2
      );
    }
  });
  
  // Custom shader for interactive particles
  const particleShader = {
    uniforms: {
      pointTexture: { value: texture || new THREE.TextureLoader().load('/images/particle.png') },
      time: { value: 0 },
      mousePosition: { value: new THREE.Vector2(0, 0) },
      color: { value: new THREE.Color(color) }
    },
    vertexShader: `
      uniform float time;
      uniform vec2 mousePosition;
      
      attribute float size;
      varying vec3 vColor;
      
      void main() {
        // Add subtle variation to color based on position
        vColor = vec3(${color.replace('#', '0x')}) * (1.0 + sin(position.x * 0.5 + time * 0.2) * 0.2);
        
        // Apply time-based animation
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // Apply subtle wave effect
        float wave = sin(position.x * 1.5 + time) * 0.1 + 
                     sin(position.y * 1.5 + time * 0.8) * 0.1;
        mvPosition.z += wave;
        
        // Mouse interaction
        float dist = length(mousePosition - vec2(position.xy));
        float mouseEffect = max(0.0, 1.0 - dist / 5.0);
        mvPosition.z += mouseEffect * 0.5;
        
        gl_Position = projectionMatrix * mvPosition;
        
        // Vary size slightly based on position for more natural look
        float sizeFactor = 1.0 + sin(position.x * 3.0 + position.y * 2.0) * 0.3;
        gl_PointSize = size * sizeFactor * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      
      void main() {
        vec4 texColor = texture2D(pointTexture, gl_PointCoord);
        gl_FragColor = vec4(vColor, 1.0) * texColor;
        
        // Enhance the alpha blending to match the nebula effect
        if (gl_FragColor.a < 0.05) discard;
      }
    `
  };
  
  if (!particlePositions) return null;
  
  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          attach="material"
          args={[particleShader]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default InteractiveThreeScene;
