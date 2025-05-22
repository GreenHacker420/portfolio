import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import {
  OrbitControls,
  Environment,
  Text,
  Html,
  Sparkles,
  ContactShadows,
  useTexture
} from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { motion, AnimatePresence } from 'framer-motion';
import { skills, skillsMap, Skill } from '../../../data/skillsData';
import { KEYBOARD_LAYOUT } from '../../../data/keyboardData';
import { playKeySound, initAudio } from '../../../utils/soundUtils';
import { hexToRgb } from '../../../utils/keyboardUtils';
import { loadTexture, getSkillLogoUrl, createFallbackTexture } from '../../../utils/logoUtils';

// Define keyboard theme interface
interface KeyboardTheme {
  name: string;
  description: string;
  baseColor: string;
  keycapColor: string;
  textColor: string;
  accentColor: string;
  metalness: number;
  roughness: number;
  rgbLight: boolean;
  soundType: 'blue' | 'brown' | 'red' | 'silent';
  ambientLightColor: string;
  ambientLightIntensity: number;
  spotLightColor: string;
  spotLightIntensity: number;
  environmentPreset: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
}

// Custom hook for WebGL context loss detection
const useWebGLContextLoss = () => {
  const [hasLostContext, setHasLostContext] = useState(false);

  useEffect(() => {
    const handleContextLoss = () => {
      console.warn('WebGL context lost');
      setHasLostContext(true);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      setHasLostContext(false);
    };

    window.addEventListener('webglcontextlost', handleContextLoss);
    window.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLoss);
      window.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  return hasLostContext;
};

// Custom hook for cleaning up Three.js resources
const useThreeCleanup = (ref: React.RefObject<THREE.Object3D>) => {
  useEffect(() => {
    return () => {
      if (ref.current) {
        // Dispose geometries and materials
        ref.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) {
              object.geometry.dispose();
            }

            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => material.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [ref]);
};

// Loading screen component
const LoadingScreen = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-green border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white text-lg">Loading Mechanical Keyboard...</p>
      </div>
    </Html>
  );
};

// WebGL context recovery component
const WebGLContextRecovery = () => {
  const { gl } = useThree();

  useEffect(() => {
    // Set up context loss handling
    const canvas = gl.domElement;

    const handleContextLoss = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context loss detected in recovery component');
    };

    canvas.addEventListener('webglcontextlost', handleContextLoss);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLoss);
    };
  }, [gl]);

  return null;
};

