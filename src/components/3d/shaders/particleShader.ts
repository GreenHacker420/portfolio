
import * as THREE from 'three';

export const createParticleShader = (color: string, texture: THREE.Texture | null) => {
  return {
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
};
