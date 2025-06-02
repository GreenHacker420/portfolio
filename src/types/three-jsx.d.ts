// Three.js JSX type definitions for React Three Fiber
import { Object3DNode } from '@react-three/fiber'
import * as THREE from 'three'

// Extend the JSX namespace to include Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<THREE.Group, typeof THREE.Group>
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>
      boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>
      sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>
      cylinderGeometry: Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>
      meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>
      meshBasicMaterial: Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>
      meshPhongMaterial: Object3DNode<THREE.MeshPhongMaterial, typeof THREE.MeshPhongMaterial>
      pointsMaterial: Object3DNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>
      points: Object3DNode<THREE.Points, typeof THREE.Points>
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>
      spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>
      hemisphereLight: Object3DNode<THREE.HemisphereLight, typeof THREE.HemisphereLight>
      primitive: Object3DNode<THREE.Object3D, typeof THREE.Object3D>
    }
  }
}