// Keycap component for reuse
const Keycap = ({
  size,
  color,
  y,
  isHovered,
  isPressed,
  theme,
  performanceMode,
  skillLogo,
  keyLabel,
  skillId
}: {
  size: [number, number, number],
  color: THREE.Color,
  y: any, // Using any for spring value compatibility
  isHovered: boolean,
  isPressed: boolean,
  theme: KeyboardTheme,
  performanceMode: boolean,
  skillLogo?: string,
  keyLabel: string,
  skillId?: string
}) => {
  // Create a glow effect when hovered or pressed
  const emissive = isHovered
    ? new THREE.Color(color).multiplyScalar(0.3)
    : isPressed
      ? new THREE.Color(color).multiplyScalar(0.5)
      : new THREE.Color(0x000000);

  // Create a reference to the keycap mesh
  const keycapRef = useRef<THREE.Mesh>(null);
  const logoRef = useRef<THREE.Mesh>(null);

  // State for logo texture
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Load logo texture if skillId is provided
  useEffect(() => {
    if (skillId) {
      const logoUrl = getSkillLogoUrl(skillId);
      loadTexture(logoUrl)
        .then(texture => {
          texture.colorSpace = THREE.SRGBColorSpace;
          setLogoTexture(texture);
          setLogoLoaded(true);
        })
        .catch(error => {
          console.error(`Failed to load logo for ${skillId}:`, error);
          // Create fallback texture with skill name
          const fallback = createFallbackTexture(skillId.toUpperCase());
          setLogoTexture(fallback);
          setLogoLoaded(true);
        });
    }
  }, [skillId]);

  // Use cleanup hook to dispose of resources when component unmounts
  useThreeCleanup(keycapRef);

  // Calculate dimensions for a realistic keycap
  const keycapWidth = size[0] * 0.95;
  const keycapHeight = size[1];
  const keycapDepth = size[2] * 0.95;

  // Calculate dimensions for the concave top surface
  const topWidth = keycapWidth * 0.9;
  const topDepth = keycapDepth * 0.9;

  // Create a more complex geometry for the keycap with a concave top
  const keycapGeometry = useMemo(() => {
    // Create a custom geometry for the keycap
    const geometry = new THREE.BufferGeometry();

    // Define vertices for a keycap with slightly concave top
    const concaveFactor = 0.03; // How concave the top surface is

    // Base vertices (bottom of keycap)
    const baseVertices = [
      // Bottom face (facing down)
      -keycapWidth/2, -keycapHeight/2, -keycapDepth/2, // 0: bottom left back
      keycapWidth/2, -keycapHeight/2, -keycapDepth/2,  // 1: bottom right back
      keycapWidth/2, -keycapHeight/2, keycapDepth/2,   // 2: bottom right front
      -keycapWidth/2, -keycapHeight/2, keycapDepth/2,  // 3: bottom left front

      // Top face vertices (with concave shape)
      -topWidth/2, keycapHeight/2 - concaveFactor, -topDepth/2, // 4: top left back
      topWidth/2, keycapHeight/2 - concaveFactor, -topDepth/2,  // 5: top right back
      topWidth/2, keycapHeight/2 - concaveFactor, topDepth/2,   // 6: top right front
      -topWidth/2, keycapHeight/2 - concaveFactor, topDepth/2,  // 7: top left front

      // Center of top face (lowest point of concave)
      0, keycapHeight/2 - concaveFactor*2, 0 // 8: center top
    ];

    // Define faces using indices (triangles)
    const indices = [
      // Bottom face
      0, 1, 2,
      0, 2, 3,

      // Side faces
      0, 4, 5,
      0, 5, 1,
      1, 5, 6,
      1, 6, 2,
      2, 6, 7,
      2, 7, 3,
      3, 7, 4,
      3, 4, 0,

      // Top face (concave with triangles to center)
      4, 8, 5,
      5, 8, 6,
      6, 8, 7,
      7, 8, 4
    ];

    // Set attributes
    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(baseVertices, 3));

    // Add UV coordinates for texture mapping
    const uvs = [
      // Bottom face
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // Top face
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // Center
      0.5, 0.5
    ];

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    return geometry;
  }, [keycapWidth, keycapHeight, keycapDepth, topWidth, topDepth]);

  // Create a plane geometry for the logo
  const logoGeometry = useMemo(() => {
    return new THREE.PlaneGeometry(size[0] * 0.6, size[0] * 0.6);
  }, [size]);

  return (
    <animated.group position-y={y}>
      <mesh
        ref={keycapRef}
        geometry={keycapGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={theme.metalness}
          roughness={theme.roughness}
          emissive={emissive}
        />
      </mesh>

      {/* Key label */}
      <Text
        position={[0, keycapHeight/2 + 0.01, -keycapDepth/4]}
        rotation={[-Math.PI/2, 0, 0]}
        fontSize={size[0] * 0.25}
        color={theme.textColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={keycapWidth * 0.8}
        overflowWrap="break-word"
        textAlign="center"
      >
        {keyLabel}
      </Text>

      {/* Skill logo if texture is loaded */}
      {logoLoaded && logoTexture && (
        <mesh
          ref={logoRef}
          geometry={logoGeometry}
          position={[0, keycapHeight/2 + 0.015, keycapDepth/4]}
          rotation={[-Math.PI/2, 0, 0]}
        >
          <meshBasicMaterial
            map={logoTexture}
            transparent={true}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Add sparkles for RGB effect if theme has RGB and not in performance mode */}
      {theme.rgbLight && isHovered && !performanceMode && (
        <Sparkles
          count={3}
          scale={[size[0], size[1], size[2]]}
          size={4}
          speed={0.2}
          opacity={0.15}
          color={theme.accentColor}
        />
      )}
    </animated.group>
  );
};

// 3D Key Component
interface KeyProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  text: string;
  name: string;
  icon: string;
  skillId?: string;
  isPressed: boolean;
  onClick: () => void;
  theme: KeyboardTheme;
  performanceMode: boolean;
}

const Key = ({ position, size, color, text, icon, skillId, isPressed, onClick, theme, performanceMode }: KeyProps) => {
  const [hovered, setHovered] = useState(false);
  const [wasPressed, setWasPressed] = useState(false);
  const keyRef = useRef<THREE.Group>(null);

  // Use cleanup hook to dispose of resources when component unmounts
  useThreeCleanup(keyRef);

  // Spring animation for key press
  const { y } = useSpring({
    y: isPressed ? -0.04 : 0,
    config: {
      mass: 1,
      tension: 200,
      friction: isPressed ? 10 : 20
    }
  });

  // Convert hex color to Three.js color
  const keyColor = new THREE.Color(color);

  // Handle pointer events with improved interaction
  const handlePointerOver = useCallback(() => {
    setHovered(true);
    // Initialize audio on first interaction
    initAudio();
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
  }, []);

  // Handle click with sound and improved event handling
  const handleClick = useCallback(() => {
    // Play sound effect
    playKeySound(theme.soundType);

    // Call the onClick handler
    onClick();
  }, [onClick, theme.soundType]);

  // Add pointer down/up handlers for better mobile support
  const handlePointerDown = useCallback(() => {
    setHovered(true);
    initAudio();
  }, []);

  const handlePointerUp = useCallback(() => {
    // Instead of calling handleClick which might cause issues,
    // directly handle the pointer up event
    playKeySound(theme.soundType);
    onClick();
  }, [onClick, theme.soundType]);

  // Add particle trail effect for pressed keys - only when not in performance mode
  const trailVisible = (isPressed || (wasPressed && !isPressed)) && !performanceMode;

  // Add subtle floating animation - optimized for performance mode
  useFrame(({ clock }) => {
    if (keyRef.current && hovered && !isPressed && !performanceMode) {
      // Very subtle floating effect when hovered - skip in performance mode
      keyRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 3) * 0.01;
    }
  });

  // Update wasPressed state when isPressed changes
  useEffect(() => {
    if (isPressed) {
      setWasPressed(true);
    } else {
      // Reset wasPressed after a delay
      const timer = setTimeout(() => {
        setWasPressed(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPressed]);

  return (
    <group
      ref={keyRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Key switch (stem) */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[0.14, 0.1, 0.14]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Key spring */}
      <mesh position={[0, -0.09, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.1, 8, 1, true]} />
        <meshStandardMaterial color="#555555" wireframe={true} />
      </mesh>

      {/* Keycap with spring animation */}
      <Keycap
        size={size}
        color={keyColor}
        y={y}
        isHovered={hovered}
        isPressed={isPressed}
        theme={theme}
        performanceMode={performanceMode}
        skillLogo={icon}
        keyLabel={text}
        skillId={skillId}
      />

      {/* Particle trail effect for pressed keys */}
      {trailVisible && !performanceMode && (
        <Sparkles
          count={10}
          scale={[0.5, 0.5, 0.5]}
          size={3}
          speed={0.3}
          opacity={0.2}
          color={theme.accentColor}
        />
      )}
    </group>
  );
};

// Keyboard base component
interface KeyboardBaseProps {
  theme: KeyboardTheme;
  performanceMode: boolean;
  baseWidth: number;
  baseDepth: number;
}

const KeyboardBase = ({ theme, performanceMode, baseWidth, baseDepth }: KeyboardBaseProps) => {
  const baseHeight = 0.5;

  // Create refs for animations and cleanup
  const baseRef = useRef<THREE.Group>(null);

  // Use cleanup hook to dispose of resources when component unmounts
  useThreeCleanup(baseRef);

  // Create materials for different parts of the keyboard
  const baseMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: theme.baseColor,
      metalness: theme.metalness + 0.1,
      roughness: theme.roughness - 0.1,
      envMapIntensity: 1.0
    });
  }, [theme.baseColor, theme.metalness, theme.roughness]);

  // Create top plate material
  const topPlateMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: theme.baseColor,
      metalness: theme.metalness + 0.15,
      roughness: theme.roughness - 0.15,
      envMapIntensity: 1.2
    });
  }, [theme.baseColor, theme.metalness, theme.roughness]);

  // Create edge material with RGB glow
  const edgeMaterial = useMemo(() => {
    const rgbColor = hexToRgb(theme.accentColor);
    return new THREE.MeshStandardMaterial({
      color: theme.baseColor,
      metalness: theme.metalness + 0.2,
      roughness: theme.roughness - 0.2,
      emissive: new THREE.Color(rgbColor[0], rgbColor[1], rgbColor[2]),
      emissiveIntensity: theme.rgbLight ? 0.5 : 0.1
    });
  }, [theme.baseColor, theme.accentColor, theme.metalness, theme.roughness, theme.rgbLight]);

  // Create bottom material
  const bottomMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#111111",
      metalness: 0.2,
      roughness: 0.9
    });
  }, []);

  // Animate RGB glow
  useFrame(({ clock }) => {
    if (baseRef.current && theme.rgbLight && !performanceMode) {
      const time = clock.getElapsedTime();
      const intensity = 0.3 + Math.sin(time * 2) * 0.2;

      // Update edge material emissive intensity
      baseRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material === edgeMaterial) {
          child.material.emissiveIntensity = intensity;
        }
      });
    }
  });

  return (
    <group ref={baseRef}>
      {/* Top plate where keys will be mounted */}
      <mesh position={[0, 0.05, 0]} material={topPlateMaterial} castShadow receiveShadow>
        <boxGeometry args={[baseWidth, 0.1, baseDepth]} />
      </mesh>

      {/* Main keyboard case with height */}
      <mesh position={[0, -baseHeight/2 + 0.05, 0]} material={baseMaterial} castShadow receiveShadow>
        <boxGeometry args={[baseWidth, baseHeight, baseDepth]} />
      </mesh>

      {/* Beveled top edges with RGB glow */}
      <mesh position={[0, 0, 0]} material={edgeMaterial} castShadow>
        <boxGeometry args={[baseWidth + 0.2, 0.05, baseDepth + 0.2]} />
      </mesh>

      {/* RGB strip around the middle of the case */}
      <mesh position={[0, -baseHeight/2 + 0.05, 0]} material={edgeMaterial} castShadow>
        <boxGeometry args={[baseWidth + 0.1, baseHeight - 0.1, baseDepth + 0.1]} />
      </mesh>

      {/* Bottom plate */}
      <mesh position={[0, -baseHeight, 0]} material={bottomMaterial} castShadow>
        <boxGeometry args={[baseWidth - 0.2, 0.1, baseDepth - 0.2]} />
      </mesh>

      {/* Angled front edge for ergonomics */}
      <mesh position={[0, -baseHeight/2 + 0.1, baseDepth/2 + 0.1]} rotation={[Math.PI/6, 0, 0]} material={baseMaterial} castShadow>
        <boxGeometry args={[baseWidth, 0.3, 0.2]} />
      </mesh>

      {/* Rubber feet at corners */}
      <mesh position={[baseWidth/2 - 0.5, -baseHeight - 0.025, baseDepth/2 - 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#111111" roughness={1} />
      </mesh>
      <mesh position={[baseWidth/2 - 0.5, -baseHeight - 0.025, -baseDepth/2 + 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#111111" roughness={1} />
      </mesh>
      <mesh position={[-baseWidth/2 + 0.5, -baseHeight - 0.025, baseDepth/2 - 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#111111" roughness={1} />
      </mesh>
      <mesh position={[-baseWidth/2 + 0.5, -baseHeight - 0.025, -baseDepth/2 + 0.3]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
        <meshStandardMaterial color="#111111" roughness={1} />
      </mesh>

      {/* USB Cable */}
      <group position={[0, -baseHeight/2, -baseDepth/2 - 0.1]} rotation={[Math.PI/2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 8]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      {/* Cable strain relief */}
      <mesh position={[0, -baseHeight/2, -baseDepth/2 - 0.05]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

// Keyboard component props
interface KeyboardProps {
  onSelectKey: (key: string) => void;
  selectedKey: string | null;
  theme: KeyboardTheme;
  performanceMode: boolean;
}

const Keyboard = ({ onSelectKey, selectedKey, theme, performanceMode }: KeyboardProps) => {
  const keySpacing = 0.15;
  const keySize: [number, number, number] = [1, 0.08, 1];

  // Use frame to create subtle floating animation
  const groupRef = useRef<THREE.Group>(null);

  // Use cleanup hook to dispose of resources when component unmounts
  useThreeCleanup(groupRef);

  // Check for WebGL context loss
  const hasLostContext = useWebGLContextLoss();

  // If context is lost, show fallback
  if (hasLostContext) {
    return (
      <Html center>
        <div className="bg-black/70 text-white p-4 rounded">
          <p>WebGL context lost. Please refresh the page.</p>
        </div>
      </Html>
    );
  }

  // --- Calculate base size dynamically ---
  const getKeyboardDimensions = () => {
    // Find the widest row
    let maxRowWidth = 0;
    KEYBOARD_LAYOUT.forEach(row => {
      const width = row.reduce((sum, key, idx) => {
        const keyWidth = (key.physical?.size?.[0] || 1);
        return sum + keyWidth + (idx < row.length - 1 ? 0.15 : 0);
      }, 0);
      if (width > maxRowWidth) maxRowWidth = width;
    });
    const totalRows = KEYBOARD_LAYOUT.length;
    const rowDepth = 1 + 0.15; // 1 unit depth per key, 0.15 spacing
    const totalDepth = totalRows * rowDepth - 0.15;
    return { baseWidth: maxRowWidth, baseDepth: totalDepth };
  };

  const { baseWidth, baseDepth } = getKeyboardDimensions();

  // Create keyboard layout with memoization to prevent unnecessary re-renders
  const keyboardLayout = useMemo(() => {
    const totalRows = KEYBOARD_LAYOUT.length;
    const rowDepth = keySize[2] + keySpacing;
    const totalDepth = totalRows * rowDepth - keySpacing;

    return KEYBOARD_LAYOUT.map((row, rowIndex) => {
      // Calculate row width
      const rowWidth = row.reduce((sum, key, idx) => {
        const width = (key.physical?.size?.[0] || 1) * keySize[0];
        return sum + width + (idx < row.length - 1 ? keySpacing : 0);
      }, 0);

      // Center row on X, position row on Z
      const rowZ = (rowIndex * rowDepth) - (totalDepth / 2) + rowDepth / 2;

      return (
        <group key={`row-${rowIndex}`} position={[0, 0, rowZ]}>
          {row.map((key, keyIndex) => {
            // X position for each key
            let posX = 0;
            for (let i = 0; i < keyIndex; i++) {
              posX += ((row[i].physical?.size?.[0] || 1) * keySize[0]) + keySpacing;
            }
            const keyWidth = (key.physical?.size?.[0] || 1) * keySize[0];
            const finalX = posX + keyWidth / 2 - rowWidth / 2;

            // Key color and size
            const skillData = key.skillId ? skills[skillsMap[key.skillId]] : undefined;
            const keyColor = skillData ? skillData.color : theme.keycapColor;
            const scaledSize: [number, number, number] = [
              keyWidth,
              keySize[1],
              keySize[2] * (key.physical?.size?.[0] || 1)
            ];

            return (
              <Key
                key={key.id}
                position={[finalX, 0, 0]}
                size={scaledSize}
                color={keyColor}
                text={key.label}
                name={key.id}
                icon={skillData?.logo || ''}
                skillId={key.skillId}
                isPressed={selectedKey === key.id}
                onClick={() => onSelectKey(key.id)}
                theme={theme}
                performanceMode={performanceMode}
              />
            );
          })}
        </group>
      );
    });
  }, [keySize, keySpacing, selectedKey, onSelectKey, theme, performanceMode]);

  // Add a subtle floating animation to the entire keyboard
  useFrame(({ clock }) => {
    if (groupRef.current && !performanceMode) {
      // Very subtle floating effect
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05;
      // Very subtle rotation
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.01;
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.005;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]} rotation={[-0.1, 0, 0]}>
      {/* Keyboard base */}
      <KeyboardBase
        theme={theme}
        performanceMode={performanceMode}
        baseWidth={baseWidth}
        baseDepth={baseDepth}
      />

      {/* Key layout - positioned on top of the base */}
      <group position={[0, 0.15, 0]}>
        {keyboardLayout}
      </group>
    </group>
  );

};

// Skill card component to display when a key is pressed
interface SkillCardProps {
  skill: Skill | null;
  isVisible: boolean;
  onClose: () => void;
}

const SkillCard = ({ skill, isVisible, onClose }: SkillCardProps) => {
  // Debug logging
  useEffect(() => {
    if (isVisible && skill) {
      console.log("SkillCard rendered with skill:", skill.name);
    }
  }, [isVisible, skill]);

  if (!skill) return null;

  // Calculate experience level text
  const getExperienceLevel = (years: number): string => {
    if (years < 1) return 'Beginner';
    if (years < 2) return 'Intermediate';
    if (years < 4) return 'Advanced';
    return 'Expert';
  };

  // Calculate proficiency color
  const getProficiencyColor = (proficiency: number): string => {
    if (proficiency < 60) return '#f97316'; // Orange
    if (proficiency < 80) return '#22c55e'; // Green
    return '#3b82f6'; // Blue
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-github-dark/95 border border-github-border rounded-lg p-5 w-full max-w-md z-50 shadow-xl"
          style={{ backdropFilter: 'blur(12px)' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-github-text hover:text-white transition-colors"
            aria-label="Close skill details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Header with logo and name */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ backgroundColor: skill.color }}
            >
              {skill.logo}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">{skill.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-github-text font-medium">{getExperienceLevel(skill.experience)}</span>
                <span className="text-github-text text-sm">•</span>
                <span className="text-github-text">{skill.experience} years</span>
              </div>
            </div>
          </div>

          {/* Proficiency bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-medium">Proficiency</span>
              <span className="text-white font-bold">{skill.proficiency}%</span>
            </div>
            <div className="h-3 bg-github-light/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${skill.proficiency}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: skill.color }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-github-text mb-4 leading-relaxed">{skill.description}</p>

          {/* Projects */}
          <div className="mb-4">
            <h4 className="text-white font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Projects
            </h4>
            <ul className="space-y-1 text-github-text">
              {skill.projects && skill.projects.map((project, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-xs mr-2 mt-1">•</span>
                  {project}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Strengths */}
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              Key Strengths
            </h4>
            <div className="flex flex-wrap gap-2">
              {skill.strengths && skill.strengths.map((strength, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${skill.color}22`,
                    color: skill.color,
                    border: `1px solid ${skill.color}44`
                  }}
                >
                  {strength}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Component
const KeyboardSkills = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [lastPressed, setLastPressed] = useState<number>(0);
  // Add theme state with default theme
  const fallbackTheme: KeyboardTheme = {
    name: 'Default',
    description: 'Default keyboard theme',
    baseColor: '#333',
    keycapColor: '#444',
    textColor: '#fff',
    accentColor: '#0f0',
    metalness: 0.2,
    roughness: 0.5,
    rgbLight: false,
    soundType: 'blue',
    ambientLightColor: '#ffffff',
    ambientLightIntensity: 0.5,
    spotLightColor: '#ffffff',
    spotLightIntensity: 0.8,
    environmentPreset: 'studio'
  };

  const [currentTheme] = useState<KeyboardTheme>(fallbackTheme);
  const [performanceMode, setPerformanceMode] = useState<boolean>(false);
  const [showSkillInfo, setShowSkillInfo] = useState<boolean>(false);

  // Get selected skill data
  const selectedSkill = useMemo(() => {
    if (!selectedKey) return null;

    // Find the key in the keyboard layout
    const flatLayout = KEYBOARD_LAYOUT.flat();
    const keyData = flatLayout.find(key => key.id === selectedKey);

    if (!keyData || !keyData.skillId) return null;

    return skills[skillsMap[keyData.skillId]] || null;
  }, [selectedKey]);

  // Handle key selection
  const handleSelectKey = useCallback((key: string) => {
    // Check if this is a skill key
    const flatLayout = KEYBOARD_LAYOUT.flat();
    const keyData = flatLayout.find(k => k.id === key);
    const hasSkill = keyData && keyData.skillId;

    // Only toggle if it's not the same key or if it has a skill
    if (hasSkill) {
      setSelectedKey(prev => prev === key ? null : key);
      setLastPressed(Date.now());
      setShowSkillInfo(true);

      // Initialize audio and play sound
      initAudio();
      playKeySound(currentTheme.soundType);

      // Log for debugging
      console.log(`Key pressed: ${key}, Skill ID: ${keyData?.skillId}`);
      if (keyData?.skillId) {
        const skillInfo = skills[skillsMap[keyData.skillId]];
        console.log("Skill info:", skillInfo);
      }
    } else {
      // For non-skill keys, just play sound
      initAudio();
      playKeySound(currentTheme.soundType);
    }
  }, [currentTheme.soundType]);

  // Handle closing the skill card
  const handleCloseSkillCard = useCallback(() => {
    setShowSkillInfo(false);
    // Optional: also deselect the key
    setSelectedKey(null);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Map keyboard keys to skill keys
      const key = e.key.toLowerCase();

      // Check for escape key to close skill info
      if (e.key === 'Escape' && showSkillInfo) {
        handleCloseSkillCard();
        return;
      }

      // Find matching key in layout
      const flatLayout = KEYBOARD_LAYOUT.flat();
      const matchingKey = flatLayout.find(k =>
        k.label.toLowerCase() === key ||
        k.id.toLowerCase() === key
      );

      if (matchingKey) {
        handleSelectKey(matchingKey.id);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSelectKey, showSkillInfo, handleCloseSkillCard]);

  // Hide skill info after delay (only if auto-hide is desired)
  useEffect(() => {
    if (selectedKey) {
      // Reset any existing timers
      setShowSkillInfo(true);

      // Auto-hide after delay (comment this out if you prefer manual closing only)
      const timer = setTimeout(() => {
        setShowSkillInfo(false);
      }, 15000); // Increased to 15 seconds for better readability

      return () => clearTimeout(timer);
    }
  }, [selectedKey, lastPressed]);

  // Debug logging for skill selection
  useEffect(() => {
    if (selectedKey) {
      console.log("Selected key:", selectedKey);
      console.log("Selected skill:", selectedSkill);
      console.log("Show skill info:", showSkillInfo);
    }
  }, [selectedKey, selectedSkill, showSkillInfo]);

  // Toggle performance mode based on device capabilities
  useEffect(() => {
    // Check if device is likely to have performance issues
    const isLowPerfDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.innerWidth < 768);

    setPerformanceMode(isLowPerfDevice);
  }, []);

  return (
    <div className="relative w-full h-[600px] flex flex-col items-center justify-center">
      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 4, 10], fov: 45 }}
          dpr={performanceMode ? 1 : [1, 2]}
          style={{ background: 'transparent' }}
          gl={{
            antialias: !performanceMode,
            alpha: true,
            powerPreference: 'high-performance'
          }}
        >
          <Suspense fallback={< LoadingScreen />}>
            {/* WebGL context recovery component */}
            <WebGLContextRecovery />

            {/* Optimized lighting based on performance mode */}
            <ambientLight intensity={currentTheme.ambientLightIntensity} color={currentTheme.ambientLightColor} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={currentTheme.spotLightIntensity}
              color={currentTheme.spotLightColor}
              castShadow={!performanceMode}
            />

            {/* Environment for reflections */}
            <Environment preset={currentTheme.environmentPreset} />

            {/* Keyboard with error handling */}
            <Keyboard
              onSelectKey={handleSelectKey}
              selectedKey={selectedKey}
              theme={currentTheme}
              performanceMode={performanceMode}
            />

            {/* Shadows */}
            {!performanceMode && (
              <ContactShadows
                position={[0, -0.5, 0]}
                opacity={0.5}
                scale={20}
                blur={1.5}
                far={1}
              />
            )}

            {/* Camera controls */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={true}
              rotateSpeed={0.3}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
              maxAzimuthAngle={Math.PI / 4}
              minAzimuthAngle={-Math.PI / 4}
              dampingFactor={0.1}
              enableDamping={true}
              autoRotate={false}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Skill information card - positioned outside the Canvas for better visibility */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <SkillCard
            skill={selectedSkill}
            isVisible={showSkillInfo && !!selectedSkill}
            onClose={handleCloseSkillCard}
          />
        </div>
      </div>

      {/* Hint text */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-github-text text-sm">
        Press a key to explore my skills
      </div>
    </div>
  );
};

export default KeyboardSkills;